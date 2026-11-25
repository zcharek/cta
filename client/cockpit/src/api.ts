import type { Coordonnees, Moi, Onglet, Role, StatutAcces } from "../../../shared/cockpit";

export class ErreurApi extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Appel à l'API Cockpit. Une réponse 401 prévient l'application, qui renvoie vers la connexion. */
export async function api<T>(chemin: string, init: { methode?: string; corps?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/cockpit/${chemin}`, {
    method: init.methode ?? (init.corps !== undefined ? "POST" : "GET"),
    headers: init.corps !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: init.corps !== undefined ? JSON.stringify(init.corps) : undefined,
    credentials: "same-origin",
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && !chemin.startsWith("auth/")) window.dispatchEvent(new Event("cockpit:deconnecte"));
  if (!res.ok) throw new ErreurApi(res.status, data.error ?? "Une erreur est survenue. Réessayez.");
  return data as T;
}

export type { Moi };

export type Invitation = { envoye: boolean; lien?: string; avertissement?: string };

export type Collaborateur = {
  id: string;
  nom: string;
  email: string;
  role: Role;
  actif: boolean;
  statut: StatutAcces;
  invite_le: string;
  active_le: string | null;
  client_ids: string[];
  jours_mois: number;
  /** Onglets effectifs (ceux de son type, sauf choix particulier). */
  onglets: Onglet[];
  onglets_personnalises: boolean;
  nin_renseigne: boolean;
  ss_renseigne: boolean;
  compte_renseigne: boolean;
} & Omit<Coordonnees, "nin" | "numero_ss" | "numero_compte">;

export type ClientAdmin = {
  id: string;
  nom: string;
  tjm_dzd: number;
  raison_sociale: string | null;
  adresse: string | null;
  numero_contrat: string | null;
  mission: string | null;
  forfait_mensuel_dzd: number | null;
  jours_forfait: number;
  raison_sociale_facture: string | null;
  rc: string | null;
  nif: string | null;
  actif: boolean;
  profil_ids: string[];
  jours_mois: number;
};

export type CabinetCarte = {
  id: string;
  nom: string;
  veterinaire: string | null;
  commune: string | null;
  segment: string | null;
  semaine_plan: string | null;
  canal1: string | null;
  contact_canal1: string | null;
  contact_relance: string | null;
  telephone: string | null;
  telephone2: string | null;
  email: string | null;
  adresse: string | null;
  notes: string | null;
  message: string | null;
  statut: import("../../../shared/cockpit").StatutCabinet;
  premier_contact: string | null;
  relance_le: string | null;
  demo_le: string | null;
};

export type FicheCabinet = CabinetCarte & {
  cle: string;
  numero: string | null;
  type: string | null;
  adresse2: string | null;
  site: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  lat: number | null;
  lng: number | null;
  lien_carte: string | null;
  horaires: string | null;
  urgences: string | null;
  note_google: string | null;
  etat_google: string | null;
  sources: string | null;
  canal_relance: string | null;
  ensuite: string | null;
  raison_hors_cible: string | null;
  extra: Record<string, string>;
  cree_le: string;
  maj_le: string;
};

export type LigneHistorique = { id: string; le: string; statut: string | null; action: string; note: string | null; auteur: string | null };
