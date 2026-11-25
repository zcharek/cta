import { HttpError, json } from "../web.js";

export type Contexte = { req: Request; url: URL; params: Record<string, string> };
type Action = (c: Contexte) => Promise<Response>;
type Route = { methode: string; motif: RegExp; noms: string[]; action: Action };

export class Routeur {
  private routes: Route[] = [];

  /** Motif du type « collaborateurs/:id/invitation ». */
  ajouter(methode: string, chemin: string, action: Action) {
    const noms: string[] = [];
    const motif = new RegExp(
      `^${chemin.replace(/:([a-z]+)/gi, (_, n) => (noms.push(n), "([^/]+)"))}$`,
    );
    this.routes.push({ methode, motif, noms, action });
    return this;
  }

  async traiter(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      // Vercel réécrit /api/cockpit/<chemin> en /api/cockpit?route=<chemin>.
      const chemin = (url.searchParams.get("route") ?? url.pathname.replace(/^\/api\/cockpit\/?/, "")).replace(/^\/|\/$/g, "");
      let cheminConnu = false;
      for (const r of this.routes) {
        const m = r.motif.exec(chemin);
        if (!m) continue;
        cheminConnu = true;
        if (r.methode !== req.method) continue;
        const params = Object.fromEntries(r.noms.map((n, i) => [n, decodeURIComponent(m[i + 1]!)]));
        return await r.action({ req, url, params });
      }
      throw new HttpError(cheminConnu ? 405 : 404, cheminConnu ? "Méthode non autorisée." : "Introuvable.");
    } catch (err) {
      if (err instanceof HttpError) return json({ error: err.message }, { status: err.status });
      console.error(err);
      return json({ error: "Erreur serveur. Réessayez dans un instant." }, { status: 500 });
    }
  }
}
