// Coffre de documents (onglet « Documents ») : contrats, NDA, documents légaux de CTA, et import des factures émises avant Cockpit.
// Le navigateur lit le PDF, détecte le type, le client et les montants (shared/detection.ts), puis envoie le fichier
// directement au store privé avec un jeton limité à un chemin ; on enregistre ensuite ses informations ici.
import { aujourdhui, gereLesAcces } from "../../../shared/cockpit.js";
import { CATEGORIES, type Categorie } from "../../../shared/detection.js";
import { numeroFacture } from "../../../shared/facture.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import { identiteEntreprise } from "./entreprise.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerOnglet, exigerProfil } from "./session.js";
import { cheminFichier, fichierDepose, stockage, TAILLE_MAX, TYPES_ACCEPTES, type Usage } from "./stockage.js";

const texte = (v: unknown, quoi: string, max: number, requis = false): string | null => {
  if (v === undefined || v === null || (typeof v === "string" && !v.trim())) {
    if (requis) throw new HttpError(400, `${quoi} obligatoire.`);
    return null;
  }
  if (typeof v !== "string" || v.trim().length > max) throw new HttpError(400, `${quoi} invalide.`);
  return v.trim();
};

function dateIso(v: unknown, quoi: string): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) !== v) throw new HttpError(400, `${quoi} invalide.`);
  return v;
}

function montant(v: unknown, quoi: string): number {
  const n = typeof v === "string" ? Number(v.replace(/\s/g, "").replace(",", ".")) : v;
  if (typeof n !== "number" || !Number.isFinite(n) || n < 0 || n > 1e12) throw new HttpError(400, `${quoi} invalide.`);
  return Math.round(n * 100) / 100;
}

function categorie(v: unknown): Categorie {
  if (!CATEGORIES.includes(v as Categorie)) throw new HttpError(400, "Type de document inconnu.");
  return v as Categorie;
}

type NouveauClient = { nom?: unknown; rc?: unknown; nif?: unknown; adresse?: unknown; actif?: unknown };

/** Client choisi, ou créé à partir de la détection (archivé par défaut : ancien client). Un client du même nom est réutilisé. */
async function resoudreClient(b: { clientId?: unknown; nouveauClient?: NouveauClient | null }): Promise<{ id: string; cree: boolean } | null> {
  if (b.clientId) {
    const id = uuid(b.clientId, "Client");
    const [c] = await sql`SELECT id FROM clients WHERE id = ${id}`;
    if (!c) throw new HttpError(404, "Client introuvable.");
    return { id, cree: false };
  }
  if (!b.nouveauClient) return null;
  const n = b.nouveauClient;
  const nom = texte(n.nom, "Nom du client", 200, true)!;
  const [existant] = await sql`
    SELECT id FROM clients
    WHERE lower(nom) = lower(${nom}) OR lower(raison_sociale) = lower(${nom}) OR lower(raison_sociale_facture) = lower(${nom})
    ORDER BY actif DESC, cree_le LIMIT 1`;
  if (existant) return { id: existant.id, cree: false };
  const [c] = await sql`
    INSERT INTO clients (nom, raison_sociale, rc, nif, adresse, actif)
    VALUES (${nom}, ${nom}, ${texte(n.rc, "RC", 60)}, ${texte(n.nif, "NIF", 60)}, ${texte(n.adresse, "Adresse", 300)}, ${n.actif === true})
    RETURNING id`;
  return { id: c!.id, cree: true };
}

/** « 014-26 », « 14-2026 » ou « 14/26 » → numéro et année. */
function lireNumero(v: unknown): { numero: number; annee: number } {
  const m = typeof v === "string" ? v.trim().match(/^(\d{1,4})\s*[-/]\s*(\d{2}|\d{4})$/) : null;
  if (!m || Number(m[1]) < 1) throw new HttpError(400, "N° de facture attendu au format 014-26.");
  return { numero: Number(m[1]), annee: m[2]!.length === 2 ? 2000 + Number(m[2]) : Number(m[2]) };
}

export function routesCoffre(r: Routeur) {
  // Jeton d'envoi : un chemin, un type, une taille maximale, 10 minutes.
  r.ajouter("POST", "coffre/jeton", async ({ req }) => {
    const b = await readBody<{ usage?: unknown; nom?: unknown; type?: unknown; taille?: unknown }>(req);
    const usage = b.usage as Usage;
    if (usage === "factures") await exigerOnglet(req, "factures");
    else if (usage === "documents") await exigerOnglet(req, "documents");
    else throw new HttpError(400, "Usage inconnu.");
    if (typeof b.type !== "string" || !TYPES_ACCEPTES[b.type]) throw new HttpError(415, "Format non accepté : PDF, image (PNG, JPEG, WebP), Word ou Excel.");
    if (typeof b.taille !== "number" || b.taille <= 0) throw new HttpError(400, "Fichier vide.");
    if (b.taille > TAILLE_MAX) throw new HttpError(413, "Fichier trop lourd : 25 Mo au maximum.");
    const chemin = cheminFichier(usage, typeof b.nom === "string" ? b.nom : "document", b.type);
    return json({ chemin, jeton: await stockage().jetonEnvoi(chemin, b.type, TAILLE_MAX) });
  });

  // Documents actuels (dernière version de chacun), clients pour la détection, identité de CTA à exclure.
  r.ajouter("GET", "coffre", async ({ req }) => {
    const moi = await exigerOnglet(req, "documents");
    const [documents, clients, factures, { entreprise }] = await Promise.all([
      sql`
        SELECT d.id, d.categorie, d.titre, d.client_id, c.nom AS client, d.date_document::text AS date_document, d.expire_le::text AS expire_le,
          d.nom_fichier, d.type_mime, d.taille, p.nom AS ajoute_par, d.ajoute_le::text AS ajoute_le,
          (WITH RECURSIVE h AS (SELECT id, precedent_id FROM documents WHERE id = d.precedent_id
             UNION ALL SELECT x.id, x.precedent_id FROM documents x JOIN h ON x.id = h.precedent_id)
           SELECT count(*)::int FROM h) AS versions_precedentes
        FROM documents d LEFT JOIN clients c ON c.id = d.client_id LEFT JOIN profils p ON p.id = d.ajoute_par
        WHERE NOT EXISTS (SELECT 1 FROM documents n WHERE n.precedent_id = d.id)
        ORDER BY d.ajoute_le DESC`,
      sql`SELECT id, nom, raison_sociale, raison_sociale_facture, rc, nif, actif FROM clients ORDER BY actif DESC, nom`,
      sql`SELECT annee, numero FROM factures`,
      identiteEntreprise(),
    ]);
    return json({
      documents,
      clients,
      facturesExistantes: factures.map((f) => numeroFacture(f.numero, f.annee)),
      soi: { raison_sociale: entreprise?.raison_sociale ?? null, rc: entreprise?.rc ?? null, nif: entreprise?.nif ?? null },
      peutImporterFactures: aOnglet(moi, "factures"),
      peutSupprimer: gereLesAcces(moi),
    });
  });

  r.ajouter("POST", "coffre/documents", async ({ req }) => {
    const moi = await exigerOnglet(req, "documents");
    const b = await readBody<Record<string, unknown> & { nouveauClient?: NouveauClient }>(req);
    const f = await fichierDepose(b.fichier, "documents");
    const precedent = b.precedentId ? uuid(b.precedentId, "Document") : null;
    if (precedent) {
      const [p] = await sql`SELECT id FROM documents d WHERE id = ${precedent} AND NOT EXISTS (SELECT 1 FROM documents n WHERE n.precedent_id = d.id)`;
      if (!p) throw new HttpError(409, "Ce document a déjà été remplacé par une version plus récente.");
    }
    const client = await resoudreClient(b);
    const [d] = await sql`
      INSERT INTO documents (categorie, titre, client_id, date_document, expire_le, fichier, nom_fichier, type_mime, taille, precedent_id, ajoute_par)
      VALUES (${categorie(b.categorie)}, ${texte(b.titre, "Titre", 200, true)}, ${client?.id ?? null}, ${dateIso(b.dateDocument, "Date du document")},
        ${dateIso(b.expireLe, "Date d'expiration")}, ${f.chemin}, ${texte(b.nomFichier, "Nom du fichier", 255) ?? f.chemin.split("/").pop()!},
        ${f.type}, ${f.taille}, ${precedent}, ${moi.id})
      RETURNING id`;
    return json({ id: d!.id, clientCree: client?.cree ?? false }, { status: 201 });
  });

  r.ajouter("PATCH", "coffre/documents/:id", async ({ req, params }) => {
    await exigerOnglet(req, "documents");
    const id = uuid(params.id, "Document");
    const b = await readBody<Record<string, unknown> & { nouveauClient?: NouveauClient }>(req);
    const client = b.clientId === null ? null : await resoudreClient(b);
    const [d] = await sql`
      UPDATE documents SET
        categorie = ${categorie(b.categorie)}, titre = ${texte(b.titre, "Titre", 200, true)},
        client_id = ${client?.id ?? null}, date_document = ${dateIso(b.dateDocument, "Date du document")}, expire_le = ${dateIso(b.expireLe, "Date d'expiration")}
      WHERE id = ${id} RETURNING id`;
    if (!d) throw new HttpError(404, "Document introuvable.");
    return json({ ok: true });
  });

  // Lien de lecture signé (5 minutes) ; chaque ouverture est tracée.
  r.ajouter("GET", "coffre/documents/:id/lien", async ({ req, params }) => {
    const moi = await exigerOnglet(req, "documents");
    const [d] = await sql`SELECT id, fichier FROM documents WHERE id = ${uuid(params.id, "Document")}`;
    if (!d) throw new HttpError(404, "Document introuvable.");
    await sql`INSERT INTO documents_consultations (document_id, profil_id) VALUES (${d.id}, ${moi.id})`;
    return json({ lien: await stockage().lienLecture(d.fichier) });
  });

  // Historique : versions précédentes et dernières consultations.
  r.ajouter("GET", "coffre/documents/:id/historique", async ({ req, params }) => {
    await exigerOnglet(req, "documents");
    const id = uuid(params.id, "Document");
    const versions = await sql`
      WITH RECURSIVE h AS (SELECT * FROM documents WHERE id = ${id} UNION ALL SELECT d.* FROM documents d JOIN h ON d.id = h.precedent_id)
      SELECT h.id, h.titre, h.nom_fichier, h.ajoute_le::text AS ajoute_le, p.nom AS ajoute_par FROM h LEFT JOIN profils p ON p.id = h.ajoute_par ORDER BY h.ajoute_le DESC`;
    if (!versions.length) throw new HttpError(404, "Document introuvable.");
    const vues = await sql`
      SELECT c.le::text AS le, COALESCE(p.nom, 'Compte supprimé') AS nom
      FROM documents_consultations c LEFT JOIN profils p ON p.id = c.profil_id
      WHERE c.document_id = ANY (${versions.map((v) => v.id)}::uuid[]) ORDER BY c.le DESC LIMIT 20`;
    return json({ versions, consultations: vues });
  });

  // Suppression d'une version (et de son fichier) : Founder, Co-Founder et QA Manager.
  r.ajouter("DELETE", "coffre/documents/:id", async ({ req, params }) => {
    const moi = await exigerProfil(req);
    if (!aOnglet(moi, "documents") || !gereLesAcces(moi)) throw new HttpError(403, "Seuls le Founder, les Co-Founders et les QA Managers suppriment des documents.");
    const id = uuid(params.id, "Document");
    const [d] = await sql`SELECT fichier, precedent_id FROM documents WHERE id = ${id}`;
    if (!d) throw new HttpError(404, "Document introuvable.");
    // La version précédente redevient la version actuelle
    await sql`UPDATE documents SET precedent_id = ${d.precedent_id} WHERE precedent_id = ${id}`;
    await sql`DELETE FROM documents WHERE id = ${id}`;
    await stockage().supprimer(d.fichier).catch(() => undefined);
    return json({ ok: true });
  });

  // Import d'une facture émise avant Cockpit : PDF d'origine, numéro, dates et montants (détectés puis vérifiés).
  r.ajouter("POST", "coffre/factures", async ({ req }) => {
    const moi = await exigerOnglet(req, "factures");
    const b = await readBody<Record<string, unknown> & { nouveauClient?: NouveauClient }>(req);
    const f = await fichierDepose(b.fichier, "factures");
    const { numero, annee } = lireNumero(b.numero);
    const dateEmission = dateIso(b.dateEmission, "Date d'émission");
    if (!dateEmission) throw new HttpError(400, "Date d'émission obligatoire.");
    const mois = typeof b.mois === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(b.mois) ? b.mois : dateEmission.slice(0, 7);
    const ht = montant(b.ht, "Total HT");
    const tva = montant(b.tva, "TVA");
    const ttc = montant(b.ttc, "Total TTC");
    if (Math.abs(ht + tva - ttc) > 1) throw new HttpError(400, "Les montants ne concordent pas : HT + TVA doit égaler le TTC.");
    const payeeLe = dateIso(b.payeeLe, "Date de paiement");
    if (payeeLe && payeeLe > aujourdhui()) throw new HttpError(400, "La date de paiement est dans le futur.");
    const [doublon] = await sql`SELECT id FROM factures WHERE annee = ${annee} AND numero = ${numero}`;
    if (doublon) throw new HttpError(409, `La facture ${numeroFacture(numero, annee)} existe déjà.`);
    const client = await resoudreClient(b);
    if (!client) throw new HttpError(400, "Client obligatoire.");
    try {
      const [fa] = await sql`
        INSERT INTO factures (annee, numero, client_id, mois, date_emission, jours, montant_ht, montant_tva, montant_ttc, donnees, fichier, payee_le, cree_par)
        VALUES (${annee}, ${numero}, ${client.id}, ${mois}, ${dateEmission}, NULL, ${ht}, ${tva}, ${ttc}, NULL, ${f.chemin}, ${payeeLe}::date, ${moi.id})
        RETURNING id`;
      return json({ id: fa!.id, numero: numeroFacture(numero, annee), clientCree: client.cree }, { status: 201 });
    } catch (err) {
      if ((err as { code?: string }).code === "23505") throw new HttpError(409, `La facture ${numeroFacture(numero, annee)} existe déjà.`);
      throw err;
    }
  });
}
