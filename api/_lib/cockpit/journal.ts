import { sql } from "./db.js";

// Journal des accès : chaque changement de droits ou d'authentification d'un compte Cockpit.
// Consultable dans Collaborateurs par le Founder, les Co-Founders et les QA Managers.

export type ActionJournal =
  | "creation"
  | "modification"
  | "archivage"
  | "reactivation"
  | "suppression"
  | "invitation"
  | "mot_de_passe_change"
  | "mot_de_passe_reinitialise";

type Personne = { id: string | null; nom: string } | null;

export async function journaliser(auteur: Personne, cible: Personne, action: ActionJournal, details: Record<string, unknown> = {}) {
  await sql`
    INSERT INTO journal_acces (auteur_id, auteur_nom, cible_id, cible_nom, action, details)
    VALUES (${auteur?.id ?? null}, ${auteur?.nom ?? null}, ${cible?.id ?? null}, ${cible?.nom ?? null}, ${action}, ${JSON.stringify(details)}::jsonb)`;
}
