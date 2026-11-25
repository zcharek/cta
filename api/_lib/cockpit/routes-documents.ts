import { aujourdhui } from "../../../shared/cockpit.js";
import type { DonneesDocumentRh, TypeDocumentRh } from "../../../shared/documents-rh.js";
import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import { identiteEntreprise } from "./entreprise.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerProfil, type Profil } from "./session.js";

// Documents RH : attestation de travail, certificat de travail et bulletins de paie.
// Chacun génère les siens depuis « Mon profil » ; avec l'onglet Collaborateurs ou Bulletins de paie, on les génère
// pour n'importe qui et on fixe la date de sortie (certificat) ou la fonction.

const TYPES: TypeDocumentRh[] = ["attestation", "certificat"];

const peutGererRh = (p: Profil) => aOnglet(p, "collaborateurs", "paie");

function dateIso(v: unknown, quoi: string): string {
  if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v) || new Date(`${v}T12:00:00Z`).toISOString().slice(0, 10) !== v) throw new HttpError(400, `${quoi} invalide.`);
  return v;
}

type Fiche = {
  id: string;
  nom: string;
  matricule: string;
  civilite: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  numero_ss: string | null;
  fonction: string | null;
  date_entree: string | null;
  date_sortie: string | null;
};

async function fiche(id: string): Promise<Fiche> {
  const [p] = await sql`
    SELECT id, nom, matricule, civilite, date_naissance::text AS date_naissance, lieu_naissance, numero_ss, fonction,
      date_entree::text AS date_entree, date_sortie::text AS date_sortie
    FROM profils WHERE id = ${id}`;
  if (!p) throw new HttpError(404, "Collaborateur introuvable.");
  return p as Fiche;
}

/** Informations manquantes pour produire le document. */
export function manquants(f: Fiche, type: TypeDocumentRh): string[] {
  return [
    !f.date_naissance && "date de naissance",
    !f.lieu_naissance && "lieu de naissance",
    !f.fonction && "fonction",
    !f.date_entree && "date d'entrée",
    type === "certificat" && !f.date_sortie && "date de sortie",
  ].filter((x): x is string => !!x);
}

export function routesDocuments(r: Routeur) {
  // Ce que la personne connectée peut télécharger : ses documents et ses bulletins.
  r.ajouter("GET", "mes-documents", async ({ req }) => {
    const moi = await exigerProfil(req);
    const f = await fiche(moi.id);
    const bulletins = await sql`SELECT id, mois, net::float8 AS net FROM bulletins WHERE profil_id = ${moi.id} ORDER BY mois DESC`;
    return json({
      manquants: { attestation: manquants(f, "attestation"), certificat: manquants(f, "certificat") },
      dateSortie: f.date_sortie,
      bulletins,
    });
  });

  r.ajouter("GET", "mes-documents/bulletins/:id", async ({ req, params }) => {
    const moi = await exigerProfil(req);
    const [b] = await sql`SELECT donnees FROM bulletins WHERE id = ${uuid(params.id, "Bulletin")} AND profil_id = ${moi.id}`;
    if (!b) throw new HttpError(404, "Bulletin introuvable.");
    return json({ donnees: b.donnees });
  });

  r.ajouter("POST", "documents/:type", async ({ req, params }) => {
    const moi = await exigerProfil(req);
    const type = params.type as TypeDocumentRh;
    if (!TYPES.includes(type)) throw new HttpError(404, "Document inconnu.");
    const b = await readBody<{ profilId?: unknown; dateSortie?: unknown; fonction?: unknown }>(req);
    const id = b.profilId === undefined || b.profilId === null || b.profilId === "" ? moi.id : uuid(b.profilId, "Collaborateur");
    const rh = peutGererRh(moi);
    if (id !== moi.id && !rh) throw new HttpError(403, "Vous ne pouvez générer que vos propres documents.");

    // Fonction et date de sortie : renseignées par l'onglet Collaborateurs ou Bulletins de paie.
    const fonction = typeof b.fonction === "string" && b.fonction.trim() ? b.fonction.trim().slice(0, 120) : null;
    const dateSortie = b.dateSortie === undefined || b.dateSortie === null || b.dateSortie === "" ? null : dateIso(b.dateSortie, "Date de sortie");
    if ((fonction || dateSortie) && !rh) throw new HttpError(403, "La fonction et la date de sortie sont renseignées par l'administration.");
    let f = await fiche(id);
    if (dateSortie && f.date_entree && dateSortie < f.date_entree) throw new HttpError(400, "La date de sortie précède la date d'entrée.");
    if (fonction || dateSortie) {
      await sql`UPDATE profils SET fonction = COALESCE(${fonction}, fonction), date_sortie = COALESCE(${dateSortie}::date, date_sortie) WHERE id = ${id}`;
      f = await fiche(id);
    }

    const manque = manquants(f, type);
    if (manque.length) {
      const soi = id === moi.id && !rh;
      throw new HttpError(409, `Informations manquantes : ${manque.join(", ")}.${soi ? " Complétez votre profil ; la fonction, la date d'entrée et la date de sortie sont renseignées par l'administration." : ""}`);
    }

    const { entreprise: e } = await identiteEntreprise();
    if (!e?.raison_sociale) throw new HttpError(500, "Identité de l'entreprise non configurée.");
    const donnees: DonneesDocumentRh = {
      type,
      date: aujourdhui(),
      entreprise: { raison_sociale: e.raison_sociale, siege: e.siege, rc: e.rc ?? null, nif: e.nif ?? null, ville: e.ville ?? null },
      salarie: {
        civilite: f.civilite,
        nom: f.nom,
        matricule: f.matricule,
        date_naissance: f.date_naissance!,
        lieu_naissance: f.lieu_naissance!,
        numero_ss: f.numero_ss,
        fonction: f.fonction!,
        date_entree: f.date_entree!,
        date_sortie: type === "certificat" ? f.date_sortie : null,
      },
    };
    return json({ donnees });
  });
}
