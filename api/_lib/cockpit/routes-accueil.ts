import { STATUTS_CABINET, ajouterJours, aujourdhui, bornesMois, lundiDe, type StatutCabinet } from "../../../shared/cockpit.js";
import { trierSemaines } from "../../../shared/prospection.js";
import { json } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { aOnglet, exigerOnglet } from "./session.js";

// Page « Aujourd'hui » : tout ce qu'il faut traiter, en un seul appel.
export function routesAccueil(r: Routeur) {
  r.ajouter("GET", "accueil", async ({ req }) => {
    const moi = await exigerOnglet(req, "aujourdhui");
    const jour = aujourdhui();
    const { debut, fin } = bornesMois(jour);
    const lundiPrecedent = ajouterJours(lundiDe(jour), -7);

    const [relances, aContacter, repartition, aValider, retardataires, temps] = await Promise.all([
      sql`
        SELECT count(*)::int AS nombre, min(relance_le)::text AS plus_ancienne FROM cabinets
        WHERE relance_le <= ${jour}::date AND statut IN ('message_envoye', 'relance', 'en_discussion', 'demo_planifiee')`,
      sql`SELECT semaine_plan, count(*)::int AS nombre FROM cabinets WHERE statut = 'a_contacter' GROUP BY semaine_plan`,
      sql`SELECT statut, count(*)::int AS nombre FROM cabinets WHERE statut <> 'hors_cible' GROUP BY statut`,
      sql`SELECT count(*)::int AS nombre FROM semaines WHERE statut = 'soumise'`,
      // Collaborateurs actifs avec au moins un client actif, sans semaine précédente soumise ou validée
      sql`
        SELECT p.id, p.nom FROM profils p
        WHERE p.actif
          AND EXISTS (SELECT 1 FROM affectations a JOIN clients c ON c.id = a.client_id WHERE a.profil_id = p.id AND c.actif)
          AND NOT EXISTS (SELECT 1 FROM semaines s WHERE s.profil_id = p.id AND s.lundi = ${lundiPrecedent}::date AND s.statut IN ('soumise', 'validee'))
        ORDER BY p.nom`,
      sql`
        SELECT
          COALESCE(sum(t.valeur) FILTER (WHERE s.statut = 'validee'), 0)::float8 AS jours_valides,
          COALESCE(sum(t.valeur * c.tjm_dzd) FILTER (WHERE s.statut = 'validee'), 0)::float8 AS montant_valide,
          COALESCE(sum(t.valeur) FILTER (WHERE s.statut <> 'validee'), 0)::float8 AS jours_non_valides
        FROM temps t JOIN semaines s ON s.id = t.semaine_id JOIN clients c ON c.id = t.client_id
        WHERE t.jour BETWEEN ${debut}::date AND ${fin}::date`,
    ]);

    const parStatut = Object.fromEntries(STATUTS_CABINET.filter((s) => s !== "hors_cible").map((s) => [s, 0])) as Record<StatutCabinet, number>;
    for (const l of repartition) parStatut[l.statut as StatutCabinet] = l.nombre;
    const total = Object.values(parStatut).reduce((a, b) => a + b, 0);
    const prochaineSemaine = trierSemaines(aContacter.map((l) => l.semaine_plan))[0] ?? null;

    // Chaque bloc n'est renvoyé qu'avec l'onglet correspondant (null sinon).
    const cabinets = aOnglet(moi, "cabinets");
    const validation = aOnglet(moi, "validation");
    return json({
      aujourdhui: jour,
      relances: cabinets ? relances[0] : null,
      jamaisContactes: cabinets
        ? {
            nombre: aContacter.reduce((s, l) => s + l.nombre, 0),
            prochaineSemaine,
            restantSemaine: prochaineSemaine ? aContacter.find((l) => l.semaine_plan === prochaineSemaine)!.nombre : 0,
          }
        : null,
      semainesAValider: validation ? aValider[0]!.nombre : null,
      semainePrecedente: validation ? { lundi: lundiPrecedent, manquants: retardataires } : null,
      prospection: cabinets
        ? {
            parStatut,
            total,
            contactes: total - parStatut.a_contacter,
            interesses: parStatut.en_discussion + parStatut.demo_planifiee,
            signes: parStatut.client_signe,
          }
        : null,
      temps: aOnglet(moi, "recap") ? temps[0] : null,
    });
  });
}
