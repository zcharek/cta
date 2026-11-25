// Attestation de travail et certificat de travail : textes et PDF aux couleurs CTA (pdf-lib, dans le navigateur).
import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";

export type TypeDocumentRh = "attestation" | "certificat";

export type DonneesDocumentRh = {
  type: TypeDocumentRh;
  date: string; // aaaa-mm-jj, date de délivrance
  entreprise: { raison_sociale: string; siege: string; rc?: string | null; nif?: string | null; ville?: string | null };
  salarie: {
    civilite: string | null; // M, Mme ou null
    nom: string;
    matricule: string;
    date_naissance: string;
    lieu_naissance: string;
    numero_ss: string | null;
    fonction: string;
    date_entree: string;
    date_sortie: string | null; // certificat uniquement
  };
};

export const TITRE_DOCUMENT: Record<TypeDocumentRh, string> = { attestation: "Attestation de travail", certificat: "Certificat de travail" };

const dateFr = (iso: string) => iso.split("-").reverse().join("/");

/** Accords selon la civilité ; forme épicène si elle n'est pas renseignée. */
function accords(civilite: string | null) {
  if (civilite === "M") return { civ: "Monsieur", e: "", il: "Il", interesse: "l'intéressé" };
  if (civilite === "Mme") return { civ: "Madame", e: "e", il: "Elle", interesse: "l'intéressée" };
  return { civ: "M. / Mme", e: "(e)", il: "Il / Elle", interesse: "l'intéressé(e)" };
}

/** « en qualité d'Ingénieur » / « en qualité de Testeur ». */
export const enQualiteDe = (poste: string) => `en qualité ${/^[aeiouyhàâéèêëîïôûAEIOUYHÀÂÉÈÊËÎÏÔÛ]/.test(poste) ? "d'" : "de "}${poste}`;

/** Paragraphes du document, dans l'ordre. */
export function paragraphesDocument(d: DonneesDocumentRh): string[] {
  const s = d.salarie;
  const a = accords(s.civilite);
  const qui = `${a.civ} ${s.nom.toUpperCase()}, né${a.e} le ${dateFr(s.date_naissance)} à ${s.lieu_naissance}${s.numero_ss ? `, immatriculé${a.e} à la sécurité sociale sous le n° ${s.numero_ss}` : ""}, matricule ${s.matricule},`;
  const nous = `Nous soussignés, ${d.entreprise.raison_sociale} (siège social : ${d.entreprise.siege}),`;
  if (d.type === "attestation") {
    return [
      `${nous} attestons par la présente que ${qui} est employé${a.e} au sein de notre société depuis le ${dateFr(s.date_entree)}, ${enQualiteDe(s.fonction)}, et ce jusqu'à ce jour.`,
      `La présente attestation est délivrée à ${a.interesse}, à sa demande, pour servir et valoir ce que de droit.`,
    ];
  }
  return [
    `${nous} certifions que ${qui} a été employé${a.e} au sein de notre société du ${dateFr(s.date_entree)} au ${dateFr(s.date_sortie!)}, ${enQualiteDe(s.fonction)}.`,
    `${a.il} nous quitte libre de tout engagement.`,
    `Le présent certificat est délivré à ${a.interesse} pour servir et valoir ce que de droit.`,
  ];
}

export function nomFichierDocumentRh(d: DonneesDocumentRh): string {
  const nom = d.salarie.nom.normalize("NFD").replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${d.type === "attestation" ? "Attestation" : "Certificat"}_de_travail_${nom || d.salarie.matricule}_${d.date}.pdf`;
}

// ——— PDF ———

const MARINE = rgb(7 / 255, 21 / 255, 56 / 255);
const ORANGE = rgb(220 / 255, 90 / 255, 46 / 255);
const GRIS = rgb(0.36, 0.4, 0.51);
const FILET = rgb(0.84, 0.86, 0.9);
const BLANC = rgb(1, 1, 1);
const A4 = { l: 595.28, h: 841.89 };

function nettoyer(texte: string, police: PDFFont): string {
  return [...texte]
    .map((ch) => {
      try {
        police.widthOfTextAtSize(ch, 10);
        return ch;
      } catch {
        return ch === "’" ? "'" : "?";
      }
    })
    .join("");
}

/** Coupe un texte en lignes d'au plus `largeur` points. */
function couper(texte: string, police: PDFFont, taille: number, largeur: number): string[] {
  const lignes: string[] = [];
  let ligne = "";
  for (const mot of texte.split(/\s+/)) {
    const essai = ligne ? `${ligne} ${mot}` : mot;
    if (ligne && police.widthOfTextAtSize(essai, taille) > largeur) {
      lignes.push(ligne);
      ligne = mot;
    } else ligne = essai;
  }
  if (ligne) lignes.push(ligne);
  return lignes;
}

/** Génère le document. `logo` : PNG du logo CTA seul (facultatif), en haut à gauche. */
export async function genererDocumentRh(d: DonneesDocumentRh, logo?: Uint8Array): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${TITRE_DOCUMENT[d.type]} - ${d.salarie.nom}`);
  doc.setAuthor(d.entreprise.raison_sociale);
  doc.setCreator("Cockpit - Central Test Agency");
  const page = doc.addPage([A4.l, A4.h]);
  const normal = await doc.embedFont(StandardFonts.Helvetica);
  const gras = await doc.embedFont(StandardFonts.HelveticaBold);
  const texte = (t: string, x: number, y: number, taille: number, opts: { gras?: boolean; couleur?: ReturnType<typeof rgb> } = {}) => {
    const f = opts.gras ? gras : normal;
    page.drawText(nettoyer(t, f), { x, y, size: taille, font: f, color: opts.couleur ?? MARINE });
  };
  const largeur = (t: string, taille: number, g = false) => (g ? gras : normal).widthOfTextAtSize(nettoyer(t, g ? gras : normal), taille);
  const M = 56;
  const L = A4.l - 2 * M;
  let y = A4.h - 52;

  // En-tête : logo, raison sociale, siège
  let xTexte = M;
  if (logo) {
    const img = await doc.embedPng(logo);
    const h = 46;
    const w = (img.width / img.height) * h;
    page.drawImage(img, { x: M, y: y - h + 6, width: w, height: h });
    xTexte = M + w + 18;
  }
  texte(d.entreprise.raison_sociale, xTexte, y - 8, 15, { gras: true });
  texte(d.entreprise.siege.toUpperCase(), xTexte, y - 23, 8.5, { couleur: GRIS });
  const ids = [d.entreprise.rc && `RC ${d.entreprise.rc}`, d.entreprise.nif && `NIF ${d.entreprise.nif}`].filter(Boolean).join("   ");
  if (ids) texte(ids, xTexte, y - 36, 8.5, { couleur: GRIS });
  y -= 100;

  // Titre
  const titre = TITRE_DOCUMENT[d.type].toUpperCase();
  page.drawRectangle({ x: M, y: y - 34, width: L, height: 34, color: MARINE });
  page.drawRectangle({ x: M, y: y - 37, width: L, height: 3, color: ORANGE });
  texte(titre, M + (L - largeur(titre, 15, true)) / 2, y - 22, 15, { gras: true, couleur: BLANC });
  y -= 90;

  // Corps
  const taille = 11.5;
  const interligne = 20;
  for (const p of paragraphesDocument(d)) {
    for (const l of couper(nettoyer(p, normal), normal, taille, L)) {
      texte(l, M, y, taille);
      y -= interligne;
    }
    y -= interligne * 0.6;
  }

  // Lieu, date et signature
  y -= 24;
  const faitA = `Fait à ${d.entreprise.ville || "Alger"}, le ${dateFr(d.date)}`;
  texte(faitA, M + L - largeur(faitA, 11), y, 11);
  y -= 40;
  const direction = "La Direction";
  texte(direction, M + L - 150 + (150 - largeur(direction, 11, true)) / 2, y, 11, { gras: true });
  const cachet = "Cachet et signature";
  texte(cachet, M + L - 150 + (150 - largeur(cachet, 9)) / 2, y - 15, 9, { couleur: GRIS });

  // Pied de page
  page.drawLine({ start: { x: M, y: 50 }, end: { x: M + L, y: 50 }, thickness: 0.6, color: FILET });
  texte([d.entreprise.raison_sociale, d.entreprise.siege].filter(Boolean).join(" - "), M, 38, 7.5, { couleur: GRIS });

  return doc.save();
}
