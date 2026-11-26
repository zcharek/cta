// Timesheet mensuel au format du modèle transmis par AEBS : génération PDF (pdf-lib), dans le navigateur.
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export type DonneesTimesheet = {
  mois: string; // aaaa-mm
  debut: string; // aaaa-mm-jj
  fin: string;
  prestataire: { nom: string; adresse: string };
  client: {
    nom: string;
    adresse: string | null;
    numero_contrat: string | null;
    mission: string | null;
    tjm_dzd: number;
    forfait_mensuel_dzd: number | null;
    jours_forfait: number;
  };
  consultants: { nom: string; jours: number }[];
};

/** « 160.000,00 » : séparateur de milliers « . », virgule décimale, comme sur le modèle. */
export function montantFr(n: number): string {
  const [entiers, decimales] = (Math.round(n * 100) / 100).toFixed(2).split(".");
  return `${entiers!.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${decimales}`;
}

/** Taux journalier à 2 décimales, tronqué comme sur le modèle (160 000 / 22 = 7272,72). */
export function tauxJournalier(c: DonneesTimesheet["client"]): number {
  const brut = c.forfait_mensuel_dzd ? c.forfait_mensuel_dzd / c.jours_forfait : c.tjm_dzd;
  return Math.floor(brut * 100 + 1e-9) / 100;
}

export const joursFr = (n: number) => String(Math.round(n * 100) / 100).replace(".", ",");
const dateFr = (iso: string) => iso.split("-").reverse().join("/");
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
export const periodeFr = (mois: string) => `Mois ${MOIS[Number(mois.slice(5, 7)) - 1]} ${mois.slice(0, 4)}`;

export function lignesRecapitulatif(d: DonneesTimesheet): string[] {
  const c = d.client;
  const taux = montantFr(tauxJournalier(c)).replace(/\./g, "");
  const tarif = c.forfait_mensuel_dzd
    ? `- Tarif journalier de référence : ${montantFr(c.forfait_mensuel_dzd)} DZD /${c.jours_forfait} jours, soit ${taux} DZD/Jour`
    : `- Tarif journalier de référence : ${taux} DZD/Jour`;
  const total = d.consultants.reduce((s, x) => s + x.jours, 0);
  return [tarif, `- Total jours facturables : ${joursFr(total)} Jours`];
}

export function nomFichier(d: DonneesTimesheet): string {
  const court = (d.client.nom.split(" - ").pop() ?? d.client.nom).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `Timesheet_${court || "client"}_${d.mois}.pdf`;
}

// ——— Mise en page ———

const NOIR = rgb(0, 0, 0);
const A4 = { l: 595.28, h: 841.89 };
const MARGE = 50;

/** Remplace les caractères que la police standard (WinAnsi) ne sait pas écrire. */
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

/** Coupe un texte en lignes tenant dans la largeur donnée (en respectant les retours à la ligne). */
function couper(texte: string, police: PDFFont, taille: number, largeur: number): string[] {
  const lignes: string[] = [];
  for (const paragraphe of texte.split("\n").map((p) => nettoyer(p, police))) {
    let ligne = "";
    for (const mot of paragraphe.split(/\s+/).filter(Boolean)) {
      const essai = ligne ? `${ligne} ${mot}` : mot;
      if (police.widthOfTextAtSize(essai, taille) <= largeur || !ligne) ligne = essai;
      else {
        lignes.push(ligne);
        ligne = mot;
      }
    }
    lignes.push(ligne);
  }
  return lignes;
}

type Bloc = { texte: string; gras?: boolean; taille?: number; centre?: boolean };

class Mise {
  y = A4.h - 60;
  constructor(
    private page: PDFPage,
    private normal: PDFFont,
    private gras: PDFFont,
  ) {}

  police = (b?: boolean) => (b ? this.gras : this.normal);

  titre(texte: string, taille: number, centre = true, avant = 0) {
    this.y -= avant;
    const p = this.gras;
    const t = nettoyer(texte, p);
    const x = centre ? (A4.l - p.widthOfTextAtSize(t, taille)) / 2 : MARGE;
    this.page.drawText(t, { x, y: this.y, size: taille, font: p, color: NOIR });
    this.y -= taille + 6;
  }

  /** Hauteur et lignes d'une cellule faite de plusieurs blocs. */
  private composer(blocs: Bloc[], largeur: number) {
    const rendu: { texte: string; police: PDFFont; taille: number; centre?: boolean }[] = [];
    for (const b of blocs) {
      const taille = b.taille ?? 11;
      for (const l of couper(b.texte, this.police(b.gras), taille, largeur)) rendu.push({ texte: l, police: this.police(b.gras), taille, centre: b.centre });
    }
    return rendu;
  }

  /** Ligne de tableau : cellules encadrées, hauteur ajustée au contenu le plus long. */
  ligne(colonnes: number[], cellules: Bloc[][], hauteurMin = 24) {
    const pad = 8;
    const rendus = cellules.map((blocs, i) => this.composer(blocs, colonnes[i]! - 2 * pad));
    const hauteur = Math.max(hauteurMin, ...rendus.map((r) => r.reduce((s, l) => s + l.taille * 1.25, 0) + 2 * pad - 2));
    let x = MARGE;
    rendus.forEach((r, i) => {
      const w = colonnes[i]!;
      this.page.drawRectangle({ x, y: this.y - hauteur, width: w, height: hauteur, borderColor: NOIR, borderWidth: 0.8 });
      let y = this.y - pad - (r[0]?.taille ?? 11) + 2;
      for (const l of r) {
        const tx = l.centre ? x + (w - l.police.widthOfTextAtSize(l.texte, l.taille)) / 2 : x + pad;
        this.page.drawText(l.texte, { x: tx, y, size: l.taille, font: l.police, color: NOIR });
        y -= l.taille * 1.25;
      }
      x += w;
    });
    this.y -= hauteur;
  }

  texte(texte: string, taille = 11, retrait = 0) {
    for (const l of couper(texte, this.normal, taille, A4.l - 2 * MARGE - retrait)) {
      this.page.drawText(l, { x: MARGE + retrait, y: this.y, size: taille, font: this.normal, color: NOIR });
      this.y -= taille * 1.35;
    }
  }
}

export async function genererTimesheet(d: DonneesTimesheet): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Timesheet ${periodeFr(d.mois)} - ${d.client.nom}`);
  doc.setAuthor(d.prestataire.nom);
  doc.setCreator("Cockpit - Central Test Agency");
  const page = doc.addPage([A4.l, A4.h]);
  const m = new Mise(page, await doc.embedFont(StandardFonts.Helvetica), await doc.embedFont(StandardFonts.HelveticaBold));
  const largeur = A4.l - 2 * MARGE;

  m.titre("Timesheet Mensuel", 11);
  m.titre("VALIDATION DU TIMESHEET MENSUEL", 13, true, 14);
  m.y += 2;

  const cles = [130, largeur - 130];
  m.ligne(cles, [[{ texte: "Client", gras: true, taille: 12 }], [{ texte: d.client.nom, gras: true, taille: 12 }, ...(d.client.adresse ? [{ texte: d.client.adresse }] : [])]]);
  m.ligne(cles, [[{ texte: "Prestataire", gras: true, taille: 12 }], [{ texte: d.prestataire.nom, gras: true, taille: 12 }, { texte: d.prestataire.adresse, gras: true }]]);
  m.ligne(cles, [[{ texte: "Contrat N°", gras: true, taille: 12 }], [{ texte: d.client.numero_contrat ?? "", gras: true, taille: 12 }]], 28);
  m.ligne(cles, [[{ texte: "Période", gras: true, taille: 12 }], [{ texte: periodeFr(d.mois), gras: true, taille: 12 }]], 28);

  m.titre("Détails des consultants affectés", 12, false, 26);
  m.y += 2;
  const cols = [largeur / 4, largeur / 4, largeur / 4, largeur / 4];
  m.ligne(cols, [[{ texte: "Nom du Consultant" }], [{ texte: "Projet/Mission" }], [{ texte: "Nombre de jours travaillés" }], [{ texte: "Observations" }]], 40);
  const periode = `Du ${dateFr(d.debut)}\nAu ${dateFr(d.fin)}`;
  for (const c of d.consultants)
    m.ligne(cols, [[{ texte: c.nom }], [{ texte: d.client.mission ?? "" }], [{ texte: joursFr(c.jours), centre: true }], [{ texte: periode, centre: true, taille: 10 }]], 54);
  if (d.consultants.length === 0) m.ligne([largeur], [[{ texte: "Aucun jour validé sur la période.", centre: true }]]);

  m.titre("Récapitulatif financier", 12, false, 34);
  m.y -= 28;
  for (const l of lignesRecapitulatif(d)) m.texte(l, 11, 12);

  return doc.save();
}
