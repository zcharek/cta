import { HttpError, uuid } from "../web.js";

export function texte(v: unknown, quoi: string, max = 120): string {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new HttpError(400, `${quoi} : champ obligatoire.`);
  if (s.length > max) throw new HttpError(400, `${quoi} : ${max} caractères maximum.`);
  return s;
}

export function email(v: unknown): string {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || s.length > 200) throw new HttpError(400, "Adresse e-mail invalide.");
  return s;
}

export function entier(v: unknown, quoi: string, min = 0, max = 100_000_000): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v.replace(/\s/g, "")) : NaN;
  if (!Number.isInteger(n) || n < min || n > max) throw new HttpError(400, `${quoi} : nombre entier attendu.`);
  return n;
}

export function idsListe(v: unknown, quoi: string): string[] {
  if (v === undefined) return [];
  if (!Array.isArray(v) || v.length > 500) throw new HttpError(400, `${quoi} : liste invalide.`);
  return [...new Set(v.map((x) => uuid(x, quoi)))];
}

/** Code Postgres de violation d'unicité. */
export const estDoublon = (err: unknown) => (err as { code?: string })?.code === "23505";
