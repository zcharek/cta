// Règles métier de la prospection VetCare, partagées par l'API, l'interface et les tests.
import { ajouterJours, type StatutCabinet } from "./cockpit.js";

/** Ordre des colonnes du Kanban. « Hors cible » n'est jamais affiché. */
export const COLONNES_KANBAN: StatutCabinet[] = [
  "a_contacter",
  "message_envoye",
  "relance",
  "en_discussion",
  "demo_planifiee",
  "client_signe",
  "pas_interesse",
];

export const COULEUR_STATUT: Record<StatutCabinet, string> = {
  a_contacter: "#B8C3D6",
  message_envoye: "#6FB2E3",
  relance: "#E89A3C",
  en_discussion: "#2F5BD3",
  demo_planifiee: "#7A5BC7",
  client_signe: "#1E8A5A",
  pas_interesse: "#C0392B",
  hors_cible: "#8892A6",
};

export const STATUTS_FINAUX: StatutCabinet[] = ["client_signe", "pas_interesse", "hors_cible"];

/** Délai de relance (en jours) après passage à chaque statut. */
const DELAI_RELANCE: Partial<Record<StatutCabinet, number>> = {
  message_envoye: 5,
  relance: 7,
  en_discussion: 3,
  demo_planifiee: 2,
};

export type EtatProspection = {
  statut: StatutCabinet;
  premier_contact: string | null;
  relance_le: string | null;
  demo_le: string | null;
};

/**
 * Effet d'un changement de statut sur les dates :
 * premier contact rempli s'il est vide, prochaine relance à J+n (date de la démo pour une démo planifiée),
 * relance effacée pour « À contacter » et les statuts finaux.
 */
export function appliquerStatut(c: EtatProspection, statut: StatutCabinet, aujourdhui: string): EtatProspection {
  const delai = DELAI_RELANCE[statut];
  if (delai === undefined) return { ...c, statut, relance_le: null };
  const relance = statut === "demo_planifiee" && c.demo_le ? c.demo_le : ajouterJours(aujourdhui, delai);
  return { ...c, statut, premier_contact: c.premier_contact ?? aujourdhui, relance_le: relance };
}

/** À relancer : date de relance passée ou du jour, statut ni final ni « À contacter ». */
export function estARelancer(c: { statut: StatutCabinet; relance_le: string | null }, aujourdhui: string): boolean {
  return !!c.relance_le && c.relance_le <= aujourdhui && c.statut !== "a_contacter" && !STATUTS_FINAUX.includes(c.statut);
}

// --- Téléphones et WhatsApp ---

/** Découpe un champ pouvant contenir plusieurs numéros (« 0550 12 34 56 / 021 23 45 67 »). */
export function numerosDe(champ: string | null | undefined): string[] {
  if (!champ) return [];
  return champ
    .split(/[\/;,|\n]|\s{2,}|\bou\b/i)
    .map((s) => s.trim())
    .filter((s) => /\d{6,}/.test(s.replace(/[\s.\-()]/g, "")));
}

/** Numéro mobile algérien au format international sans « + » (213XXXXXXXXX), ou null. */
export function mobileAlgerien(numero: string): string | null {
  const brut = numero.replace(/[\s.\-()]/g, "");
  let m = /^0([567]\d{8})$/.exec(brut);
  if (m) return `213${m[1]}`;
  m = /^(?:\+|00)?213\s*0?([567]\d{8})$/.exec(brut);
  if (m) return `213${m[1]}`;
  return null;
}

/** Numéro à appeler (fixe ou mobile), au format tel:. */
export function lienAppel(numero: string): string | null {
  const brut = numero.replace(/[\s.\-()]/g, "");
  let m = /^0(\d{8,9})$/.exec(brut);
  if (m) return `tel:+213${m[1]}`;
  m = /^(?:\+|00)213\s*0?(\d{8,9})$/.exec(brut);
  if (m) return `tel:+213${m[1]}`;
  return /^\+?\d{6,15}$/.test(brut) ? `tel:${brut}` : null;
}

export type ContactsCabinet = {
  nom: string;
  veterinaire: string | null;
  telephone: string | null;
  contact_canal1: string | null;
  contact_relance: string | null;
  message: string | null;
};

/** Premier mobile valide parmi contact canal 1, téléphone, puis contact relance. */
export function numeroWhatsApp(c: Pick<ContactsCabinet, "telephone" | "contact_canal1" | "contact_relance">): string | null {
  for (const champ of [c.contact_canal1, c.telephone, c.contact_relance]) {
    for (const n of numerosDe(champ)) {
      const m = mobileAlgerien(n);
      if (m) return m;
    }
  }
  return null;
}

/** Message personnalisé du cabinet, sinon le modèle des réglages avec {veterinaire} et {cabinet} remplacés. */
export function messageWhatsApp(c: ContactsCabinet, modele: string): string {
  if (c.message?.trim()) return c.message.trim();
  return modele.replace(/\{veterinaire\}/g, c.veterinaire?.trim() || "Docteur").replace(/\{cabinet\}/g, c.nom.trim());
}

export function lienWhatsApp(c: ContactsCabinet, modele: string): string | null {
  const numero = numeroWhatsApp(c);
  return numero ? `https://wa.me/${numero}?text=${encodeURIComponent(messageWhatsApp(c, modele))}` : null;
}

/** Lien d'appel du premier numéro connu, utile pour les fixes sans WhatsApp. */
export function lienAppelCabinet(c: Pick<ContactsCabinet, "telephone" | "contact_canal1" | "contact_relance">): string | null {
  for (const champ of [c.telephone, c.contact_canal1, c.contact_relance])
    for (const n of numerosDe(champ)) {
      const l = lienAppel(n);
      if (l) return l;
    }
  return null;
}

/** Les 9 derniers chiffres d'un téléphone : sert à repérer les doublons. */
export function neufDerniersChiffres(tel: string | null | undefined): string | null {
  const chiffres = (numerosDe(tel)[0] ?? "").replace(/\D/g, "");
  return chiffres.length >= 9 ? chiffres.slice(-9) : null;
}

// --- Recherche et tri ---

export const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const normaliser = (s: string | null | undefined) => sansAccents(s ?? "").toLowerCase();

export type CabinetRecherche = {
  nom: string;
  veterinaire: string | null;
  commune: string | null;
  telephone: string | null;
  telephone2: string | null;
  contact_canal1: string | null;
  contact_relance: string | null;
  email: string | null;
  adresse: string | null;
  notes: string | null;
};

/** Recherche plein texte. Une suite d'au moins 4 chiffres cherche aussi dans les numéros, espaces ignorés. */
export function correspond(c: CabinetRecherche, recherche: string): boolean {
  const q = normaliser(recherche).trim();
  if (!q) return true;
  const texte = [c.nom, c.veterinaire, c.commune, c.telephone, c.telephone2, c.contact_canal1, c.contact_relance, c.email, c.adresse, c.notes].map(normaliser).join("\n");
  if (texte.includes(q)) return true;
  if (q.replace(/\D/g, "").length >= 4 && /^[\d\s.+\-()]+$/.test(q)) {
    // « 0550… », « +213 550… » et « 00213 550… » désignent le même numéro : tout est ramené au format national.
    const national = (s: string) => s.replace(/\D/g, "").replace(/^(00)?2130?/, "0");
    const numeros = [c.telephone, c.telephone2, c.contact_canal1, c.contact_relance].flatMap((t) => numerosDe(t)).map(national).join(" ");
    const chiffres = national(q);
    return numeros.includes(chiffres) || numeros.includes(chiffres.replace(/^0/, ""));
  }
  return false;
}

const comparerNaturel = (a: string | null, b: string | null) => {
  if (a === b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, "fr", { numeric: true, sensitivity: "base" });
};

export type CabinetTri = { nom: string; commune: string | null; semaine_plan: string | null; statut: StatutCabinet; relance_le: string | null };

/** Cartes dues en tête (relance la plus ancienne d'abord), puis par semaine du plan, commune et nom. */
export function trierCartes<T extends CabinetTri>(cartes: T[], aujourdhui: string): T[] {
  return [...cartes].sort((a, b) => {
    const da = estARelancer(a, aujourdhui);
    const db = estARelancer(b, aujourdhui);
    if (da !== db) return da ? -1 : 1;
    if (da && db && a.relance_le !== b.relance_le) return a.relance_le! < b.relance_le! ? -1 : 1;
    return comparerNaturel(a.semaine_plan, b.semaine_plan) || comparerNaturel(a.commune, b.commune) || comparerNaturel(a.nom, b.nom);
  });
}

/** Ordre naturel des semaines du plan (« S2 » avant « S10 »). */
export function trierSemaines(semaines: (string | null)[]): string[] {
  return [...new Set(semaines.filter((s): s is string => !!s))].sort((a, b) => comparerNaturel(a, b));
}

export const MODELE_PAR_DEFAUT =
  "Bonjour {veterinaire}, je me permets de vous contacter au sujet du cabinet {cabinet}. Nous avons conçu VetCare, une application qui simplifie la gestion des rendez-vous et le suivi des patients. Seriez-vous disponible pour une courte démonstration ?";
