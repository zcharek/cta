// Vocabulaire commun à l'API et à l'interface Cockpit.

export const ROLES = ["collaborateur", "comptable", "assistant", "qa_manager", "cofounder", "founder"] as const;
export type Role = (typeof ROLES)[number];

/** Types qu'on peut attribuer depuis Cockpit. Founder est réservé au compte EMAIL_FOUNDER. */
export const ROLES_ATTRIBUABLES: readonly Role[] = ROLES.filter((r) => r !== "founder");

/** Compte fondateur : toujours Founder, actif, avec tous les onglets. Ne peut être ni archivé ni modifié par un autre. */
export const EMAIL_FOUNDER = "centraltestagency@gmail.com";

export const ROLE_LABEL: Record<Role, string> = {
  collaborateur: "Collaborateur",
  comptable: "Comptable",
  assistant: "Assistant",
  qa_manager: "QA Manager",
  cofounder: "Co-Founder",
  founder: "Founder",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  collaborateur: "Saisit ses temps sur ses clients. Ne voit ni TJM ni montants.",
  comptable: "Récap mensuel, factures et bulletins de paie par défaut. Ne gère pas les accès.",
  assistant: "Accès complet par défaut. Ne gère pas les accès.",
  qa_manager: "Accès complet. Gère les accès et les onglets des Collaborateurs, Comptables et Assistants.",
  cofounder: "Accès complet. Gère les accès et les onglets.",
  founder: "Compte fondateur : accès complet, ne peut être ni archivé ni restreint.",
};

export const ROLES_ADMIN: readonly Role[] = ["assistant", "qa_manager", "cofounder", "founder"];

/** Types autorisés à changer le type, les onglets et l'archivage des utilisateurs. */
export const ROLES_GESTION_ACCES: readonly Role[] = ["founder", "cofounder", "qa_manager"];

/** Équivalent de est_admin() : profil actif et d'un type à accès complet. */
export function estAdmin(p: { role: Role; actif: boolean } | null | undefined): boolean {
  return !!p && p.actif && ROLES_ADMIN.includes(p.role);
}

export function gereLesAcces(p: { role: Role; actif: boolean } | null | undefined): boolean {
  return !!p && p.actif && ROLES_GESTION_ACCES.includes(p.role);
}

/**
 * Hiérarchie de la gestion des accès : quels types de compte cette personne peut attribuer, modifier, archiver ou supprimer.
 * Founder : tous. Co-Founder : tous sauf Founder. QA Manager : Collaborateurs, Comptables et Assistants seulement,
 * pour qu'il ne puisse ni se promouvoir, ni prendre la main sur un compte Co-Founder.
 */
export function peutGererRole(p: { role: Role; actif: boolean } | null | undefined, cible: Role): boolean {
  if (!gereLesAcces(p)) return false;
  if (p!.role === "founder") return true;
  if (p!.role === "cofounder") return cible !== "founder";
  return ["collaborateur", "comptable", "assistant"].includes(cible);
}

/** Onglets de Cockpit, activables utilisateur par utilisateur. */
export const ONGLETS = ["aujourdhui", "cabinets", "saisie", "validation", "recap", "factures", "paie", "documents", "espace_client", "clients", "collaborateurs", "whatsapp"] as const;
export type Onglet = (typeof ONGLETS)[number];

export const ONGLET_LABEL: Record<Onglet, string> = {
  aujourdhui: "Aujourd'hui",
  cabinets: "Cabinets (prospection VetCare)",
  saisie: "Saisie des temps",
  validation: "Validation des temps",
  recap: "Récap mensuel",
  factures: "Factures",
  paie: "Bulletins de paie",
  documents: "Documents (contrats, NDA, légal)",
  espace_client: "Espace client",
  clients: "Clients",
  collaborateurs: "Collaborateurs",
  whatsapp: "Message WhatsApp",
};

export function ongletsParDefaut(role: Role): Onglet[] {
  if (role === "collaborateur") return ["saisie"];
  if (role === "comptable") return ["aujourdhui", "recap", "factures", "paie", "documents"];
  // Les salaires sont confidentiels : pas de bulletins de paie par défaut pour un Assistant.
  // Les documents (contrats, NDA, légal) : Founder, Co-Founders et Comptables par défaut.
  if (role === "assistant") return ONGLETS.filter((o) => o !== "paie" && o !== "documents");
  if (role === "qa_manager") return ONGLETS.filter((o) => o !== "documents");
  return [...ONGLETS];
}

/** Onglets effectifs : ceux choisis pour la personne, sinon ceux de son type. Le Founder les a toujours tous. */
export function ongletsDe(p: { role: Role; onglets?: readonly string[] | null }): Onglet[] {
  if (p.role === "founder") return [...ONGLETS];
  if (!p.onglets) return ongletsParDefaut(p.role);
  return ONGLETS.filter((o) => p.onglets!.includes(o));
}

export type StatutAcces = "invitation" | "actif" | "archive";

export const STATUT_ACCES_LABEL: Record<StatutAcces, string> = {
  invitation: "Invitation envoyée",
  actif: "Actif",
  archive: "Archivé",
};

export const STATUTS_SEMAINE = ["brouillon", "soumise", "validee"] as const;
export type StatutSemaine = (typeof STATUTS_SEMAINE)[number];

export const STATUTS_CABINET = [
  "a_contacter",
  "message_envoye",
  "relance",
  "en_discussion",
  "demo_planifiee",
  "client_signe",
  "pas_interesse",
  "hors_cible",
] as const;
export type StatutCabinet = (typeof STATUTS_CABINET)[number];

export const STATUT_CABINET_LABEL: Record<StatutCabinet, string> = {
  a_contacter: "À contacter",
  message_envoye: "Message WhatsApp envoyé",
  relance: "Relancé",
  en_discussion: "En discussion",
  demo_planifiee: "Démo planifiée",
  client_signe: "Client signé",
  pas_interesse: "Pas intéressé",
  hors_cible: "Hors cible",
};

export const MOT_DE_PASSE_MIN = 8;

/** Profil tel que renvoyé par /auth/moi. */
export type Moi = {
  id: string;
  nom: string;
  email: string;
  role: Role;
  admin: boolean;
  /** Peut changer les types, les onglets et archiver (Founder, Co-Founder, QA Manager). */
  gereAcces: boolean;
  onglets: Onglet[];
};

/** Coordonnées modifiables dans « Mon profil » (nécessaires aux contrats). */
export type Coordonnees = {
  /** M ou Mme : accords des attestations (« né » ou « née »). */
  civilite: string | null;
  date_naissance: string | null;
  lieu_naissance: string | null;
  nationalite: string | null;
  /** Numéro d'identification nationale : 18 chiffres. */
  nin: string | null;
  telephone: string | null;
  adresse: string | null;
  ville: string | null;
  wilaya: string | null;
  /** Paie : C, M, D ou V. */
  situation_familiale: string | null;
  numero_ss: string | null;
  numero_compte: string | null;
};

export const CHAMPS_COORDONNEES: Record<keyof Coordonnees, string> = {
  civilite: "civilité",
  date_naissance: "date de naissance",
  lieu_naissance: "lieu de naissance",
  nationalite: "nationalité",
  nin: "NIN",
  telephone: "téléphone",
  adresse: "adresse",
  ville: "ville",
  wilaya: "wilaya",
  situation_familiale: "situation familiale",
  numero_ss: "N° de sécurité sociale",
  numero_compte: "N° de compte bancaire",
};

/** Champs encore vides : la fiche doit être complète pour générer un contrat. */
export function coordonneesManquantes(c: Partial<Coordonnees>): string[] {
  return (Object.keys(CHAMPS_COORDONNEES) as (keyof Coordonnees)[]).filter((k) => !c[k]).map((k) => CHAMPS_COORDONNEES[k]);
}

/** Civilité (attestation et certificat de travail). */
export const CIVILITES: Record<string, string> = { M: "Monsieur", Mme: "Madame" };

/** Situation familiale (bulletin de paie). */
export const SITUATIONS: Record<string, string> = { C: "Célibataire", M: "Marié(e)", D: "Divorcé(e)", V: "Veuf / veuve" };

/** NIN sans espaces, ou null s'il n'a pas 18 chiffres. */
export function normaliserNin(v: string): string | null {
  const n = v.replace(/[\s.-]/g, "");
  return /^[0-9]{18}$/.test(n) ? n : null;
}

/** Les 58 wilayas, dans l'ordre de leur code (proposées à la saisie, sans être imposées). */
export const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
  "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda",
  "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent", "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar",
  "Ouled Djellal", "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa",
] as const;

/** Format « 12 000 DZD ». */
export function formatDzd(montant: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(montant)).replace(/ | /g, " ")} DZD`;
}

/** Le prénom est le premier mot du nom. */
export function prenom(nom: string): string {
  return nom.trim().split(/\s+/)[0] ?? "";
}

/** Vrai si la date ISO (aaaa-mm-jj) est un lundi. */
export function estLundi(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso && d.getUTCDay() === 1;
}

/** Ajoute n jours à une date ISO. */
export function ajouterJours(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine contenant la date ISO. */
export function lundiDe(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  const decalage = (d.getUTCDay() + 6) % 7;
  return ajouterJours(iso, -decalage);
}

/** Date du jour à Alger, au format aaaa-mm-jj. */
export function aujourdhui(maintenant: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Algiers" }).format(maintenant);
}

/** Premier et dernier jour du mois d'une date ISO. */
export function bornesMois(iso: string): { debut: string; fin: string } {
  const debut = `${iso.slice(0, 7)}-01`;
  const d = new Date(`${debut}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return { debut, fin: d.toISOString().slice(0, 10) };
}

// --- Suivi des temps ---

export type ValeurJour = 0.5 | 1;
export type Temps = { client_id: string; jour: string; valeur: number };

export const STATUT_SEMAINE_LABEL: Record<StatutSemaine, string> = {
  brouillon: "Brouillon",
  soumise: "Soumise",
  validee: "Validée",
};

/** Cycle d'une case de la grille : vide → 1 jour → ½ jour → vide. */
export function valeurSuivante(v: number): number {
  return v === 0 ? 1 : v === 1 ? 0.5 : 0;
}

/** « 2,5 j ». */
export function formatJours(n: number, unite = true): string {
  const s = n.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  return unite ? `${s} j` : s;
}

/** Les cinq jours ouvrés (lundi → vendredi) d'une semaine. */
export function joursOuvres(lundi: string): string[] {
  return [0, 1, 2, 3, 4].map((n) => ajouterJours(lundi, n));
}

/** « Semaine du 23 nov. 2026 ». */
export function libelleSemaine(lundi: string): string {
  const d = new Date(`${lundi}T12:00:00Z`);
  return `Semaine du ${d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
}

/** Regroupe les temps d'une semaine par client : jours détaillés et total. */
export function grouperParClient(temps: (Temps & { nom: string })[]) {
  const parClient = new Map<string, { client_id: string; nom: string; jours: Record<string, number>; total: number }>();
  for (const t of temps) {
    const l = parClient.get(t.client_id) ?? { client_id: t.client_id, nom: t.nom, jours: {}, total: 0 };
    l.jours[t.jour] = (l.jours[t.jour] ?? 0) + t.valeur;
    l.total += t.valeur;
    parClient.set(t.client_id, l);
  }
  const lignes = [...parClient.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return { lignes, total: lignes.reduce((s, l) => s + l.total, 0) };
}

// --- Récap mensuel ---

export type LigneRecapBrute = { client_id: string; client: string; tjm_dzd: number; profil_id: string; collaborateur: string; jours: number };

export type RecapClient = {
  client_id: string;
  nom: string;
  tjm_dzd: number;
  jours: number;
  montant: number;
  collaborateurs: { profil_id: string; nom: string; jours: number; montant: number }[];
};

/** Montant HT = jours × TJM du client, par collaborateur puis par client. */
export function construireRecap(lignes: LigneRecapBrute[]) {
  const clients = new Map<string, RecapClient>();
  for (const l of lignes) {
    const c = clients.get(l.client_id) ?? { client_id: l.client_id, nom: l.client, tjm_dzd: l.tjm_dzd, jours: 0, montant: 0, collaborateurs: [] };
    const montant = l.jours * l.tjm_dzd;
    c.collaborateurs.push({ profil_id: l.profil_id, nom: l.collaborateur, jours: l.jours, montant });
    c.jours += l.jours;
    c.montant += montant;
    clients.set(l.client_id, c);
  }
  const liste = [...clients.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  for (const c of liste) c.collaborateurs.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return {
    clients: liste,
    jours: liste.reduce((s, c) => s + c.jours, 0),
    montant: liste.reduce((s, c) => s + c.montant, 0),
  };
}

const nombreCsv = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");
const champCsv = (s: string) => (/[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

/** Export CSV pour Excel : BOM UTF-8, séparateur « ; », virgule décimale. */
export function recapEnCsv(recap: ReturnType<typeof construireRecap>): string {
  const lignes = [["Client", "Collaborateur", "Jours", "TJM (DZD)", "Montant HT (DZD)"]];
  for (const c of recap.clients)
    for (const p of c.collaborateurs) lignes.push([c.nom, p.nom, nombreCsv(p.jours), nombreCsv(c.tjm_dzd), nombreCsv(p.montant)]);
  lignes.push(["Total", "", nombreCsv(recap.jours), "", nombreCsv(recap.montant)]);
  return "﻿" + lignes.map((l) => l.map(champCsv).join(";")).join("\r\n") + "\r\n";
}

/** Mois au format aaaa-mm : décalage et libellé (« novembre 2026 »). */
export function decalerMois(mois: string, n: number): string {
  const d = new Date(`${mois}-01T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 7);
}

export function libelleMois(mois: string): string {
  return new Date(`${mois}-01T12:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
}
