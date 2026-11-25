import { STATUT_CABINET_LABEL, aujourdhui } from "../../../shared/cockpit.js";
import { calculerMiseAJour } from "../../../shared/import.js";
import { MODELE_PAR_DEFAUT, appliquerStatut, type EtatProspection } from "../../../shared/prospection.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { ajouterHistorique, cabinetsParCles, insererCabinets, modifierCabinet, nettoyerImporte, nettoyerPatchFiche, statutValide } from "./cabinets-sql.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { exigerOnglet } from "./session.js";

async function modeleWhatsApp(): Promise<string> {
  const [p] = await sql`SELECT valeur FROM parametres WHERE cle = 'modele_whatsapp'`;
  return typeof p?.valeur === "string" ? p.valeur : MODELE_PAR_DEFAUT;
}

async function etatCabinet(id: string): Promise<EtatProspection & { id: string }> {
  const [c] = await sql`SELECT id, statut, premier_contact::text AS premier_contact, relance_le::text AS relance_le, demo_le::text AS demo_le FROM cabinets WHERE id = ${id}`;
  if (!c) throw new HttpError(404, "Cabinet introuvable.");
  return c as EtatProspection & { id: string };
}

// Prospection VetCare : réservée aux admins.
export function routesCabinets(r: Routeur) {
  // Liste pour le Kanban (Hors cible exclus), avec le modèle de message pour les liens WhatsApp.
  r.ajouter("GET", "cabinets", async ({ req }) => {
    await exigerOnglet(req, "cabinets");
    const [cabinets, modele] = await Promise.all([
      sql`
        SELECT id, nom, veterinaire, commune, segment, semaine_plan, canal1, contact_canal1, contact_relance,
          telephone, telephone2, email, adresse, notes, message, statut,
          premier_contact::text AS premier_contact, relance_le::text AS relance_le, demo_le::text AS demo_le
        FROM cabinets WHERE statut <> 'hors_cible' ORDER BY nom`,
      modeleWhatsApp(),
    ]);
    return json({ cabinets, modele, aujourdhui: aujourdhui() });
  });

  r.ajouter("GET", "cabinets/:id", async ({ req, params }) => {
    await exigerOnglet(req, "cabinets");
    const id = uuid(params.id, "Cabinet");
    const [ligne] = await sql`SELECT to_jsonb(c) AS cabinet FROM cabinets c WHERE c.id = ${id}`;
    const cabinet = ligne?.cabinet;
    if (!cabinet) throw new HttpError(404, "Cabinet introuvable.");
    const historique = await sql`
      SELECT h.id, h.le::text AS le, h.statut, h.action, h.note, p.nom AS auteur
      FROM historique_cabinet h LEFT JOIN profils p ON p.id = h.auteur_id
      WHERE h.cabinet_id = ${id} ORDER BY h.le DESC, h.id`;
    return json({ cabinet, historique, modele: await modeleWhatsApp() });
  });

  r.ajouter("PATCH", "cabinets/:id", async ({ req, params }) => {
    await exigerOnglet(req, "cabinets");
    const id = uuid(params.id, "Cabinet");
    const patch = nettoyerPatchFiche(await readBody<Record<string, unknown>>(req));
    if (!Object.keys(patch).length) return json({ ok: true });
    const rows = await modifierCabinet(id, patch);
    if (!rows.length) throw new HttpError(404, "Cabinet introuvable.");
    return json({ ok: true });
  });

  // Changement de statut (glisser-déposer, menu « Déplacer vers… » ou fiche) : relance programmée et historique.
  r.ajouter("POST", "cabinets/:id/statut", async ({ req, params }) => {
    const moi = await exigerOnglet(req, "cabinets");
    const id = uuid(params.id, "Cabinet");
    const b = await readBody<{ statut?: unknown; note?: unknown }>(req);
    const statut = statutValide(b.statut);
    const avant = await etatCabinet(id);
    if (avant.statut === statut) return json({ cabinet: avant });
    const apres = appliquerStatut(avant, statut, aujourdhui());
    await modifierCabinet(id, {
      statut: apres.statut,
      premier_contact: apres.premier_contact,
      relance_le: apres.relance_le,
      raison_hors_cible: statut === "hors_cible" ? "Mis hors cible manuellement" : null,
    });
    const note = typeof b.note === "string" && b.note.trim() ? b.note.trim().slice(0, 2000) : null;
    await ajouterHistorique(id, moi.id, statut, `Statut : ${STATUT_CABINET_LABEL[statut]}`, note);
    return json({ cabinet: { id, ...apres } });
  });

  // Ouverture de WhatsApp : un cabinet « À contacter » passe en « Message WhatsApp envoyé ».
  r.ajouter("POST", "cabinets/:id/whatsapp", async ({ req, params }) => {
    const moi = await exigerOnglet(req, "cabinets");
    const id = uuid(params.id, "Cabinet");
    const avant = await etatCabinet(id);
    if (avant.statut !== "a_contacter") {
      await ajouterHistorique(id, moi.id, avant.statut, "WhatsApp ouvert");
      return json({ cabinet: avant });
    }
    const apres = appliquerStatut(avant, "message_envoye", aujourdhui());
    await modifierCabinet(id, { statut: apres.statut, premier_contact: apres.premier_contact, relance_le: apres.relance_le });
    await ajouterHistorique(id, moi.id, apres.statut, "Message WhatsApp envoyé");
    return json({ cabinet: { id, ...apres } });
  });

  r.ajouter("DELETE", "cabinets/:id", async ({ req, params }) => {
    await exigerOnglet(req, "cabinets");
    const rows = await sql`DELETE FROM cabinets WHERE id = ${uuid(params.id, "Cabinet")} RETURNING id`;
    if (!rows.length) throw new HttpError(404, "Cabinet introuvable.");
    return json({ ok: true });
  });

  // Modèle de message WhatsApp
  r.ajouter("GET", "parametres/whatsapp", async ({ req }) => {
    await exigerOnglet(req, "cabinets", "whatsapp");
    const exemples = await sql`
      SELECT id, nom, veterinaire, telephone, contact_canal1, contact_relance, message FROM cabinets
      WHERE statut <> 'hors_cible' ORDER BY (veterinaire IS NULL), (message IS NOT NULL), nom LIMIT 30`;
    return json({ modele: await modeleWhatsApp(), exemples });
  });

  r.ajouter("PUT", "parametres/whatsapp", async ({ req }) => {
    await exigerOnglet(req, "whatsapp");
    const b = await readBody<{ modele?: unknown }>(req);
    const modele = typeof b.modele === "string" ? b.modele.trim() : "";
    if (!modele) throw new HttpError(400, "Le modèle ne peut pas être vide.");
    if (modele.length > 3000) throw new HttpError(400, "Le modèle est trop long (3 000 caractères maximum).");
    await sql`
      INSERT INTO parametres (cle, valeur) VALUES ('modele_whatsapp', ${JSON.stringify(modele)}::jsonb)
      ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur`;
    return json({ modele });
  });

  // Import : le navigateur lit le fichier, le serveur compare puis écrit par lots.
  r.ajouter("POST", "import/analyser", async ({ req }) => {
    await exigerOnglet(req, "cabinets");
    const b = await readBody<{ cabinets?: unknown }>(req);
    if (!Array.isArray(b.cabinets) || b.cabinets.length > 5000) throw new HttpError(400, "Liste de cabinets invalide.");
    const cabinets = b.cabinets.map(nettoyerImporte);
    const existants = await cabinetsParCles(cabinets.map((c) => c.cle));
    const resultat = { nouveaux: 0, nouveauxHorsCible: 0, aMettreAJour: 0, identiques: 0, exemplesMiseAJour: [] as { nom: string; champs: string[] }[] };
    for (const c of cabinets) {
      const e = existants.get(c.cle);
      if (!e) {
        resultat.nouveaux++;
        if (c.statut === "hors_cible") resultat.nouveauxHorsCible++;
        continue;
      }
      const patch = calculerMiseAJour(e, c);
      if (!patch) resultat.identiques++;
      else {
        resultat.aMettreAJour++;
        if (resultat.exemplesMiseAJour.length < 20) resultat.exemplesMiseAJour.push({ nom: c.nom, champs: Object.keys(patch) });
      }
    }
    return json(resultat);
  });

  r.ajouter("POST", "import/lot", async ({ req }) => {
    const moi = await exigerOnglet(req, "cabinets");
    const b = await readBody<{ cabinets?: unknown; mettreAJour?: unknown }>(req);
    if (!Array.isArray(b.cabinets) || b.cabinets.length > 200) throw new HttpError(400, "Lot invalide (200 cabinets maximum).");
    const cabinets = b.cabinets.map(nettoyerImporte);
    const existants = await cabinetsParCles(cabinets.map((c) => c.cle));
    const crees = await insererCabinets(
      cabinets.filter((c) => !existants.has(c.cle)),
      moi.id,
    );
    let misAJour = 0;
    if (b.mettreAJour === true)
      for (const c of cabinets) {
        const e = existants.get(c.cle);
        const patch = e && calculerMiseAJour(e, c);
        if (patch) {
          await modifierCabinet(e.id as string, patch);
          misAJour++;
        }
      }
    return json({ crees, misAJour });
  });
}
