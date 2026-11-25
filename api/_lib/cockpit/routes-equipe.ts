import {
  EMAIL_FOUNDER,
  ONGLETS,
  ROLES_ATTRIBUABLES,
  aujourdhui,
  bornesMois,
  gereLesAcces,
  ongletsDe,
  type Onglet,
  type Role,
  type StatutAcces,
} from "../../../shared/cockpit.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import { emailInvitation, envoyerEmail, lienVisibleEnReponse, urlApplication } from "./emails.js";
import { creerJeton, lienMotDePasse } from "./jetons.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerOnglet, exigerProfil, type Profil } from "./session.js";
import { email, entier, estDoublon, idsListe, texte } from "./valider.js";

function role(v: unknown): Role {
  if (!ROLES_ATTRIBUABLES.includes(v as Role)) throw new HttpError(400, "Type d'utilisateur invalide.");
  return v as Role;
}

function onglets(v: unknown): Onglet[] {
  if (!Array.isArray(v) || v.some((o) => !ONGLETS.includes(o))) throw new HttpError(400, "Liste d'onglets invalide.");
  return ONGLETS.filter((o) => v.includes(o));
}

const RESERVE_GESTION = "Seuls le Founder, un Co-Founder ou un QA Manager peuvent changer le type, les onglets ou l'archivage d'un utilisateur.";

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
    await exigerOnglet(req, "collaborateurs", "clients", "validation");
    const { debut, fin } = bornesMois(aujourdhui());
    const rows = await sql`
      SELECT p.id, p.nom, p.email, p.role, p.actif, p.onglets, p.telephone, p.adresse, p.ville, p.wilaya,
        p.date_naissance::text AS date_naissance, p.lieu_naissance,
        p.mot_de_passe_hash IS NOT NULL AS a_mot_de_passe,
        p.invite_le::text AS invite_le, p.active_le::text AS active_le,
        COALESCE((SELECT json_agg(a.client_id) FROM affectations a WHERE a.profil_id = p.id), '[]'::json) AS client_ids,
        COALESCE((SELECT sum(t.valeur) FROM temps t JOIN semaines s ON s.id = t.semaine_id
                  WHERE s.profil_id = p.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date), 0)::float8 AS jours_mois
      FROM profils p
      ORDER BY p.actif DESC, p.nom`;
    const collaborateurs = rows.map(({ a_mot_de_passe, onglets: choisis, ...p }) => ({
      ...p,
      onglets: ongletsDe({ role: p.role, onglets: choisis }),
      onglets_personnalises: p.role !== "founder" && choisis !== null,
      statut: (!p.actif ? "archive" : a_mot_de_passe ? "actif" : "invitation") satisfies StatutAcces,
    }));
    return json({ collaborateurs });
  });

  r.ajouter("POST", "collaborateurs", async ({ req }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    const b = await readBody<Record<string, unknown>>(req);
    const p = { nom: texte(b.nom, "Nom"), email: email(b.email), role: role(b.role) };
    const choisis = b.onglets === undefined || b.onglets === null ? null : onglets(b.onglets);
    // Sans droit de gestion des accès : uniquement des Collaborateurs ou Assistants, avec les onglets par défaut.
    if (!gereLesAcces(auteur) && (choisis || !["collaborateur", "assistant"].includes(p.role))) throw new HttpError(403, RESERVE_GESTION);
    if (p.email === EMAIL_FOUNDER) throw new HttpError(409, "Cette adresse est celle du compte Founder.");
    const clientIds = idsListe(b.clientIds, "Client");
    const rows = await sql`
      INSERT INTO profils (nom, email, role, onglets) VALUES (${p.nom}, ${p.email}, ${p.role}, ${choisis}::text[])
      ON CONFLICT (email) DO NOTHING
      RETURNING id, nom, email`;
    if (!rows[0]) throw new HttpError(409, "Un collaborateur existe déjà avec cette adresse e-mail.");
    await affecterClients(rows[0].id, clientIds);
    const invitation = await inviter(req, auteur, rows[0] as { id: string; nom: string; email: string });
    return json({ id: rows[0].id, invitation }, { status: 201 });
  });

  r.ajouter("PATCH", "collaborateurs/:id", async ({ req, params }) => {
    const auteur = await exigerOnglet(req, "collaborateurs");
    const id = uuid(params.id, "Collaborateur");
    const b = await readBody<Record<string, unknown>>(req);
    const existant = (await sql`SELECT id, nom, email, role, actif, onglets FROM profils WHERE id = ${id}`)[0];
    if (!existant) throw new HttpError(404, "Collaborateur introuvable.");

    let nom = b.nom === undefined ? null : texte(b.nom, "Nom");
    let mail = b.email === undefined ? null : email(b.email);
    let nouveauRole = b.role === undefined ? null : role(b.role);
    if (b.actif !== undefined && typeof b.actif !== "boolean") throw new HttpError(400, "Valeur « actif » invalide.");
    let actif = b.actif === undefined ? null : b.actif === true;
    let choisis = b.onglets === undefined || b.onglets === null ? null : onglets(b.onglets);

    // On ignore ce qui ne change pas (le formulaire renvoie tout) pour n'appliquer les règles qu'aux vrais changements.
    if (nom === existant.nom) nom = null;
    if (mail === existant.email) mail = null;
    if (nouveauRole === existant.role) nouveauRole = null;
    if (actif === existant.actif) actif = null;
    const ongletsActuels = ongletsDe(existant as { role: Role; onglets: string[] | null });
    if (choisis && !nouveauRole && choisis.join() === ongletsActuels.join()) choisis = null;

    if (existant.role === "founder") {
      // Compte fondateur : toujours Founder, actif et avec tous les onglets ; seul lui-même change son nom.
      if (nouveauRole || actif === false || choisis) throw new HttpError(403, "Le compte Founder ne peut être ni archivé, ni changé de type, ni restreint.");
      if (mail) throw new HttpError(403, "L'adresse du compte Founder ne peut pas être modifiée.");
      if (nom && auteur.id !== id) throw new HttpError(403, "Seul le Founder peut modifier son propre compte.");
    }
    // Type, onglets, archivage et adresse e-mail d'un autre (qui permettrait de prendre son compte) : gestion des accès.
    if ((nouveauRole || actif !== null || choisis || (mail && id !== auteur.id)) && !gereLesAcces(auteur)) throw new HttpError(403, RESERVE_GESTION);

    // Évite de se retirer soi-même l'accès.
    if (id === auteur.id) {
      if (actif === false) throw new HttpError(400, "Vous ne pouvez pas archiver votre propre compte.");
      if (nouveauRole && !gereLesAcces({ role: nouveauRole, actif: true })) throw new HttpError(400, "Vous ne pouvez pas retirer votre propre droit de gestion des accès.");
      const apres = choisis ?? (nouveauRole ? ongletsDe({ role: nouveauRole }) : ongletsActuels);
      if (!apres.includes("collaborateurs")) throw new HttpError(400, "Vous ne pouvez pas retirer votre propre accès à « Collaborateurs ».");
    }

    // Changer de type sans préciser les onglets revient aux onglets par défaut du nouveau type.
    const majOnglets = choisis !== null || nouveauRole !== null;
    try {
      await sql`
        UPDATE profils SET
          nom = COALESCE(${nom}, nom),
          email = COALESCE(${mail}, email),
          role = COALESCE(${nouveauRole}, role),
          actif = COALESCE(${actif}::boolean, actif),
          onglets = CASE WHEN ${majOnglets}::boolean THEN ${choisis}::text[] ELSE onglets END
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
    const auteur = await exigerOnglet(req, "collaborateurs");
    const id = uuid(params.id, "Collaborateur");
    const rows = await sql`SELECT id, nom, email, actif, mot_de_passe_hash IS NOT NULL AS a_mot_de_passe FROM profils WHERE id = ${id}`;
    const p = rows[0];
    if (!p) throw new HttpError(404, "Collaborateur introuvable.");
    if (!p.actif) throw new HttpError(409, "Ce collaborateur est archivé. Réactivez-le d'abord.");
    if (p.a_mot_de_passe) throw new HttpError(409, "Ce collaborateur a déjà défini son mot de passe.");
    return json({ invitation: await inviter(req, auteur, p as { id: string; nom: string; email: string }) });
  });

  // Avec l'onglet Clients, Collaborateurs, Validation ou Récap : tous les clients (dont le TJM).
  // Sinon, seulement ses clients assignés, sans TJM (équivalent de la vue mes_clients).
  r.ajouter("GET", "clients", async ({ req }) => {
    const moi = await exigerProfil(req);
    if (!aOnglet(moi, "clients", "collaborateurs", "validation", "recap")) {
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
    await exigerOnglet(req, "clients");
    const b = await readBody<Record<string, unknown>>(req);
    const nom = texte(b.nom, "Nom du client");
    const tjm = entier(b.tjmDzd, "TJM");
    const rows = await sql`INSERT INTO clients (nom, tjm_dzd) VALUES (${nom}, ${tjm}) RETURNING id`;
    await affecterEquipe(rows[0]!.id, idsListe(b.profilIds, "Collaborateur"));
    return json({ id: rows[0]!.id }, { status: 201 });
  });

  r.ajouter("PATCH", "clients/:id", async ({ req, params }) => {
    await exigerOnglet(req, "clients");
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
