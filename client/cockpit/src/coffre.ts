// Coffre de documents, côté navigateur : lecture du texte des PDF, envoi direct au store privé, ouverture par lien signé.
import { api } from "./api";

const PAR_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

export const ACCEPT = Object.keys(PAR_EXTENSION)
  .map((e) => `.${e}`)
  .join(",");

/** Type du fichier (certains navigateurs le laissent vide pour Word ou Excel). */
export const typeDe = (f: File) => f.type || PAR_EXTENSION[f.name.split(".").pop()?.toLowerCase() ?? ""] || "application/octet-stream";

/** Lignes de texte d'un PDF ; vide pour un scan, une image ou un autre format. */
export async function lireTexte(f: File): Promise<string[]> {
  if (typeDe(f) !== "application/pdf") return [];
  try {
    const [pdfjs, worker, { lignesPdf }] = await Promise.all([import("pdfjs-dist"), import("pdfjs-dist/build/pdf.worker.min.mjs?url"), import("../../../shared/lecture-pdf")]);
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    return await lignesPdf(pdfjs as never, new Uint8Array(await f.arrayBuffer()));
  } catch {
    return [];
  }
}

/** Envoie le fichier au store privé (directement, sans passer par l'API) et renvoie son chemin. */
export async function envoyerFichier(usage: "documents" | "factures", f: File, progression?: (pourcent: number) => void): Promise<string> {
  const type = typeDe(f);
  const { chemin, jeton } = await api<{ chemin: string; jeton: string }>("coffre/jeton", { corps: { usage, nom: f.name, type, taille: f.size } });
  if (jeton.startsWith("demo:")) {
    // Serveur de démonstration : stockage en mémoire
    const r = await fetch(`/__demo-stockage/${chemin}`, { method: "PUT", body: f, headers: { "content-type": type } });
    if (!r.ok) throw new Error("Envoi du fichier impossible.");
    return chemin;
  }
  const { put } = await import("@vercel/blob/client");
  await put(chemin, f, { access: "private", token: jeton, contentType: type, multipart: f.size > 8 * 1024 * 1024, onUploadProgress: progression ? (e) => progression(e.percentage) : undefined });
  return chemin;
}

/** Ouvre un fichier par son lien signé, dans un nouvel onglet (ouvert tout de suite pour ne pas être bloqué). */
export async function ouvrirFichier(routeLien: string) {
  const fenetre = window.open("", "_blank");
  try {
    const lien = new URL((await api<{ lien: string }>(routeLien)).lien, window.location.origin).href;
    if (fenetre) fenetre.location.href = lien;
    else window.location.href = lien;
  } catch (e) {
    fenetre?.close();
    throw e;
  }
}
