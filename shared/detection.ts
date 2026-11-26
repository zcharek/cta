// Détection automatique à partir du texte d'un document : type (facture, NDA, contrat, document légal…),
// client, et pour une facture son numéro, ses dates et ses montants. Tout reste modifiable avant l'enregistrement.

export const CATEGORIES = ["contrat", "nda", "bon_commande", "statuts", "registre_commerce", "fiscal", "social", "bilan", "banque", "autre"] as const;
export type Categorie = (typeof CATEGORIES)[number];
export type TypeDocument = "facture" | Categorie;

export const CATEGORIE_LABEL: Record<Categorie, string> = {
  contrat: "Contrat",
  nda: "NDA / confidentialité",
  bon_commande: "Bon de commande",
  statuts: "Statuts et PV",
  registre_commerce: "Registre de commerce",
  fiscal: "Fiscal (NIF, NIS, AI, attestations)",
  social: "Social (CNAS, CASNOS)",
  bilan: "Bilans et déclarations",
  banque: "Banque",
  autre: "Autre",
};

/** Catégories liées à un client ; les autres concernent CTA elle-même. */
export const CATEGORIES_CLIENT: readonly Categorie[] = ["contrat", "nda", "bon_commande"];

/** Pièces du dossier légal de CTA. « renouveler » : attestation à durée limitée, ajoutée avec sa date de validité. */
export const PIECES = [
  { cle: "registre_commerce", titre: "Registre de commerce", categorie: "registre_commerce", identite: "rc", prefixe: "RC", icone: "batiment" },
  { cle: "nif", titre: "Numéro d'identification fiscale", categorie: "fiscal", identite: "nif", prefixe: "NIF", icone: "document" },
  { cle: "nis", titre: "Numéro d'identification statistique", categorie: "fiscal", identite: "nis", prefixe: "NIS", icone: "diese" },
  { cle: "article_imposition", titre: "Article d'imposition", categorie: "fiscal", identite: "ai", prefixe: "AI", icone: "facture" },
  { cle: "statuts", titre: "Statuts de la SARL", categorie: "statuts", detail: "Version signée en vigueur", icone: "document" },
  { cle: "rib", titre: "Relevé d'identité bancaire", categorie: "banque", identite: "rib", prefixe: "RIB", icone: "banque" },
  { cle: "cnas", titre: "Attestation CNAS", categorie: "social", detail: "Mise à jour des cotisations salariés", renouveler: true, icone: "horloge" },
  { cle: "casnos", titre: "Attestation CASNOS", categorie: "social", detail: "Mise à jour des cotisations non-salariés", renouveler: true, icone: "horloge" },
  { cle: "extrait_role", titre: "Extrait de rôle", categorie: "fiscal", detail: "Situation fiscale à jour", renouveler: true, icone: "horloge" },
] as const satisfies readonly { cle: string; titre: string; categorie: Categorie; identite?: string; prefixe?: string; detail?: string; renouveler?: boolean; icone: string }[];
export type Piece = (typeof PIECES)[number]["cle"];
export type DefinitionPiece = (typeof PIECES)[number] & { identite?: string; prefixe?: string; detail?: string; renouveler?: boolean };
export const PIECE = Object.fromEntries(PIECES.map((p) => [p.cle, p])) as Record<Piece, DefinitionPiece>;

/** Pièce du dossier légal reconnue dans le nom du fichier, puis dans le texte (null : aucune). */
function pieceDepuis(texte: string, nomFichier: string, type: TypeDocument): Piece | null {
  if (type === "facture" || CATEGORIES_CLIENT.includes(type as Categorie)) return null;
  const regles: [Piece, RegExp][] = [
    ["registre_commerce", /registre (du |de )?commerce|extrait du registre|\bcnrc\b|\brc\b/],
    ["casnos", /\bcasnos\b/],
    ["cnas", /\bcnas\b/],
    ["extrait_role", /extrait de role|\brole\b/],
    ["article_imposition", /article d'imposition|\barticle\b.*\bimposition\b|\bai\b/],
    ["nis", /identification statistique|\bnis\b/],
    ["nif", /identification fiscale|\bnif\b/],
    ["rib", /releve d'identite bancaire|\brib\b/],
    ["statuts", /\bstatuts?\b/],
  ];
  const f = normaliser(nomFichier).replace(/[_.-]+/g, " ");
  for (const [piece, re] of regles) if (re.test(f)) return piece;
  // Dans le texte, les mentions « NIF », « RC » ou « NIS » d'un en-tête ne suffisent pas : intitulés seulement
  const intitules: [Piece, RegExp][] = [
    ["registre_commerce", /extrait du registre (du |de )?commerce/],
    ["casnos", /\bcasnos\b/],
    ["cnas", /\bcnas\b/],
    ["extrait_role", /extrait de role/],
    ["article_imposition", /article d'imposition/],
    ["nis", /avis d'identification statistique|numero d'identification statistique/],
    ["nif", /carte d'identification fiscale|attestation d'identification fiscale|numero d'identification fiscale/],
    ["rib", /releve d'identite bancaire/],
    ["statuts", /^statuts\b|\bstatuts de la (sarl|eurl|spa)/m],
  ];
  for (const [piece, re] of intitules) if (re.test(texte)) return piece;
  return null;
}

export type ClientConnu = { id: string; nom: string; raison_sociale?: string | null; raison_sociale_facture?: string | null; rc?: string | null; nif?: string | null };
/** Identité de CTA, pour ne pas la prendre pour le client. */
export type Soi = { raison_sociale?: string | null; rc?: string | null; nif?: string | null };

export type Detection = {
  type: TypeDocument;
  titre: string;
  client: { id: string } | { nouveau: { nom: string; rc: string | null; nif: string | null; adresse: string | null } } | null;
  date: string | null; // aaaa-mm-jj : émission (facture) ou date du document
  facture: { numero: number | null; annee: number | null; mois: string | null; ht: number | null; tva: number | null; ttc: number | null } | null;
  texte: boolean; // false : aucun texte lisible (scan, image)
  piece: Piece | null; // pièce du dossier légal de CTA reconnue
};

export const normaliser = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const MOIS = ["janvier", "fevrier", "mars", "avril", "mai", "juin", "juillet", "aout", "septembre", "octobre", "novembre", "decembre"];
const FORMES = /\b(sarl|eurl|spa|sas|snc|sasu|ets|etablissements?|entreprise|groupe|societe|bank|banque|company|ltd|inc|llc)\b/;

/** « 160,000.00 », « 109 730,77 », « 109.730,77 » ou « 80000 » → nombre. */
export function lireMontant(brut: string): number | null {
  const s = brut.replace(/[\s  ]/g, "");
  if (!/^\d[\d.,]*$/.test(s)) return null;
  const virgule = s.lastIndexOf(",");
  const point = s.lastIndexOf(".");
  let n: string;
  if (virgule >= 0 && point >= 0) n = virgule > point ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (virgule >= 0) n = /,\d{1,2}$/.test(s) && s.split(",").length === 2 ? s.replace(",", ".") : s.replace(/,/g, "");
  else if (point >= 0) n = /\.\d{1,2}$/.test(s) && s.split(".").length === 2 ? s : s.replace(/\./g, "");
  else n = s;
  const v = Number(n);
  return Number.isFinite(v) ? Math.round(v * 100) / 100 : null;
}

/** Dernier montant d'une ligne (les montants sont à droite de leur libellé). */
function dernierMontant(ligne: string): number | null {
  const trouves = ligne.match(/\d{1,3}(?:[\s  .,]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?/g);
  if (!trouves) return null;
  for (let i = trouves.length - 1; i >= 0; i--) {
    const v = lireMontant(trouves[i]!);
    // « TVA 19% » : on ignore le taux
    if (v !== null && !new RegExp(`${trouves[i]!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*%`).test(ligne)) return v;
  }
  return null;
}

function dateIso(j: string, m: string, a: string): string | null {
  const annee = a.length === 2 ? 2000 + Number(a) : Number(a);
  const iso = `${annee}-${m.padStart(2, "0")}-${j.padStart(2, "0")}`;
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso || annee < 2000 || annee > 2100 ? null : iso;
}

const DATE_RE = /\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})\b/;

function typeDepuis(t: string, nomFichier: string): TypeDocument {
  const f = normaliser(nomFichier);
  const tout = `${f} ${t}`;
  if (/facture\s*n|^facture|\bfacture\b.*\btotal\s*(ht|ttc)|\bfact[-_ ]?\d/.test(tout) || (/\bfacture\b/.test(f) && !/\bproforma\b/.test(f))) return "facture";
  if (/accord de (non[- ]divulgation|confidentialite)|engagement de confidentialite|non[- ]?disclosure|\bnda\b|clause de confidentialite/.test(tout)) return "nda";
  if (/bon de commande|purchase order|\bbc\s*n/.test(tout)) return "bon_commande";
  if (/registre (du |de )?commerce|extrait du registre|\bcnrc\b/.test(tout)) return "registre_commerce";
  if (/\bstatuts?\b.*(capital|associes|gerance)|proces[- ]verbal|\bpv\b.*assemblee|assemblee generale/.test(tout)) return "statuts";
  if (/\bcnas\b|\bcasnos\b|securite sociale/.test(tout)) return "social";
  if (/\bbilan\b|\bg50\b|tableau des comptes|compte de resultat|declaration (annuelle|mensuelle)/.test(tout)) return "bilan";
  if (/\bnif\b|\bnis\b|article d'imposition|attestation fiscale|extrait de role|impots/.test(f) || /attestation (de )?(situation )?fiscale|extrait de role|identification fiscale|numero d'identification statistique/.test(t)) return "fiscal";
  if (/releve d'identite bancaire|\brib\b|releve bancaire|releve de compte/.test(f) || /releve d'identite bancaire|releve de compte/.test(t)) return "banque";
  if (/\bcontrat\b|\bconvention\b|\bavenant\b|contract|agreement/.test(tout)) return "contrat";
  return "autre";
}

const sansSoi = (soi: Soi) => {
  const nom = soi.raison_sociale ? normaliser(soi.raison_sociale) : "";
  return (ligne: string) => {
    const n = normaliser(ligne);
    return !(nom && n.includes(nom)) && !/central test/.test(n);
  };
};

const valeurApres = (ligne: string, cle: RegExp) => ligne.match(cle)?.[1]?.trim() ?? null;
const RC_RE = /\bR\.?\s?C\.?\s*(?:N[°o]\s*)?:?\s*(\d{2}\s*\/\s*\d{2}\s*-?\s*\d{5,8}\s*[A-Z]?\s*\d{0,2})/i;
const NIF_RE = /\bN\.?\s?I\.?\s?F\.?\s*(?:N[°o]\s*)?:?\s*(\d{12,20})/i;

/** Client : un client connu cité dans le texte, sinon la raison sociale trouvée (hors CTA), avec son RC et son NIF. */
function clientDepuis(lignes: string[], texte: string, clients: ClientConnu[], soi: Soi): Detection["client"] {
  let meilleur: { id: string; longueur: number } | null = null;
  for (const c of clients)
    for (const nom of [c.nom, c.raison_sociale, c.raison_sociale_facture]) {
      const n = nom ? normaliser(nom) : "";
      if (n.length >= 3 && new RegExp(`(^|[^a-z0-9])${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z0-9]|$)`).test(texte) && (!meilleur || n.length > meilleur.longueur)) meilleur = { id: c.id, longueur: n.length };
    }
  for (const c of clients) {
    const rc = c.rc && normaliser(c.rc).replace(/\s/g, "");
    const nif = c.nif && c.nif.replace(/\s/g, "");
    if (!meilleur && ((rc && rc.length > 6 && texte.replace(/\s/g, "").includes(rc)) || (nif && nif.length > 8 && texte.replace(/\s/g, "").includes(nif)))) meilleur = { id: c.id, longueur: 0 };
  }
  if (meilleur) return { id: meilleur.id };

  const pasSoi = sansSoi(soi);
  // Ligne avec une forme juridique (SARL, EURL, SPA…), qui n'est pas CTA, en début de ligne de préférence
  // Les lignes « libellé : valeur » (Domiciliation bancaire : …, Siège social : …) ne sont pas des raisons sociales
  const libelle = (n: string) => /^[a-z' .]{2,30}:/.test(n) && !/^(client|doit|destinataire|entre|et|a l'attention de)\b/.test(n);
  const i = lignes.findIndex((l) => {
    const n = normaliser(l);
    return pasSoi(l) && FORMES.test(n) && !libelle(n) && l.length <= 90;
  });
  if (i < 0) return null;
  let nom = lignes[i]!.replace(/^(entre|et|client|doit|a l'attention de|destinataire)\s*:?\s*/i, "").replace(/\s*[,;:]?\s*(ci-apres|represente|dont le siege).*$/i, "").trim();
  // Colonne de droite mêlée à la ligne : on garde le segment qui porte la forme juridique
  if (nom.length > 70) nom = nom.split(/\s{2,}| - /).find((s) => FORMES.test(normaliser(s))) ?? nom.slice(0, 70);
  const suite = lignes.slice(i + 1, i + 8);
  const rcSoi = soi.rc?.replace(/\s/g, "");
  const nifSoi = soi.nif?.replace(/\s/g, "");
  const rc = suite.map((l) => valeurApres(l, RC_RE)).find((v) => v && v.replace(/\s/g, "") !== rcSoi) ?? null;
  const nif = suite.map((l) => valeurApres(l, NIF_RE)).find((v) => v && v.replace(/\s/g, "") !== nifSoi) ?? null;
  const adresse = suite.find((l) => /^(siege social|adresse)\s*:/i.test(l))?.replace(/^(siege social|siège social|adresse)\s*:\s*/i, "").trim() || null;
  return { nouveau: { nom, rc, nif, adresse } };
}

function facture(lignes: string[], t: string): NonNullable<Detection["facture"]> & { date: string | null } {
  const num = t.match(/facture\s*n[°o]?\s*:?\s*(\d{1,4})\s*[-/]\s*(\d{4}|\d{2})\b/);
  const numero = num ? Number(num[1]) : null;
  const annee = num ? (num[2]!.length === 2 ? 2000 + Number(num[2]) : Number(num[2])) : null;
  const le = t.match(/\ble\s*:?\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4}|\d{2})\b/) ?? t.match(DATE_RE);
  const date = le ? dateIso(le[1]!, le[2]!, le[3]!) : null;
  // Période facturée : « du 01/04/2026 au 30/04/2026 », « 01/04/2026 au 30/04/2026 » ou « avril 2026 »
  const periode = t.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\s*(?:au|-|a)\s*\d{1,2}[/.-]\d{1,2}[/.-]\d{4}/);
  const nomMois = t.match(new RegExp(`\\b(${MOIS.join("|")})\\s+(\\d{4})\\b`));
  const mois = periode ? `${periode[3]}-${periode[2]!.padStart(2, "0")}` : nomMois ? `${nomMois[2]}-${String(MOIS.indexOf(nomMois[1]!) + 1).padStart(2, "0")}` : date ? date.slice(0, 7) : null;
  const ligne = (re: RegExp) => lignes.find((l) => re.test(normaliser(l)));
  const montant = (re: RegExp) => {
    const l = ligne(re);
    return l ? dernierMontant(l) : null;
  };
  const ht = montant(/total\s*h\.?\s*t\.?|montant\s*h\.?\s*t\.?|\bhors taxes?\b/);
  let ttc = montant(/total\s*t\.?\s*t\.?\s*c\.?|net\s*a\s*payer|montant\s*t\.?\s*t\.?\s*c/);
  let tva = montant(/^(montant\s*)?t\.?\s*v\.?\s*a\b|\btva\s*\d/);
  if (ht !== null && ttc !== null && tva === null) tva = Math.round((ttc - ht) * 100) / 100;
  if (ht !== null && tva !== null && ttc === null) ttc = Math.round((ht + tva) * 100) / 100;
  return { numero, annee: annee ?? (date ? Number(date.slice(0, 4)) : null), mois, ht, tva, ttc, date };
}

/** Détection à partir des lignes de texte (voir lecture-pdf) et du nom du fichier. */
export function detecter(lignes: string[], nomFichier: string, clients: ClientConnu[], soi: Soi = {}): Detection {
  const texte = normaliser(lignes.join("\n"));
  const detecte = typeDepuis(texte, nomFichier);
  const piece = pieceDepuis(texte, nomFichier, detecte);
  // Une pièce du dossier légal fixe le type (« Statuts CTA.pdf » sans texte : statuts, pas « autre »)
  const type: TypeDocument = piece ? PIECE[piece].categorie : detecte;
  const base = nomFichier.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim();
  const client = type === "facture" || CATEGORIES_CLIENT.includes(type as Categorie) ? clientDepuis(lignes, texte, clients, soi) : null;
  if (type === "facture") {
    const { date, ...f } = facture(lignes, texte);
    return { type, titre: f.numero && f.annee ? `Facture ${String(f.numero).padStart(3, "0")}-${String(f.annee).slice(2)}` : base, client, date, facture: f, texte: lignes.length > 0, piece: null };
  }
  const d = texte.match(/\b(?:le|en date du|date)\s*:?\s*(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/) ?? texte.match(DATE_RE);
  return { type, titre: base || "Document", client, date: d ? dateIso(d[1]!, d[2]!, d[3]!) : null, facture: null, texte: lignes.length > 0, piece };
}
