import { bornesMois, construireRecap, grouperParClient, type LigneRecapBrute, type Temps } from "../../../shared/cockpit.js";
import { HttpError, json, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { exigerOnglet } from "./session.js";

type SemaineBrute = {
  id: string;
  profil_id: string;
  nom: string;
  lundi: string;
  soumise_le: string | null;
  validee_le: string | null;
  validee_par_nom: string | null;
  temps: (Temps & { nom: string })[];
};

const detailler = ({ temps, ...s }: SemaineBrute) => ({ ...s, ...grouperParClient(temps) });

// Validation et récap : réservés aux admins (ils exposent les temps de tous et les TJM).
export function routesSuivi(r: Routeur) {
  r.ajouter("GET", "validation", async ({ req }) => {
    await exigerOnglet(req, "validation");
    const [soumises, validees] = await Promise.all([
      sql`
        SELECT s.id, s.profil_id, p.nom, s.lundi::text AS lundi, s.soumise_le::text AS soumise_le,
          s.validee_le::text AS validee_le, NULL AS validee_par_nom,
          COALESCE((SELECT json_agg(json_build_object('client_id', t.client_id, 'nom', c.nom, 'jour', t.jour::text, 'valeur', t.valeur::float8))
                    FROM temps t JOIN clients c ON c.id = t.client_id WHERE t.semaine_id = s.id), '[]'::json) AS temps
        FROM semaines s JOIN profils p ON p.id = s.profil_id
        WHERE s.statut = 'soumise'
        ORDER BY s.lundi, s.soumise_le, p.nom`,
      sql`
        SELECT s.id, s.profil_id, p.nom, s.lundi::text AS lundi, s.soumise_le::text AS soumise_le,
          s.validee_le::text AS validee_le, v.nom AS validee_par_nom,
          COALESCE((SELECT json_agg(json_build_object('client_id', t.client_id, 'nom', c.nom, 'jour', t.jour::text, 'valeur', t.valeur::float8))
                    FROM temps t JOIN clients c ON c.id = t.client_id WHERE t.semaine_id = s.id), '[]'::json) AS temps
        FROM semaines s JOIN profils p ON p.id = s.profil_id LEFT JOIN profils v ON v.id = s.validee_par
        WHERE s.statut = 'validee'
        ORDER BY s.validee_le DESC
        LIMIT 8`,
    ]);
    return json({ soumises: (soumises as SemaineBrute[]).map(detailler), validees: (validees as SemaineBrute[]).map(detailler) });
  });

  r.ajouter("GET", "recap", async ({ req, url }) => {
    await exigerOnglet(req, "recap");
    const mois = url.searchParams.get("mois") ?? "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mois)) throw new HttpError(400, "Mois attendu au format aaaa-mm.");
    const portee = url.searchParams.get("portee") === "toutes" ? "toutes" : "validees";
    const { debut, fin } = bornesMois(`${mois}-01`);

    // Un jour compte dans le mois où il tombe, même si sa semaine est à cheval sur deux mois.
    const [lignes, nonValidees] = await Promise.all([
      sql`
        -- Taux journalier : TJM, ou forfait mensuel / jours du forfait (ex. 160 000 / 22).
        SELECT c.id AS client_id, c.nom AS client,
          COALESCE(c.forfait_mensuel_dzd::float8 / c.jours_forfait, c.tjm_dzd)::float8 AS tjm_dzd, p.id AS profil_id, p.nom AS collaborateur, sum(t.valeur)::float8 AS jours
        FROM temps t
          JOIN semaines s ON s.id = t.semaine_id
          JOIN clients c ON c.id = t.client_id
          JOIN profils p ON p.id = s.profil_id
        WHERE t.jour BETWEEN ${debut}::date AND ${fin}::date
          AND (${portee}::text = 'toutes' OR s.statut = 'validee')
        GROUP BY c.id, p.id`,
      sql`
        SELECT s.id, s.profil_id, p.nom, s.lundi::text AS lundi, s.statut
        FROM semaines s JOIN profils p ON p.id = s.profil_id
        WHERE s.statut <> 'validee'
          AND EXISTS (SELECT 1 FROM temps t WHERE t.semaine_id = s.id AND t.jour BETWEEN ${debut}::date AND ${fin}::date)
        ORDER BY s.lundi, p.nom`,
    ]);
    return json({ mois, portee, ...construireRecap(lignes as LigneRecapBrute[]), nonValidees });
  });

  // Timesheet mensuel d'un client (PDF généré dans le navigateur) : seuls les jours validés comptent.
  r.ajouter("GET", "timesheet", async ({ req, url }) => {
    await exigerOnglet(req, "recap");
    const mois = url.searchParams.get("mois") ?? "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mois)) throw new HttpError(400, "Mois attendu au format aaaa-mm.");
    const clientId = uuid(url.searchParams.get("client"), "Client");
    const { debut, fin } = bornesMois(`${mois}-01`);
    const [[client], consultants, [nonValides], [prestataire]] = await Promise.all([
      sql`
        SELECT id, COALESCE(raison_sociale, nom) AS nom, adresse, numero_contrat, mission,
          tjm_dzd, forfait_mensuel_dzd, jours_forfait
        FROM clients WHERE id = ${clientId}`,
      sql`
        SELECT p.nom, sum(t.valeur)::float8 AS jours
        FROM temps t JOIN semaines s ON s.id = t.semaine_id JOIN profils p ON p.id = s.profil_id
        WHERE t.client_id = ${clientId} AND s.statut = 'validee' AND t.jour BETWEEN ${debut}::date AND ${fin}::date
        GROUP BY p.id HAVING sum(t.valeur) > 0 ORDER BY p.nom`,
      sql`
        SELECT COALESCE(sum(t.valeur), 0)::float8 AS jours
        FROM temps t JOIN semaines s ON s.id = t.semaine_id
        WHERE t.client_id = ${clientId} AND s.statut <> 'validee' AND t.jour BETWEEN ${debut}::date AND ${fin}::date`,
      sql`SELECT valeur FROM parametres WHERE cle = 'prestataire'`,
    ]);
    if (!client) throw new HttpError(404, "Client introuvable.");
    return json({
      mois,
      debut,
      fin,
      prestataire: prestataire?.valeur ?? { nom: "Central Test Application - CTA", adresse: "" },
      client,
      consultants,
      joursNonValides: nonValides!.jours,
    });
  });
}
