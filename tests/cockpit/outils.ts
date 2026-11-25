import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import bcrypt from "bcryptjs";
import type { Role } from "../../shared/cockpit";
import { traiter } from "../../api/_lib/cockpit/app";
import { brancherSql, type Sql } from "../../api/_lib/cockpit/db";
import { brancherEnvoyeur, type Email } from "../../api/_lib/cockpit/emails";

/** Postgres en mémoire avec les migrations de db/migrations, branché à la place de Neon. */
export async function preparerBase() {
  const db = new PGlite();
  // Schéma de l'espace client (users, questionnaires, assignments), puis migrations Cockpit, comme db-setup.mjs
  await db.exec(readFileSync(path.resolve(__dirname, "../../db/schema.sql"), "utf8"));
  const dir = path.resolve(__dirname, "../../db/migrations");
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) await db.exec(readFileSync(path.join(dir, f), "utf8"));
  const sql: Sql = async (strings, ...values) => {
    const texte = strings.reduce((acc, s, i) => acc + (i ? `$${i}` : "") + s, "");
    return (await db.query(texte, values)).rows as Record<string, any>[];
  };
  brancherSql(sql);
  const boite: Email[] = [];
  brancherEnvoyeur(async (e) => void boite.push(e));
  return { db, sql, boite };
}

export type Reponse = { status: number; data: any; cookie?: string };

/** Appelle l'API comme le ferait le navigateur. */
export async function appeler(methode: string, chemin: string, options: { corps?: unknown; cookie?: string } = {}): Promise<Reponse> {
  const headers: Record<string, string> = {};
  if (options.corps !== undefined) headers["content-type"] = "application/json";
  if (options.cookie) headers.cookie = options.cookie;
  const res = await traiter(
    new Request(`https://cockpit.test/api/cockpit/${chemin}`, {
      method: methode,
      headers,
      body: options.corps === undefined ? undefined : JSON.stringify(options.corps),
    }),
  );
  const setCookie = res.headers.get("set-cookie") ?? undefined;
  return { status: res.status, data: await res.json(), cookie: setCookie?.split(";")[0] };
}

let compteur = 0;

/** Crée directement un profil avec mot de passe, se connecte et renvoie son cookie de session. */
export async function creerProfil(sql: Sql, role: Role, options: { nom?: string; motDePasse?: string } = {}) {
  compteur++;
  const email = `${role}${compteur}@cta.test`;
  const motDePasse = options.motDePasse ?? "motdepasse-solide";
  const [p] = await sql`
    INSERT INTO profils (nom, email, role, mot_de_passe_hash, mot_de_passe_le, active_le)
    VALUES (${options.nom ?? `Profil ${role} ${compteur}`}, ${email}, ${role}, ${bcrypt.hashSync(motDePasse, 4)}, now(), now())
    RETURNING id`;
  const r = await appeler("POST", "auth/connexion", { corps: { email, motDePasse } });
  if (r.status !== 200) throw new Error(`Connexion impossible pour ${email} : ${JSON.stringify(r.data)}`);
  return { id: p!.id as string, email, motDePasse, cookie: r.cookie! };
}

/** Jeton extrait du lien d'un e-mail. */
export function jetonDe(e: Email) {
  const m = /jeton=([A-Za-z0-9_-]+)/.exec(e.texte);
  if (!m) throw new Error("Pas de lien dans l'e-mail");
  return m[1]!;
}
