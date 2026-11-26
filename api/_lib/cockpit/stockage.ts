// Stockage des fichiers (contrats, NDA, documents légaux, factures importées) dans Vercel Blob, store PRIVÉ :
// aucun fichier n'est lisible sans un lien signé de quelques minutes, délivré par Cockpit après vérification des droits.
// Le navigateur envoie le fichier directement au store avec un jeton limité à un seul chemin (pas de limite de 4,5 Mo).
import { HttpError } from "../web.js";

export type InfosFichier = { taille: number; type: string };

export interface Stockage {
  /** Jeton d'envoi valable 10 minutes pour ce seul chemin. */
  jetonEnvoi(chemin: string, type: string, tailleMax: number): Promise<string>;
  /** Fichier présent dans le store ? */
  infos(chemin: string): Promise<InfosFichier | null>;
  /** Lien de lecture signé, valable 5 minutes. */
  lienLecture(chemin: string): Promise<string>;
  supprimer(chemin: string): Promise<void>;
}

const blob: Stockage = {
  async jetonEnvoi(chemin, type, tailleMax) {
    const { generateClientTokenFromReadWriteToken } = await import("@vercel/blob/client");
    return generateClientTokenFromReadWriteToken({ pathname: chemin, allowedContentTypes: [type], maximumSizeInBytes: tailleMax, validUntil: Date.now() + 10 * 60_000, addRandomSuffix: false, allowOverwrite: false });
  },
  async infos(chemin) {
    const { head, BlobNotFoundError } = await import("@vercel/blob");
    try {
      const h = await head(chemin);
      return { taille: h.size, type: h.contentType };
    } catch (e) {
      if (e instanceof BlobNotFoundError) return null;
      throw e;
    }
  },
  async lienLecture(chemin) {
    const { issueSignedToken, presignUrl } = await import("@vercel/blob");
    const jeton = await issueSignedToken({ pathname: chemin, operations: ["get"], validUntil: Date.now() + 5 * 60_000 });
    return (await presignUrl(jeton, { operation: "get", pathname: chemin, access: "private" })).presignedUrl;
  },
  async supprimer(chemin) {
    const { del } = await import("@vercel/blob");
    await del(chemin);
  },
};

let courant: Stockage | null = null;

/** Tests : remplace Vercel Blob par un stockage en mémoire. */
export function definirStockage(s: Stockage | null) {
  courant = s;
}

export function stockage(): Stockage {
  if (courant) return courant;
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new HttpError(503, "Stockage des documents non configuré (BLOB_READ_WRITE_TOKEN).");
  return blob;
}

// ——— Règles communes aux envois ———

export const TAILLE_MAX = 25 * 1024 * 1024;

export const TYPES_ACCEPTES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

export type Usage = "documents" | "factures";

/** Chemin du fichier dans le store : usage/année/identifiant-nom-nettoyé.ext */
export function cheminFichier(usage: Usage, nom: string, type: string): string {
  const ext = TYPES_ACCEPTES[type];
  if (!ext) throw new HttpError(415, "Format non accepté : PDF, image (PNG, JPEG, WebP), Word ou Excel.");
  const base =
    nom
      .replace(/\.[a-z0-9]{1,5}$/i, "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "document";
  return `${usage}/${new Date().getUTCFullYear()}/${crypto.randomUUID()}-${base}.${ext}`;
}

/** Vérifie qu'un chemin envoyé par le navigateur vient bien d'un jeton de cet usage, et que le fichier a été déposé. */
export async function fichierDepose(chemin: unknown, usage: Usage): Promise<{ chemin: string } & InfosFichier> {
  if (typeof chemin !== "string" || !new RegExp(`^${usage}/\\d{4}/[0-9a-f-]{36}-[A-Za-z0-9-]+\\.[a-z]{2,4}$`).test(chemin)) throw new HttpError(400, "Fichier invalide.");
  const infos = await stockage().infos(chemin);
  if (!infos) throw new HttpError(400, "Le fichier n'a pas été reçu : renvoyez-le.");
  return { chemin, ...infos };
}
