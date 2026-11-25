// Facture client au format du modèle CTA (logo en haut à gauche) : calculs, montant en lettres et PDF (pdf-lib).
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

// ——— Numérotation : « 011-26 » = 11e facture de 2026 ———

export const numeroFacture = (numero: number, annee: number) => `${String(numero).padStart(3, "0")}-${String(annee).slice(-2)}`;

/** « 011-26 » → { numero: 11, annee: 2026 } ; null si le format n'est pas reconnu. */
export function lireNumeroFacture(texte: string): { numero: number; annee: number } | null {
  const m = /^\s*(\d{1,4})\s*[-/]\s*(\d{2}|\d{4})\s*$/.exec(texte);
  if (!m || Number(m[1]) < 1) return null;
  return { numero: Number(m[1]), annee: m[2]!.length === 2 ? 2000 + Number(m[2]) : Number(m[2]) };
}

// ——— Calculs ———

const arrondi2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export type Tarif = { tjm_dzd: number; forfait_mensuel_dzd: number | null; jours_forfait: number };

/**
 * Au forfait : prix unitaire = forfait / jours de référence (tronqué au centime, comme sur le modèle : 7 272,72),
 * montant = forfait × jours / jours de référence (22 jours → 160 000,00 tout rond). Au TJM : TJM × jours.
 */
export function calculerFacture(t: Tarif, jours: number, tauxTva: number) {
  const pu = t.forfait_mensuel_dzd ? Math.floor((t.forfait_mensuel_dzd / t.jours_forfait) * 100 + 1e-9) / 100 : t.tjm_dzd;
  const ht = arrondi2(t.forfait_mensuel_dzd ? (t.forfait_mensuel_dzd * jours) / t.jours_forfait : t.tjm_dzd * jours);
  const tva = arrondi2((ht * tauxTva) / 100);
  return { pu, ht, tva, ttc: arrondi2(ht + tva) };
}

/** « 160,000.00 » : format des montants du modèle de facture. */
export function montantFacture(n: number): string {
  const [e, d] = arrondi2(n).toFixed(2).split(".");
  return `${e!.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${d}`;
}

// ——— Montant en lettres ———

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

function moinsDeCent(n: number, final: boolean): string {
  if (n < 20) return UNITES[n]!;
  const d = Math.floor(n / 10);
  let u = n % 10;
  if (d === 7 || d === 9) u += 10; // soixante-dix, quatre-vingt-dix…
  const base = DIZAINES[d]!;
  if (u === 0) return d === 8 && final ? "quatre-vingts" : base;
  if (u === 1 && d < 8) return `${base} et un`;
  if (u === 11 && d === 7) return `${base} et onze`;
  return `${base}-${UNITES[u]}`;
}

function moinsDeMille(n: number, final: boolean): string {
  const c = Math.floor(n / 100);
  const reste = n % 100;
  const centaines = c === 0 ? "" : c === 1 ? "cent" : `${UNITES[c]} cent${reste === 0 && final ? "s" : ""}`;
  if (!reste) return centaines;
  return [centaines, moinsDeCent(reste, final)].filter(Boolean).join(" ");
}

/** Nombre entier en toutes lettres (orthographe traditionnelle) : 190400 → « cent quatre-vingt-dix mille quatre cents ». */
export function enLettres(n: number): string {
  if (!Number.isInteger(n) || n < 0) throw new Error("Entier positif attendu");
  if (n === 0) return "zéro";
  const parties: string[] = [];
  const milliards = Math.floor(n / 1e9);
  const millions = Math.floor((n % 1e9) / 1e6);
  const milliers = Math.floor((n % 1e6) / 1000);
  const reste = n % 1000;
  if (milliards) parties.push(`${moinsDeMille(milliards, true)} milliard${milliards > 1 ? "s" : ""}`);
  if (millions) parties.push(`${moinsDeMille(millions, true)} million${millions > 1 ? "s" : ""}`);
  if (milliers) parties.push(milliers === 1 ? "mille" : `${moinsDeMille(milliers, false)} mille`);
  if (reste) parties.push(moinsDeMille(reste, true));
  return parties.join(" ");
}

/** « cent quatre-vingt-dix mille quatre cents dinars », avec les centimes s'il y en a. */
export function montantEnLettres(montant: number): string {
  const centimes = Math.round(arrondi2(montant) * 100);
  const dinars = Math.floor(centimes / 100);
  const c = centimes % 100;
  const texte = `${enLettres(dinars)} dinar${dinars > 1 ? "s" : ""}`;
  return c ? `${texte} et ${enLettres(c)} centime${c > 1 ? "s" : ""}` : texte;
}

// ——— Données imprimées (copie figée dans factures.donnees) ———

export type Entreprise = {
  raison_sociale: string;
  siege: string;
  rc: string;
  nif: string;
  nis: string;
  ai: string;
  rib: string;
  banque: string;
  email: string;
  ville: string;
};

export type DonneesFacture = {
  numero: string; // « 011-26 »
  date_emission: string; // aaaa-mm-jj
  entreprise: Entreprise;
  client: { raison_sociale: string; adresse: string | null; rc: string | null; nif: string | null };
  ligne: { designation: string; debut: string; fin: string; unite: string; quantite: number; pu: number; montant: number };
  tva_taux: number;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
};

const dateFr = (iso: string) => iso.split("-").reverse().join("/");
const quantite = (n: number) => String(Math.round(n * 10) / 10).replace(".", ",");

export function nomFichierFacture(d: DonneesFacture): string {
  const court = (d.client.raison_sociale.replace(/^SARL\s+|^SPA\s+|^EURL\s+/i, "").normalize("NFD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "client").slice(0, 40);
  return `Facture_${d.numero}_${court}.pdf`;
}

// ——— PDF ———

const NOIR = rgb(0, 0, 0);
const A4 = { l: 595.28, h: 841.89 };

function nettoyer(texte: string, police: PDFFont): string {
  return [...texte]
    .map((ch) => {
      try {
        police.widthOfTextAtSize(ch, 10);
        return ch;
      } catch {
        return "?";
      }
    })
    .join("");
}

function couper(texte: string, police: PDFFont, taille: number, largeur: number): string[] {
  const lignes: string[] = [];
  let ligne = "";
  for (const mot of nettoyer(texte, police).split(/\s+/).filter(Boolean)) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (police.widthOfTextAtSize(essai, taille) <= largeur || !ligne) ligne = essai;
    else {
      lignes.push(ligne);
      ligne = mot;
    }
  }
  if (ligne) lignes.push(ligne);
  return lignes;
}

class Dessin {
  constructor(
    readonly page: PDFPage,
    readonly normal: PDFFont,
    readonly gras: PDFFont,
    readonly italique: PDFFont,
  ) {}

  texte(t: string, x: number, y: number, taille: number, police = this.normal) {
    this.page.drawText(nettoyer(t, police), { x, y, size: taille, font: police, color: NOIR });
  }

  largeur = (t: string, taille: number, police = this.normal) => police.widthOfTextAtSize(nettoyer(t, police), taille);

  centre(t: string, x: number, w: number, y: number, taille: number, police = this.normal) {
    this.texte(t, x + (w - this.largeur(t, taille, police)) / 2, y, taille, police);
  }

  droite(t: string, xDroit: number, y: number, taille: number, police = this.normal) {
    this.texte(t, xDroit - this.largeur(t, taille, police), y, taille, police);
  }

  souligne(x: number, y: number, w: number) {
    this.page.drawLine({ start: { x, y: y - 1.5 }, end: { x: x + w, y: y - 1.5 }, thickness: 0.6, color: NOIR });
  }

  /** « Libellé : valeur », libellé en gras, le tout souligné comme sur le modèle. */
  champ(libelle: string, valeur: string, x: number, y: number, taille = 9.5) {
    const l = `${libelle} :`;
    this.texte(l, x, y, taille, this.gras);
    const wl = this.largeur(l, taille, this.gras);
    this.texte(` ${valeur}`, x + wl, y, taille);
    this.souligne(x, y, wl + this.largeur(` ${valeur}`, taille));
  }

  cadre(x: number, yHaut: number, w: number, h: number, epaisseur = 1) {
    this.page.drawRectangle({ x, y: yHaut - h, width: w, height: h, borderColor: NOIR, borderWidth: epaisseur });
  }
}

/**
 * Génère la facture. `logo` : PNG du logo CTA seul (sans texte, facultatif), placé en haut à gauche.
 * `cachet` : PNG du tampon et de la signature (facultatif), sous « L'Entreprise ».
 */
export async function genererFacture(d: DonneesFacture, logo?: Uint8Array, cachet?: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Facture ${d.numero} - ${d.client.raison_sociale}`);
  doc.setAuthor(d.entreprise.raison_sociale);
  doc.setCreator("Cockpit - Central Test Agency");
  const page = doc.addPage([A4.l, A4.h]);
  const g = new Dessin(
    page,
    await doc.embedFont(StandardFonts.Helvetica),
    await doc.embedFont(StandardFonts.HelveticaBold),
    await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  );
  const M = 56;
  let y = A4.h - 52;

  // En-tête : logo à gauche, raison sociale à côté
  if (logo) {
    const image = await doc.embedPng(logo);
    const h = 46;
    const w = (image.width / image.height) * h;
    page.drawImage(image, { x: M, y: y - h + 10, width: w, height: h });
    g.texte(d.entreprise.raison_sociale, M + w + 18, y - 14, 15, g.gras);
    y -= h + 14;
  } else {
    g.texte(d.entreprise.raison_sociale, M + 30, y - 6, 16, g.gras);
    y -= 34;
  }

  // Identité de l'entreprise (gauche) et numéro / date (droite)
  const e = d.entreprise;
  const champs: [string, string][] = [
    ["Siège social", e.siege],
    ["RC", e.rc],
    ["NIF", e.nif],
    ["NIS", e.nis],
    ["AI", e.ai],
    ["RIB", e.rib],
    ["Domiciliation Bancaire", e.banque],
    ["Email", e.email],
  ];
  const yIdentite = y;
  for (const [l, v] of champs.filter(([, v]) => v)) {
    g.champ(l, v, M, y);
    y -= 13;
  }
  g.texte(`FACTURE N°   ${d.numero}`, 370, yIdentite - 26, 10.5, g.gras);
  g.texte(`${e.ville}, le ${dateFr(d.date_emission)}`, 370, yIdentite - 41, 10.5, g.gras);

  // Client : toujours sous le numéro et la date, même si l'identité de l'entreprise tient en peu de lignes
  y = Math.min(y, yIdentite - 56) - 22;
  const xc = 300;
  g.texte(d.client.raison_sociale, xc + 4, y, 12.5, g.gras);
  y -= 17;
  if (d.client.adresse) {
    const lignes = couper(`Siège social :  ${d.client.adresse}`, g.normal, 9.5, A4.l - M - xc);
    lignes.forEach((l, i) => {
      if (i === 0) {
        g.texte("Siège social :", xc, y, 9.5, g.gras);
        const wl = g.largeur("Siège social :", 9.5, g.gras);
        g.texte(l.slice("Siège social :".length), xc + wl, y, 9.5);
        g.souligne(xc, y, g.largeur(l, 9.5));
      } else g.texte(l, xc, y, 9.5);
      y -= 13;
    });
  }
  if (d.client.rc) (g.champ("RC", d.client.rc, xc, y), (y -= 13));
  if (d.client.nif) (g.champ("NIF", d.client.nif, xc, y), (y -= 13));

  // Tableau des prestations
  y -= 58;
  const largeur = A4.l - 2 * M;
  const cols = [0.27, 0.245, 0.09, 0.07, 0.135, 0.19].map((p) => p * largeur); // somme = 1
  const entetes = ["DESIGNATIONS", "DATE", "UNITE", "QTE", "PU", "MONTANT"];
  const hEntete = 19;
  const hCorps = 104;
  let x = M;
  cols.forEach((w, i) => {
    g.cadre(x, y, w, hEntete);
    g.centre(entetes[i]!, x, w, y - 13.5, 9.5, g.italique);
    g.cadre(x, y - hEntete, w, hCorps);
    x += w;
  });
  const l = d.ligne;
  const valeurs = [l.designation, `${dateFr(l.debut)} au ${dateFr(l.fin)}`, l.unite, quantite(l.quantite), montantFacture(l.pu), montantFacture(l.montant)];
  x = M;
  const yLigne = y - hEntete - 14;
  valeurs.forEach((v, i) => {
    const w = cols[i]!;
    if (i === 5) g.droite(v, x + w - 4, yLigne, 10, g.gras);
    else if (i === 0) couper(v, g.gras, 9.5, w - 8).forEach((t, k) => g.centre(t, x, w, yLigne - k * 12, 9.5, g.gras));
    else g.centre(v, x, w, yLigne, i === 1 ? 8.8 : 10, g.gras);
    x += w;
  });

  // Totaux
  y -= hEntete + hCorps;
  const xTotaux = M + cols[0]! * 0.43;
  const wLibelle = M + largeur - cols[5]! - xTotaux;
  const totaux: [string, number][] = [
    ["TOTAL HT", d.montant_ht],
    [`TVA ${String(d.tva_taux).replace(".", ",")}%`, d.montant_tva],
    ["TOTAL TTC", d.montant_ttc],
  ];
  for (const [libelle, montant] of totaux) {
    g.cadre(xTotaux, y, wLibelle, 20);
    g.cadre(xTotaux + wLibelle, y, cols[5]!, 20);
    g.centre(libelle, xTotaux, wLibelle, y - 14, 9.5, g.gras);
    g.droite(montantFacture(montant), M + largeur - 4, y - 14, 10, g.gras);
    y -= 20;
  }

  // Montant en lettres
  y -= 28;
  const debut = "Arrêtée la présente facture à la somme de: ";
  const lettres = `${montantEnLettres(d.montant_ttc)} en toutes taxes comprises`;
  const premiere = largeur - g.largeur(debut, 10.5);
  const mots = couper(lettres, g.gras, 10.5, premiere);
  g.texte(debut, M, y, 10.5);
  g.texte(mots[0] ?? "", M + g.largeur(debut, 10.5), y, 10.5, g.gras);
  y -= 20;
  for (const t of couper(mots.slice(1).join(" "), g.gras, 10.5, largeur)) {
    g.texte(t, M, y, 10.5, g.gras);
    y -= 20;
  }

  // Signature
  y -= 32;
  const titre = "L'Entreprise";
  g.texte(titre, 420, y, 11, g.gras);
  g.souligne(420, y, g.largeur(titre, 11, g.gras));
  if (cachet) {
    const img = await doc.embedPng(cachet);
    const w = 150;
    const h = (img.height / img.width) * w;
    page.drawImage(img, { x: 420 + g.largeur(titre, 11, g.gras) / 2 - w / 2, y: Math.max(76, y - 10 - h), width: w, height: h });
  }

  // Filet de pied de page
  page.drawLine({ start: { x: M, y: 70 }, end: { x: A4.l - M, y: 70 }, thickness: 1.2, color: NOIR });

  return doc.save();
}
