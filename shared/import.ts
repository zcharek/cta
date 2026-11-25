// Import des cabinets depuis un classeur Excel ou un CSV : lecture, rapprochement et mise à jour.
// Fonctions pures : utilisées par le navigateur (analyse), l'API (mise à jour) et les tests.
import { STATUTS_CABINET, STATUT_CABINET_LABEL, type StatutCabinet } from "./cockpit.js";
import { neufDerniersChiffres, sansAccents } from "./prospection.js";

export type Cellule = { v: string | number | boolean | Date | null; lien?: string };
export type Feuille = { nom: string; lignes: Cellule[][] };

export const CHAMPS_TEXTE = [
  "numero",
  "nom",
  "commune",
  "veterinaire",
  "type",
  "adresse",
  "adresse2",
  "telephone",
  "telephone2",
  "email",
  "site",
  "facebook",
  "instagram",
  "tiktok",
  "lien_carte",
  "horaires",
  "urgences",
  "note_google",
  "etat_google",
  "sources",
  "segment",
  "semaine_plan",
  "canal1",
  "contact_canal1",
  "canal_relance",
  "contact_relance",
  "message",
  "ensuite",
  "notes",
] as const;
export type ChampTexte = (typeof CHAMPS_TEXTE)[number];
export const CHAMPS_DATE = ["premier_contact", "relance_le", "demo_le"] as const;
export type ChampDate = (typeof CHAMPS_DATE)[number];

export type CabinetImporte = { cle: string; nom: string } & Partial<Record<ChampTexte, string | null>> &
  Partial<Record<ChampDate, string | null>> & {
    lat?: number | null;
    lng?: number | null;
    statut: StatutCabinet;
    raison_hors_cible: string | null;
    extra: Record<string, string>;
  };

export type Analyse = {
  cabinets: CabinetImporte[];
  onglets: string[];
  doublons: string[];
  testsIgnores: string[];
  colonnesConservees: string[];
  avertissements: string[];
};

// --- Normalisation ---

export const cleTexte = (s: string | null | undefined) => sansAccents(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Clé de rapprochement : nom + commune ; à défaut nom + 9 derniers chiffres du téléphone. */
export function cleCabinet(nom: string, commune: string | null | undefined, telephone: string | null | undefined): string {
  const n = cleTexte(nom) || nom.trim().toLowerCase();
  const c = cleTexte(commune);
  if (c) return `${n}-${c}`;
  const t = neufDerniersChiffres(telephone);
  return t ? `${n}-t${t}` : n;
}

/** Comparaison tolérante : casse, accents, ponctuation et préfixe « Dr » ignorés. */
export function comparable(v: unknown): string {
  if (v === null || v === undefined) return "";
  return sansAccents(String(v))
    .toLowerCase()
    .replace(/^\s*(dr|docteur)\.?\s+/, "")
    .replace(/[^a-z0-9]/g, "");
}

const PREFIXE_LIEN_CALCULE = "https://www.google.com/maps?q=";
export const lienCalcule = (lat: number, lng: number) => `${PREFIXE_LIEN_CALCULE}${lat},${lng}`;
export const estLienCalcule = (l: string | null | undefined) => !!l && l.startsWith(PREFIXE_LIEN_CALCULE);

const normEntete = (h: string) => sansAccents(h).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

type Cible = ChampTexte | ChampDate | "lat" | "lng" | "statut" | "telephone2" | "notes" | "liens_sources" | "ignorer";

/** Correspondance entre un en-tête du fichier et un champ. null : colonne conservée dans « extra ». */
export function champPourEntete(entete: string): Cible | null {
  const h = normEntete(entete);
  if (!h) return null;
  if (/^(n|no|num|numero)$/.test(h)) return "numero";
  if (/^(nom de l etablissement|nom etablissement|etablissement|cabinet|nom du cabinet|nom)$/.test(h)) return "nom";
  if (h.startsWith("veterinaire")) return "veterinaire";
  if (h === "type") return "type";
  if (h === "commune") return "commune";
  if (h === "adresse exacte" || h === "adresse") return "adresse";
  if (h.startsWith("autre adresse")) return "adresse2";
  if (h === "telephone 1" || h === "telephone") return "telephone";
  if (h === "telephone 2" || h.startsWith("autres telephone")) return "telephone2";
  if (h === "email" || h === "e mail") return "email";
  if (h.startsWith("site")) return "site";
  if (h === "facebook") return "facebook";
  if (h === "instagram") return "instagram";
  if (h.startsWith("tiktok")) return "tiktok";
  if (h === "latitude") return "lat";
  if (h === "longitude") return "lng";
  if (h.startsWith("lien carte")) return "lien_carte";
  if (h === "horaires") return "horaires";
  if (h.startsWith("urgences")) return "urgences";
  if (h === "note google") return "note_google";
  if (h === "statut") return "statut";
  if (h.startsWith("notes")) return "notes";
  if (h === "sources") return "sources";
  if (h === "liens sources") return "liens_sources";
  if (h === "segment") return "segment";
  if (h === "semaine") return "semaine_plan";
  if (h === "canal 1") return "canal1";
  if (h === "contact canal 1") return "contact_canal1";
  if (h === "canal relance") return "canal_relance";
  if (h === "contact relance") return "contact_relance";
  if (h.startsWith("message")) return "message";
  if (h === "ensuite") return "ensuite";
  if (h === "date 1er contact" || h === "date premier contact") return "premier_contact";
  if (h === "date relance") return "relance_le";
  if (h === "date demo") return "demo_le";
  if (h === "lien whatsapp") return "ignorer";
  return null;
}

function texte(c: Cellule | undefined): string | null {
  if (!c || c.v === null || c.v === undefined) return null;
  if (c.v instanceof Date) return dateIso(c.v);
  const s = String(c.v).trim();
  return s ? s : null;
}

function dateIso(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Date jj/mm/aaaa (ou objet Date, ou numéro de série Excel) au format aaaa-mm-jj. */
export function lireDate(c: Cellule | undefined): string | null {
  if (!c || c.v === null || c.v === "") return null;
  if (c.v instanceof Date) return Number.isNaN(c.v.getTime()) ? null : dateIso(c.v);
  if (typeof c.v === "number" && c.v > 20000 && c.v < 80000) {
    const d = new Date(Date.UTC(1899, 11, 30) + c.v * 86400000);
    return d.toISOString().slice(0, 10);
  }
  const s = String(c.v).trim();
  let m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s);
  if (m) {
    const iso = `${m[3]}-${m[2]!.padStart(2, "0")}-${m[1]!.padStart(2, "0")}`;
    return Number.isNaN(new Date(`${iso}T00:00:00Z`).getTime()) ? null : iso;
  }
  m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

/** Coordonnée acceptant la virgule décimale. */
export function lireNombre(c: Cellule | undefined): number | null {
  if (!c || c.v === null || c.v === "") return null;
  if (typeof c.v === "number") return c.v;
  const n = Number(String(c.v).trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const STATUT_PAR_LIBELLE = new Map<string, StatutCabinet>([
  ...STATUTS_CABINET.map((s) => [comparable(STATUT_CABINET_LABEL[s]), s] as [string, StatutCabinet]),
  [comparable("Message envoyé"), "message_envoye"],
  [comparable("Démo"), "demo_planifiee"],
  [comparable("Signé"), "client_signe"],
]);

// --- Lecture d'une feuille ---

type Brut = Partial<Record<ChampTexte | ChampDate, string | null>> & { lat?: number | null; lng?: number | null; statutTexte?: string | null; extra: Record<string, string> };

type FeuilleLue = { nom: string; lignes: Brut[]; prospection: boolean; colonnesExtra: string[] };

/** Ligne d'en-tête : la première des 6 premières lignes qui contient une colonne de nom de cabinet. */
function ligneEntete(f: Feuille): number {
  for (let i = 0; i < Math.min(6, f.lignes.length); i++)
    if (f.lignes[i]!.some((c) => typeof c?.v === "string" && champPourEntete(c.v) === "nom")) return i;
  return -1;
}

function lireFeuille(f: Feuille, iEntete: number): FeuilleLue {
  const entetes = f.lignes[iEntete]!.map((c) => (c?.v === null || c?.v === undefined ? "" : String(c.v).trim()));
  const cibles = entetes.map(champPourEntete);
  const colonnesExtra = entetes.filter((h, i) => h && cibles[i] === null);
  const prospection = cibles.some((c) => c === "segment" || c === "canal1" || c === "message");
  const lignes: Brut[] = [];
  for (const ligne of f.lignes.slice(iEntete + 1)) {
    const b: Brut = { extra: {} };
    cibles.forEach((cible, i) => {
      const cel = ligne[i];
      const t = texte(cel);
      if (cible === "ignorer") return;
      if (cible === null) {
        if (t && entetes[i]) b.extra[entetes[i]!] = t;
        return;
      }
      if (cible === "lat" || cible === "lng") return void (b[cible] = lireNombre(cel));
      if (cible === "premier_contact" || cible === "relance_le" || cible === "demo_le") return void (b[cible] = lireDate(cel));
      if (!t) return;
      if (cible === "statut") {
        if (/ferm/i.test(sansAccents(t))) b.etat_google = t;
        else b.statutTexte = t;
      } else if (cible === "telephone2") b.telephone2 = b.telephone2 ? `${b.telephone2}; ${t}` : t;
      else if (cible === "notes") b.notes = b.notes ? `${b.notes}\n${t}` : t;
      else if (cible === "liens_sources") b.extra.liens_sources = t;
      else if (cible === "lien_carte") b.lien_carte = cel?.lien || t;
      else if (cible === "message") b.message = t.replace(/\\n/g, "\n");
      else if (cible === "ensuite") b.ensuite = t.replace(/^\s*\[\s*/, "").replace(/\s*\]\s*$/, "");
      else b[cible] = t;
    });
    if (b.nom) lignes.push(b);
  }
  return { nom: f.nom, lignes, prospection, colonnesExtra };
}

/** Fusionne b dans a : seuls les champs vides de a sont complétés. */
function completer(a: Brut, b: Brut): Brut {
  const r: Brut = { ...a, extra: { ...b.extra, ...a.extra } };
  for (const [k, v] of Object.entries(b)) {
    if (k === "extra" || v === null || v === undefined || v === "") continue;
    const actuel = (r as Record<string, unknown>)[k];
    if (actuel === null || actuel === undefined || actuel === "") (r as Record<string, unknown>)[k] = v;
  }
  return r;
}

/** Fusionne b dans a : les valeurs non vides de b l'emportent. */
function ecraser(a: Brut, b: Brut): Brut {
  const r: Brut = { ...a, extra: { ...a.extra, ...b.extra } };
  for (const [k, v] of Object.entries(b)) if (k !== "extra" && v !== null && v !== undefined && v !== "") (r as Record<string, unknown>)[k] = v;
  return r;
}

const estTest = (nom: string) => /^test\b/i.test(nom.trim());
const cleDe = (b: Brut) => cleCabinet(b.nom!, b.commune, b.telephone);

/** Dédoublonne les lignes d'une feuille et écarte les lignes de test. */
function dedoublonner(lignes: Brut[], doublons: string[] | null, tests: Set<string>) {
  const parCle = new Map<string, Brut>();
  for (const b of lignes) {
    if (estTest(b.nom!)) {
      tests.add(b.nom!);
      continue;
    }
    const k = cleDe(b);
    const deja = parCle.get(k);
    if (deja) {
      parCle.set(k, completer(deja, b));
      doublons?.push(b.nom!);
    } else parCle.set(k, b);
  }
  return parCle;
}

/** Analyse les feuilles d'un classeur (ou l'unique feuille d'un CSV). */
export function analyserFeuilles(feuilles: Feuille[], avertissements: string[] = []): Analyse {
  const lues = feuilles.flatMap((f) => {
    const i = ligneEntete(f);
    return i < 0 ? [] : [lireFeuille(f, i)];
  });
  if (lues.length === 0) throw new Error("Aucun onglet ne contient de colonne de nom de cabinet (par exemple « Nom de l'établissement »).");

  const prospection = lues.find((f) => f.prospection && lues.length > 1) ?? null;
  const autres = lues.filter((f) => f !== prospection);
  const annuaire = autres.find((f) => /annuaire/i.test(f.nom)) ?? autres[0] ?? prospection!;

  const doublons: string[] = [];
  const tests = new Set<string>();
  const base = dedoublonner(annuaire.lignes, doublons, tests);
  const resultat = new Map<string, Brut>();
  const horsCible = new Map<string, string>();

  if (prospection && prospection !== annuaire) {
    const prosp = dedoublonner(prospection.lignes, null, tests);
    // Rapprochement : clé, puis numéro, puis nom seul s'il est unique
    const parNumero = new Map([...prosp].filter(([, b]) => b.numero).map(([k, b]) => [b.numero!, k]));
    const parNom = new Map<string, string | null>();
    for (const [k, b] of prosp) {
      const n = cleTexte(b.nom);
      parNom.set(n, parNom.has(n) ? null : k);
    }
    const utilises = new Set<string>();
    for (const [k, b] of base) {
      const kp = prosp.has(k) ? k : (b.numero && parNumero.get(b.numero)) || parNom.get(cleTexte(b.nom)) || null;
      if (kp && !utilises.has(kp)) {
        utilises.add(kp);
        resultat.set(k, ecraser(b, prosp.get(kp)!));
      } else {
        resultat.set(k, b);
        horsCible.set(k, "Absent de l'onglet prospection");
      }
    }
    for (const [kp, b] of prosp) if (!utilises.has(kp) && !resultat.has(kp)) resultat.set(kp, b);
  } else for (const [k, b] of base) resultat.set(k, b);

  const cabinets: CabinetImporte[] = [];
  for (const [cle, b] of resultat) {
    const { statutTexte, extra, ...champs } = b;
    let statut: StatutCabinet = (statutTexte && STATUT_PAR_LIBELLE.get(comparable(statutTexte))) || "a_contacter";
    let raison: string | null = horsCible.get(cle) ?? null;
    if (b.etat_google && /ferm/i.test(sansAccents(b.etat_google))) raison = "Fermé selon Google";
    if (raison) statut = "hors_cible";
    if (statutTexte && !STATUT_PAR_LIBELLE.get(comparable(statutTexte))) extra.statut = statutTexte;
    const c: CabinetImporte = { ...champs, cle, nom: b.nom!, statut, raison_hors_cible: raison, extra };
    if (!c.lien_carte && typeof c.lat === "number" && typeof c.lng === "number") c.lien_carte = lienCalcule(c.lat, c.lng);
    cabinets.push(c);
  }

  if (cabinets.some((c) => Object.values(c).some((v) => typeof v === "string" && v.includes("___"))))
    avertissements.push("Ce fichier contient « ___ » : l'export a perdu les caractères arabes. Le fichier Excel d'origine est préférable.");

  return {
    cabinets,
    onglets: [...new Set([annuaire.nom, ...(prospection ? [prospection.nom] : [])])],
    doublons,
    testsIgnores: [...tests],
    colonnesConservees: [...new Set(lues.flatMap((f) => f.colonnesExtra))],
    avertissements,
  };
}

// --- CSV ---

const ACCENTS_FR = /[éèêëàâäçùûüôöîïœÉÈÊÀÂÇÙÛÔÎ]/g;

/** UTF-8 si valide ; sinon Windows-1252 ou Mac Roman, choisi en comptant les lettres accentuées françaises. */
export function decoderCsv(octets: Uint8Array): { texte: string; encodage: string } {
  try {
    const t = new TextDecoder("utf-8", { fatal: true }).decode(octets);
    return { texte: t.replace(/^﻿/, ""), encodage: "UTF-8" };
  } catch {
    const candidats = ["windows-1252", "macintosh"].map((enc) => {
      const texte = new TextDecoder(enc).decode(octets);
      return { texte, encodage: enc === "macintosh" ? "Mac Roman" : "Windows-1252", score: (texte.match(ACCENTS_FR) ?? []).length };
    });
    const meilleur = candidats.sort((a, b) => b.score - a.score)[0]!;
    return { texte: meilleur.texte, encodage: meilleur.encodage };
  }
}

/** Séparateur le plus fréquent dans la première ligne (hors guillemets). */
export function detecterSeparateur(texte: string): string {
  let ligne = "";
  let guillemets = false;
  for (const ch of texte) {
    if (ch === '"') guillemets = !guillemets;
    if (!guillemets && (ch === "\n" || ch === "\r")) break;
    if (!guillemets) ligne += ch;
  }
  const comptes = [",", ";", "\t"].map((s) => [s, ligne.split(s).length - 1] as const);
  return [...comptes].sort((a, b) => b[1] - a[1])[0]![0];
}

/** Lecture CSV (RFC 4180) : guillemets, guillemets doublés et retours à la ligne dans les champs. */
export function lireCsv(texte: string, separateur: string): string[][] {
  const lignes: string[][] = [];
  let ligne: string[] = [];
  let champ = "";
  let guillemets = false;
  for (let i = 0; i < texte.length; i++) {
    const ch = texte[i]!;
    if (guillemets) {
      if (ch === '"' && texte[i + 1] === '"') {
        champ += '"';
        i++;
      } else if (ch === '"') guillemets = false;
      else champ += ch;
    } else if (ch === '"' && champ === "") guillemets = true;
    else if (ch === separateur) {
      ligne.push(champ);
      champ = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && texte[i + 1] === "\n") i++;
      ligne.push(champ);
      lignes.push(ligne);
      ligne = [];
      champ = "";
    } else champ += ch;
  }
  if (champ !== "" || ligne.length) {
    ligne.push(champ);
    lignes.push(ligne);
  }
  return lignes.filter((l) => l.some((c) => c.trim() !== ""));
}

export function feuilleDepuisCsv(octets: Uint8Array, nom = "CSV"): { feuille: Feuille; encodage: string; separateur: string } {
  const { texte, encodage } = decoderCsv(octets);
  const separateur = detecterSeparateur(texte);
  return { feuille: { nom, lignes: lireCsv(texte, separateur).map((l) => l.map((v) => ({ v }))) }, encodage, separateur };
}

// --- Mise à jour des cabinets déjà importés ---

/** Champs qu'un réimport peut mettre à jour. Jamais le statut, les dates ni l'historique. */
export const CHAMPS_MIS_A_JOUR: (ChampTexte | "lat" | "lng")[] = [...CHAMPS_TEXTE, "lat", "lng"];

/**
 * Modifications à apporter à un cabinet existant, ou null s'il est identique.
 * Ne remplace jamais une valeur par un texte contenant « ___ », ni un vrai lien de carte par un lien recalculé.
 * Les notes ne sont complétées que si elles sont vides (elles ont pu être modifiées dans Cockpit).
 */
export function calculerMiseAJour(existant: Record<string, unknown>, importe: CabinetImporte): Record<string, unknown> | null {
  const patch: Record<string, unknown> = {};
  for (const champ of CHAMPS_MIS_A_JOUR) {
    const nouveau = importe[champ];
    const actuel = existant[champ];
    if (nouveau === null || nouveau === undefined || nouveau === "") continue;
    if (typeof nouveau === "number") {
      if (typeof actuel !== "number" || Math.abs(actuel - nouveau) > 1e-7) patch[champ] = nouveau;
      continue;
    }
    if (nouveau.includes("___")) continue;
    if (champ === "lien_carte" && estLienCalcule(nouveau) && actuel && !estLienCalcule(String(actuel))) continue;
    if (champ === "notes" && actuel) continue;
    if (comparable(actuel) !== comparable(nouveau)) patch[champ] = nouveau;
  }
  const extraActuel = (existant.extra ?? {}) as Record<string, string>;
  const extraNouveau = Object.fromEntries(Object.entries(importe.extra ?? {}).filter(([k, v]) => !v.includes("___") && comparable(extraActuel[k]) !== comparable(v)));
  if (Object.keys(extraNouveau).length) patch.extra = { ...extraActuel, ...extraNouveau };
  return Object.keys(patch).length ? patch : null;
}
