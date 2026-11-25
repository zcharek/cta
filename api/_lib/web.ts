// Utilitaires HTTP sans dépendance à la base : partagés par l'espace client et Cockpit.

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, { ...init, headers: { "Cache-Control": "no-store", ...init.headers } });
}

/** Enveloppe un handler : transforme les HttpError en réponses JSON propres. */
export function handler(fn: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, { status: err.status });
      console.error(err);
      return json({ error: "Erreur serveur. Réessayez dans un instant." }, { status: 500 });
    }
  };
}

export async function readBody<T>(req: Request): Promise<T> {
  // Exiger du JSON bloque les formulaires cross-site (en plus de SameSite=Lax sur le cookie).
  if (!req.headers.get("content-type")?.includes("application/json")) throw new HttpError(415, "JSON attendu.");
  try {
    return (await req.json()) as T;
  } catch {
    throw new HttpError(400, "Requête invalide.");
  }
}

export function authSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET manquant ou trop court (32 caractères minimum).");
  return new TextEncoder().encode(s);
}

export function readCookie(req: Request, name: string): string | undefined {
  const raw = req.headers.get("cookie") ?? "";
  return raw
    .split(/;\s*/)
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Vérifie un identifiant avant de l'envoyer à Postgres (sinon erreur 500 sur une valeur mal formée). */
export function uuid(value: unknown, what = "Élément"): string {
  if (typeof value !== "string" || !UUID.test(value)) throw new HttpError(404, `${what} introuvable.`);
  return value;
}
