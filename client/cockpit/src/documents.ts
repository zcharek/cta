// Téléchargement des PDF générés dans le navigateur (bulletins de paie, attestation et certificat de travail).
import type { DonneesFacture } from "../../../shared/facture";
import type { DonneesDocumentRh } from "../../../shared/documents-rh";
import type { DonneesBulletin } from "../../../shared/paie";
import { api } from "./api";

export function telechargerPdf(octets: Uint8Array, nom: string) {
  const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Logo CTA seul, sans « Central Test Agency ». */
const logo = () =>
  fetch("/images/logo-cta-icone.png")
    .then((r) => (r.ok ? r.arrayBuffer() : null))
    .then((b) => (b ? new Uint8Array(b) : undefined))
    .catch(() => undefined);

/** Tampon et signature de CTA, apposés sur les documents émis (pas sur les aperçus). */
let cachetEnCours: Promise<Uint8Array | undefined> | null = null;
const cachet = () =>
  (cachetEnCours ??= api<{ png: string | null }>("cachet")
    .then((r) => (r.png ? Uint8Array.from(atob(r.png), (c) => c.charCodeAt(0)) : undefined))
    .catch(() => {
      cachetEnCours = null;
      return undefined;
    }));

/** Bulletin de paie ; `apercu` : sans tampon ni signature. */
export async function telechargerBulletin(donnees: DonneesBulletin, apercu = false) {
  const [pdf, image, tampon] = await Promise.all([import("../../../shared/paie"), logo(), apercu ? undefined : cachet()]);
  telechargerPdf(await pdf.genererBulletin(donnees, image, tampon), pdf.nomFichierBulletin(donnees));
}

/** Facture ; `apercu` : sans tampon ni signature. */
export async function telechargerFacture(donnees: DonneesFacture, apercu = false) {
  const [pdf, image, tampon] = await Promise.all([import("../../../shared/facture"), logo(), apercu ? undefined : cachet()]);
  telechargerPdf(await pdf.genererFacture(donnees, image, tampon), pdf.nomFichierFacture(donnees));
}

export async function telechargerDocumentRh(donnees: DonneesDocumentRh) {
  const [pdf, image, tampon] = await Promise.all([import("../../../shared/documents-rh"), logo(), cachet()]);
  telechargerPdf(await pdf.genererDocumentRh(donnees, image, tampon), pdf.nomFichierDocumentRh(donnees));
}
