// Téléchargement des PDF générés dans le navigateur (bulletins de paie, attestation et certificat de travail).
import type { DonneesDocumentRh } from "../../../shared/documents-rh";
import type { DonneesBulletin } from "../../../shared/paie";

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

export async function telechargerBulletin(donnees: DonneesBulletin) {
  const [pdf, image] = await Promise.all([import("../../../shared/paie"), logo()]);
  telechargerPdf(await pdf.genererBulletin(donnees, image), pdf.nomFichierBulletin(donnees));
}

export async function telechargerDocumentRh(donnees: DonneesDocumentRh) {
  const [pdf, image] = await Promise.all([import("../../../shared/documents-rh"), logo()]);
  telechargerPdf(await pdf.genererDocumentRh(donnees, image), pdf.nomFichierDocumentRh(donnees));
}
