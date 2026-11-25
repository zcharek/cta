import { ROLES, aujourdhui, bornesMois, estAdmin, type Role, type StatutAcces } from "../../../shared/cockpit.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import { emailInvitation, envoyerEmail, lienVisibleEnReponse, urlApplication } from "./emails.js";
import { creerJeton, lienMotDePasse } from "./jetons.js";
import type { Routeur } from "./router.js";
import { exigerAdmin, exigerProfil, type Profil } from "./session.js";
import { email, entier, estDoublon, idsListe, texte } from "./valider.js";

function role(v: unknown): Role {
  if (!ROLES.includes(v as Role)) throw new HttpError(400, "Type d'utilisateur invalide.");
  return v as Role;
}

/** Remplace la liste des clients d'un collaborateur (seuls les clients actifs sont retenus). */
async function affecterClients(profilId: string, clientIds: string[]) {
  await sql`DELETE FROM affectations WHERE profil_id = ${profilId} AND NOT (client_id = ANY(${clientIds}::uuid[]))`;
  await sql`
    INSERT INTO affectations (profil_id, client_id)
    SELECT ${profilId}, id FROM clients WHERE id = ANY(${clientIds}::uuid[]) AND actif
    ON CONFLICT DO NOTHING`;
}

/** Remplace l'équipe d'un client. */
async function affecterEquipe(clientId: string, profilIds: string[]) {
  await sql`DELETE FROM affectations WHERE client_id = ${clientId} AND NOT (profil_id = ANY(${profilIds}::uuid[]))`;
  await sql`
    INSERT INTO affectations (profil_id, client_id)
    SELECT id, ${clientId} FROM profils WHERE id = ANY(${profilIds}::uuid[]) AND actif
    ON CONFLICT DO NOTHING`;
}

async function inviter(req: Request, auteur: Profil, profil: { id: string; nom: string; email: string }) {
  const jeton = await creerJeton(profil.id, "invitation");
  const lien = lienMotDePasse(urlApplication(req), jeton);
  await sql`UPDATE profils SET invite_le = now() WHERE id = ${profil.id}`;
  try {
    await envoyerEmail(emailInvitation(profil.email, profil.nom, auteur.nom, lien));
  } catch (err) {
    const message = err instanceof HttpError ? err.message : "L'e-mail n'a pas pu être envoyé.";
    return { envoye: false, avertissement: `${message} Utilisez « Renvoyer l'invitation ».` };
  }
  return { envoye: true, ...(lienVisibleEnReponse() ? { lien } : {}) };
}

export function routesEquipe(r: Routeur) {
  r.ajouter("GET", "collaborateurs", async ({ req }) => {
    await exigerAdmin(req);
    const { debut, fin } = bornesMois(aujourdhui());
    const rows = await sql`
      SELECT p.id, p.nom, p.email, p.role, p.actif,
        p.mot_de_passe_hash IS NOT NULL AS a_mot_de_passe,
        p.invite_le::text AS invite_le, p.active_le::text AS active_le,
        COALESCE((SELECT json_agg(a.client_id) FROM affectations a WHERE a.profil_id = p.id), '[]'::json) AS client_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t JOIN semaines s ON s.id = t.semaine_id
                  WHERE s.profil_id = p.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
      FROM profils p
      ORDER BY p.actif DESC, p.nom`;
    const collaborateurs = rows.map(({ a_mot_de_passe, ...p }) => ({
      ...p,
      statut: (!p.actif ? "archive" : a_mot_de_passe ? "actif" : "invitation") satisfies StatutAcces,
    }));
    return json({ collaborateurs });
  });

  r.ajouter("POST", "collaborateurs", async ({ req }) => {
    const auteur = await exigerAdmin(req);
    const b = await readBody<Record<string, unknown>>(req);
    const p = { nom: texte(b.nom, "Nom"), email: email(b.email), role: role(b.role) };
    const clientIds = idsListe(b.clientIds, "Client");
    const rows = await sql`
      INSERT INTO profils (nom, email, role) VALUES (${p.nom}, ${p.email}, ${p.role})
      ON CONFLICT (email) DO NOTHING
      RETURNING id, nom, email`;
    if (!rows[0]) throw new HttpError(409, "Un collaborateur existe déjà avec cette adresse e-mail.");
    await affecterClients(rows[0].id, clientIds);
    const invitation = await inviter(req, auteur, rows[0] as { id: string; nom: string; email: string });
    return json({ id: rows[0].id, invitation }, { status: 201 });
  });

  r.ajouter("PATCH", "collaborateurs/:id", async ({ req, params }) => {
    const auteur = await exigerAdmin(req);
    const id = uuid(params.id, "Collaborateur");
    const b = await readBody<Record<string, unknown>>(req);
    const existant = (await sql`SELECT id, role, actif FROM profils WHERE id = ${id}`)[0];
    if (!existant) throw new HttpError(404, "Collaborateur introuvable.");

    const nom = b.nom === undefined ? null : texte(b.nom, "Nom");
    const mail = b.email === undefined ? null : email(b.email);
    const nouveauRole = b.role === undefined ? null : role(b.role);
    const actif = b.actif === undefined ? null : b.actif === true;
    if (b.actif !== undefined && typeof b.actif !== "boolean") throw new HttpError(400, "Valeur « actif » invalide.");

    // Évite de se retirer soi-même l'accès complet.
    if (id === auteur.id && (actif === false || (nouveauRole && !estAdmin({ role: nouveauRole, actif: true }))))
      throw new HttpError(400, "Vous ne pouvez pas archiver votre propre compte ni retirer votre accès complet.");

    try {
      await sql`
        UPDATE profils SET
          nom = COALESCE(${nom}, nom),
          email = COALESCE(${mail}, email),
          role = COALESCE(${nouveauRole}, role),
          actif = COALESCE(${actif}::boolean, actif)
        WHERE id = ${id}`;
    } catch (err) {
      if (estDoublon(err)) throw new HttpError(409, "Un autre collaborateur utilise déjà cette adresse e-mail.");
      throw err;
    }
    // Un compte archivé ne doit plus pouvoir utiliser un lien en attente.
    if (actif === false) await sql`DELETE FROM jetons WHERE profil_id = ${id} AND utilise_le IS NULL`;
    if (b.clientIds !== undefined) await affecterClients(id, idsListe(b.clientIds, "Client"));
    return json({ ok: true });
  });

  r.ajouter("POST", "collaborateurs/:id/invitation", async ({ req, params }) => {
    const auteur = await exigerAdmin(req);
    const id = uuid(params.id, "Collaborateur");
    const rows = await sql`SELECT id, nom, email, actif, mot_de_passe_hash IS NOT NULL AS a_mot_de_passe FROM profils WHERE id = ${id}`;
    const p = rows[0];
    if (!p) throw new HttpError(404, "Collaborateur introuvable.");
    if (!p.actif) throw new HttpError(409, "Ce collaborateur est archivé. Réactivez-le d'abord.");
    if (p.a_mot_de_passe) throw new HttpError(409, "Ce collaborateur a déjà défini son mot de passe.");
    return json({ invitation: await inviter(req, auteur, p as { id: string; nom: string; email: string }) });
  });

  // Un admin voit tout (dont le TJM) ; un collaborateur ne voit que ses clients assignés, sans TJM (équivalent de la vue mes_clients).
  r.ajouter("GET", "clients", async ({ req }) => {
    const moi = await exigerProfil(req);
    if (!estAdmin(moi)) {
      const clients = await sql`
        SELECT c.id, c.nom FROM clients c JOIN affectations a ON a.client_id = c.id
        WHERE a.profil_id = ${moi.id} AND c.actif ORDER BY c.nom`;
      return json({ clients });
    }
    const { debut, fin } = bornesMois(aujourdhui());
    const clients = await sql`
      SELECT c.id, c.nom, c.tjm_dzd, c.actif,
        COALESCE((SELECT json_agg(a.profil_id) FROM affectations a WHERE a.client_id = c.id), '[]'::json) AS profil_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t
                  WHERE t.client_id = c.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
      FROM clients c ORDER BY c.actif DESC, c.nom`;
    return json({ clients });
  });

  r.ajouter("POST", "clients", async ({ req }) => {
    await exigerAdmin(req);
    const b = await readBody<Record<string, unknown>>(req);
    const nom = texte(b.nom, "Nom du client");
    const tjm = entier(b.tjmDzd, "TJM");
    const rows = await sql`INSERT INTO clients (nom, tjm_dzd) VALUES (${nom}, ${tjm}) RETURNING id`;
    await affecterEquipe(rows[0]!.id, idsListe(b.profilIds, "Collaborateur"));
    return json({ id: rows[0]!.id }, { status: 201 });
  });

  r.ajouter("PATCH", "clients/:id", async ({ req, params }) => {
    await exigerAdmin(req);
    const id = uuid(params.id, "Client");
    const b = await readBody<Record<string, unknown>>(req);
    const nom = b.nom === undefined ? null : texte(b.nom, "Nom du client");
    const tjm = b.tjmDzd === undefined ? null : entier(b.tjmDzd, "TJM");
    if (b.actif !== undefined && typeof b.actif !== "boolean") throw new HttpError(400, "Valeur « actif » invalide.");
    const actif = b.actif === undefined ? null : b.actif;
    const rows = await sql`
      UPDATE clients SET nom = COALESCE(${nom}, nom), tjm_dzd = COALESCE(${tjm}::int, tjm_dzd), actif = COALESCE(${actif}::boolean, actif)
      WHERE id = ${id} RETURNING id`;
    if (!rows[0]) throw new HttpError(404, "Client introuvable.");
    if (b.profilIds !== undefined) await affecterEquipe(id, idsListe(b.profilIds, "Collaborateur"));
    return json({ ok: true });
  });
}
