// Bulletin de paie : calcul du brut à partir du net (sécurité sociale 9 %, IRG barème 2022) et PDF aux couleurs CTA.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { SITUATIONS } from "./cockpit.js";

// ——— Calcul ———

export const TAUX_SS = 9; // retenue salariale de sécurité sociale (%)
export const JOURS_BASE = 26; // jours de référence du salaire de base

const arrondi2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * IRG mensuel sur salaire (barème 2022) : revenu imposable arrondi à la dizaine inférieure,
 * 0 % jusqu'à 20 000, 23 % jusqu'à 40 000, 27 % jusqu'à 80 000, 30 % jusqu'à 160 000, 33 % jusqu'à 320 000, 35 % au-delà ;
 * abattement de 40 % (entre 1 000 et 1 500 DA) ; exonération jusqu'à 30 000 et lissage entre 30 000 et 35 000.
 */
export function irgMensuel(imposable: number): number {
  const r = Math.floor(imposable / 10) * 10;
  if (r <= 30000) return 0;
  const tranches: [number, number][] = [
    [20000, 0],
    [40000, 0.23],
    [80000, 0.27],
    [160000, 0.3],
    [320000, 0.33],
    [Infinity, 0.35],
  ];
  let brut = 0;
  let bas = 0;
  for (const [haut, taux] of tranches) {
    if (r > bas) brut += (Math.min(r, haut) - bas) * taux;
    bas = haut;
  }
  let irg = brut - Math.min(1500, Math.max(1000, brut * 0.4));
  if (r < 35000) irg = irg * (137 / 51) - 27925 / 8;
  return Math.max(0, Math.round(irg * 100) / 100);
}

export type Paie = { brut: number; retenueSs: number; imposable: number; irg: number; net: number };

export function paieDepuisBrut(brut: number): Paie {
  const b = arrondi2(brut);
  const retenueSs = arrondi2((b * TAUX_SS) / 100);
  const imposable = arrondi2(b - retenueSs);
  const irg = irgMensuel(imposable);
  return { brut: b, retenueSs, imposable, irg, net: arrondi2(b - retenueSs - irg) };
}

/** Plus petit brut (au centime) qui donne au moins le net voulu : 80 000,00 net → 109 730,77 brut. */
export function paieDepuisNet(net: number): Paie {
  let bas = Math.round(net * 100);
  let haut = Math.round(net * 200) + 100_000;
  while (bas < haut) {
    const milieu = Math.floor((bas + haut) / 2);
    if (paieDepuisBrut(milieu / 100).net >= net) haut = milieu;
    else bas = milieu + 1;
  }
  return paieDepuisBrut(bas / 100);
}

// ——— Données imprimées ———

export { SITUATIONS };

export type DonneesBulletin = {
  mois: string; // aaaa-mm
  entreprise: { raison_sociale: string; siege: string; numero_adherent: string };
  salarie: {
    matricule: string;
    nom: string;
    situation_familiale: string | null;
    fonction: string;
    affectation: string | null;
    date_entree: string | null; // aaaa-mm-jj
    numero_ss: string | null;
    numero_compte: string | null;
  };
  paie: Paie;
};

const MOIS = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
export const moisBulletin = (mois: string) => `${MOIS[Number(mois.slice(5, 7)) - 1]} ${mois.slice(0, 4)}`;

/** « 109 730,77 » */
export function montantPaie(n: number): string {
  const [e, d] = arrondi2(n).toFixed(2).split(".");
  return `${e!.replace(/\B(?=(\d{3})+(?!\d))/g, " ")},${d}`;
}

export function nomFichierBulletin(d: DonneesBulletin): string {
  const nom = d.salarie.nom.normalize("NFD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `Bulletin_${d.mois}_${nom || d.salarie.matricule}.pdf`;
}

// ——— PDF ———

const MARINE = rgb(7 / 255, 21 / 255, 56 / 255);
const ORANGE = rgb(220 / 255, 90 / 255, 46 / 255);
const GRIS = rgb(0.36, 0.4, 0.51);
const FILET = rgb(0.84, 0.86, 0.9);
const FOND = rgb(0.965, 0.97, 0.98);
const BLANC = rgb(1, 1, 1);
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

class Dessin {
  constructor(
    readonly page: PDFPage,
    readonly normal: PDFFont,
    readonly gras: PDFFont,
  ) {}
  texte(t: string, x: number, y: number, taille: number, opts: { gras?: boolean; couleur?: ReturnType<typeof rgb> } = {}) {
    const f = opts.gras ? this.gras : this.normal;
    this.page.drawText(nettoyer(t, f), { x, y, size: taille, font: f, color: opts.couleur ?? MARINE });
  }
  largeur(t: string, taille: number, gras = false) {
    const f = gras ? this.gras : this.normal;
    return f.widthOfTextAtSize(nettoyer(t, f), taille);
  }
  droite(t: string, xDroit: number, y: number, taille: number, opts: { gras?: boolean; couleur?: ReturnType<typeof rgb> } = {}) {
    this.texte(t, xDroit - this.largeur(t, taille, opts.gras), y, taille, opts);
  }
  rect(x: number, yHaut: number, w: number, h: number, opts: { fond?: ReturnType<typeof rgb>; bord?: ReturnType<typeof rgb>; epaisseur?: number } = {}) {
    this.page.drawRectangle({
      x,
      y: yHaut - h,
      width: w,
      height: h,
      color: opts.fond,
      borderColor: opts.bord,
      borderWidth: opts.bord ? (opts.epaisseur ?? 0.8) : 0,
    });
  }
  /** Libellé en petites capitales grises, valeur dans un champ encadré. */
  champ(libelle: string, valeur: string, x: number, y: number, w: number) {
    this.texte(libelle.toUpperCase(), x, y + 4, 7, { gras: true, couleur: GRIS });
    this.rect(x, y, w, 20, { fond: FOND, bord: FILET });
    this.texte(valeur || "-", x + 7, y - 14, 10, { gras: true });
  }
}

/** Génère le bulletin. `logo` : PNG du logo CTA seul (sans texte, facultatif), en haut à gauche. */
export async function genererBulletin(d: DonneesBulletin, logo?: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Bulletin de paie ${moisBulletin(d.mois)} - ${d.salarie.nom}`);
  doc.setAuthor(d.entreprise.raison_sociale);
  doc.setCreator("Cockpit - Central Test Agency");
  const page = doc.addPage([A4.l, A4.h]);
  const g = new Dessin(page, await doc.embedFont(StandardFonts.Helvetica), await doc.embedFont(StandardFonts.HelveticaBold));
  const M = 44;
  const L = A4.l - 2 * M;
  let y = A4.h - 46;

  // En-tête : logo, raison sociale, adresse, N° adhérent
  let xTexte = M;
  if (logo) {
    const img = await doc.embedPng(logo);
    const h = 46;
    const w = (img.width / img.height) * h;
    page.drawImage(img, { x: M, y: y - h + 6, width: w, height: h });
    xTexte = M + w + 18;
  }
  g.texte(d.entreprise.raison_sociale, xTexte, y - 8, 15, { gras: true });
  g.texte(d.entreprise.siege.toUpperCase(), xTexte, y - 23, 8.5, { couleur: GRIS });
  g.texte("N° ADHÉRENT", xTexte, y - 36, 8.5, { gras: true, couleur: GRIS });
  g.texte(d.entreprise.numero_adherent, xTexte + g.largeur("N° ADHÉRENT", 8.5, true) + 8, y - 36, 9.5, { gras: true });
  y -= 62;

  // Bandeau
  g.rect(M, y, L, 30, { fond: MARINE });
  page.drawRectangle({ x: M, y: y - 33, width: L, height: 3, color: ORANGE });
  g.texte("BULLETIN DE PAIE", M + 14, y - 20, 13, { gras: true, couleur: BLANC });
  g.droite(moisBulletin(d.mois), M + L - 14, y - 20, 13, { gras: true, couleur: BLANC });
  y -= 60;

  // Salarié
  const s = d.salarie;
  const col = (L - 24) / 3;
  g.champ("Matricule", s.matricule, M, y, col * 0.6);
  g.champ("Nom", s.nom.toUpperCase(), M + col * 0.6 + 12, y, L - col * 0.6 - 12);
  y -= 42;
  g.champ("Fonction", s.fonction.toUpperCase(), M, y, col * 2 + 12);
  g.champ("Date d'entrée", s.date_entree ? s.date_entree.split("-").reverse().join("/") : "", M + col * 2 + 24, y, col);
  y -= 42;
  g.champ("Affectation", (s.affectation ?? "").toUpperCase(), M, y, col * 2 + 12);
  g.champ("Situation familiale", s.situation_familiale ? `${s.situation_familiale} - ${SITUATIONS[s.situation_familiale] ?? ""}` : "", M + col * 2 + 24, y, col);
  y -= 42;
  g.champ("N° sécurité sociale", s.numero_ss ?? "", M, y, col);
  g.champ("N° de compte", s.numero_compte ?? "", M + col + 12, y, col * 2 + 12);
  y -= 40;

  // Lignes de paie
  const p = d.paie;
  const cols = [0.09, 0.33, 0.14, 0.1, 0.17, 0.17].map((x) => x * L);
  const entetes = ["CODE", "LIBELLÉ", "N/BASE", "TAUX", "GAIN", "RETENUE"];
  const hEntete = 22;
  g.rect(M, y, L, hEntete, { fond: MARINE });
  let x = M;
  entetes.forEach((t, i) => {
    if (i <= 1) g.texte(t, x + 8, y - 14.5, 8.5, { gras: true, couleur: BLANC });
    else g.droite(t, x + cols[i]! - 8, y - 14.5, 8.5, { gras: true, couleur: BLANC });
    x += cols[i]!;
  });
  y -= hEntete;
  const lignes: [string, string, string, string, string, string][] = [
    ["R030", "SALAIRE DE BASE", montantPaie(JOURS_BASE), montantPaie(0), montantPaie(p.brut), ""],
    ["R510", "RETENUE SÉCU. SOCIALE", montantPaie(p.brut), montantPaie(TAUX_SS), "", montantPaie(p.retenueSs)],
    ["R660", "RETENUE IRG", montantPaie(Math.floor(p.imposable / 10) * 10), "Barème", "", montantPaie(p.irg)],
  ];
  const hCorps = 300;
  g.rect(M, y, L, hCorps, { bord: FILET });
  x = M;
  for (const w of cols.slice(0, -1)) {
    x += w;
    page.drawLine({ start: { x, y }, end: { x, y: y - hCorps }, thickness: 0.6, color: FILET });
  }
  let yl = y - 18;
  for (const l of lignes) {
    x = M;
    l.forEach((t, i) => {
      if (i <= 1) g.texte(t, x + 8, yl, 9.5, { gras: i === 0 });
      else if (t) g.droite(t, x + cols[i]! - 8, yl, 9.5, { gras: i >= 4 });
      x += cols[i]!;
    });
    yl -= 18;
  }
  y -= hCorps;

  // Totaux et net à payer
  const xGain = M + cols[0]! + cols[1]! + cols[2]! + cols[3]!;
  g.rect(M, y, L, 24, { fond: FOND, bord: FILET });
  g.droite("TOTAL", xGain - 8, y - 16, 9.5, { gras: true });
  g.droite(montantPaie(p.brut), xGain + cols[4]! - 8, y - 16, 10, { gras: true });
  g.droite(montantPaie(p.retenueSs + p.irg), M + L - 8, y - 16, 10, { gras: true });
  y -= 40;
  const wNet = cols[4]! + cols[5]!;
  g.droite("NET À PAYER", M + L - wNet - 14, y - 19, 12, { gras: true });
  g.rect(M + L - wNet, y, wNet, 30, { fond: MARINE });
  page.drawRectangle({ x: M + L - wNet, y: y - 30, width: 4, height: 30, color: ORANGE });
  g.droite(`${montantPaie(p.net)} DA`, M + L - 12, y - 20, 14, { gras: true, couleur: BLANC });
  y -= 64;

  // Signature
  g.texte("Cachet et signature de l'employeur", M + L / 2 - 90, y, 9, { gras: true, couleur: GRIS });

  // Pied de page
  page.drawLine({ start: { x: M, y: 46 }, end: { x: M + L, y: 46 }, thickness: 0.6, color: FILET });
  g.texte([d.entreprise.raison_sociale, d.entreprise.siege].filter(Boolean).join(" - "), M, 34, 7.5, { couleur: GRIS });
  g.droite("Document confidentiel", M + L, 34, 7.5, { couleur: GRIS });

  return doc.save();
}
