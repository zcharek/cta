// Espace client du site : inscription avec vérification de l'adresse, connexion, déconnexion qui invalide le jeton.
// Les routes de api/auth sont appelées directement, sur le même Postgres en mémoire que Cockpit.
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { POST as connexion } from "../../api/auth/login";
import { POST as deconnexion } from "../../api/auth/logout";
import { GET as moi } from "../../api/auth/me";
import { POST as inscription } from "../../api/auth/signup";
import { POST as verifier } from "../../api/auth/verify";
import { preparerBase } from "./outils";

let sql: Sql;
let boite: { a: string; sujet: string; texte: string }[];

beforeAll(async () => {
  ({ sql, boite } = await preparerBase());
});

afterEach(async () => {
  await sql`DELETE FROM tentatives`;
});

async function appel(fn: (req: Request) => Promise<Response>, corps?: unknown, cookie?: string, ip?: string) {
  const headers: Record<string, string> = {};
  if (corps !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers.cookie = cookie;
  if (ip) headers["x-forwarded-for"] = ip;
  const res = await fn(new Request("https://cta.test/api/auth", { method: corps === undefined ? "GET" : "POST", headers, body: corps === undefined ? undefined : JSON.stringify(corps) }));
  return { status: res.status, data: await res.json(), cookie: res.headers.get("set-cookie")?.split(";")[0] };
}

const jetonVerification = (texte: string) => /#\/espace\/verifier\/([A-Za-z0-9_-]+)/.exec(texte)![1]!;
const dernierMail = (a: string) => boite.filter((e) => e.a === a).at(-1)!;

describe("inscription", () => {
  it("crée un compte client non confirmé, sans session, et envoie le lien", async () => {
    const r = await appel(inscription, { email: "Nadia@Pharma.test", password: "motdepasse-1", name: "Nadia Kaci" });
    expect(r.status).toBe(202);
    expect(r.cookie).toBeUndefined();
    const [u] = await sql`SELECT role, email_verifie_le FROM users WHERE email = 'nadia@pharma.test'`;
    expect(u).toMatchObject({ role: "client", email_verifie_le: null });
    expect(dernierMail("nadia@pharma.test").sujet).toMatch(/Confirmez votre adresse/);
  });

  it("ne donne jamais le rôle admin, même avec l'adresse du fondateur", async () => {
    process.env.ADMIN_EMAILS = "centraltestagency@gmail.com";
    await appel(inscription, { email: "centraltestagency@gmail.com", password: "motdepasse-1", name: "Imposteur" });
    const [u] = await sql`SELECT role FROM users WHERE email = 'centraltestagency@gmail.com'`;
    expect(u!.role).toBe("client");
    delete process.env.ADMIN_EMAILS;
  });

  it("même réponse si l'adresse est déjà prise ; le titulaire est prévenu par e-mail", async () => {
    await sql`INSERT INTO users (email, password_hash, name, role, email_verifie_le) VALUES ('deja@client.test', 'x', 'Déjà Là', 'client', now())`;
    const r = await appel(inscription, { email: "deja@client.test", password: "motdepasse-1", name: "Autre" });
    expect(r.status).toBe(202);
    expect(dernierMail("deja@client.test").sujet).toMatch(/Votre espace client/);
    const [u] = await sql`SELECT name FROM users WHERE email = 'deja@client.test'`;
    expect(u!.name).toBe("Déjà Là");
  });

  it("10 inscriptions par heure et par adresse IP", async () => {
    for (let i = 0; i < 10; i++) expect((await appel(inscription, { email: `lot${i}@x.test`, password: "motdepasse-1", name: "Lot" }, undefined, "198.51.100.7")).status).toBe(202);
    expect((await appel(inscription, { email: "lot10@x.test", password: "motdepasse-1", name: "Lot" }, undefined, "198.51.100.7")).status).toBe(429);
  });
});

describe("vérification de l'adresse", () => {
  it("connexion refusée avant confirmation ; le lien confirme, ouvre la session et ne sert qu'une fois", async () => {
    await appel(inscription, { email: "omar@banque.test", password: "motdepasse-1", name: "Omar Ziani" });
    const refus = await appel(connexion, { email: "omar@banque.test", password: "motdepasse-1" });
    expect(refus.status).toBe(403);
    expect(refus.data.nonVerifie).toBe(true);

    const jeton = jetonVerification(dernierMail("omar@banque.test").texte);
    const ok = await appel(verifier, { jeton });
    expect(ok.status).toBe(200);
    expect(ok.data.user).toMatchObject({ email: "omar@banque.test", role: "client" });
    expect((await appel(moi, undefined, ok.cookie)).data.user.email).toBe("omar@banque.test");
    expect((await appel(verifier, { jeton })).status).toBe(410);
    expect((await appel(connexion, { email: "omar@banque.test", password: "motdepasse-1" })).status).toBe(200);
  });

  it("un mauvais mot de passe ne révèle pas si l'adresse est confirmée", async () => {
    await appel(inscription, { email: "secret@x.test", password: "motdepasse-1", name: "Secret" });
    expect((await appel(connexion, { email: "secret@x.test", password: "faux-mot-de-passe" })).status).toBe(401);
  });

  it("renvoi du lien : l'ancien ne marche plus, le nouveau oui ; limité à 3 par heure", async () => {
    await appel(inscription, { email: "renvoi@x.test", password: "motdepasse-1", name: "Renvoi" });
    const ancien = jetonVerification(dernierMail("renvoi@x.test").texte);
    expect((await appel(verifier, { email: "renvoi@x.test" })).status).toBe(200);
    const nouveau = jetonVerification(dernierMail("renvoi@x.test").texte);
    expect((await appel(verifier, { jeton: ancien })).status).toBe(410);
    expect((await appel(verifier, { jeton: nouveau })).status).toBe(200);
    await sql`DELETE FROM tentatives`;
    for (let i = 0; i < 3; i++) await appel(verifier, { email: "quelquun@x.test" });
    expect((await appel(verifier, { email: "quelquun@x.test" })).status).toBe(429);
  });
});

describe("connexion et déconnexion", () => {
  it("5 échecs par compte : bloqué", async () => {
    await sql`INSERT INTO users (email, password_hash, name, role, email_verifie_le) VALUES ('cible@x.test', '$2a$04$invalide', 'Cible', 'client', now())`;
    for (let i = 0; i < 5; i++) expect((await appel(connexion, { email: "cible@x.test", password: "essai" })).status).toBe(401);
    expect((await appel(connexion, { email: "cible@x.test", password: "essai" })).status).toBe(429);
  });

  it("la déconnexion invalide le jeton, même copié avant", async () => {
    await appel(inscription, { email: "copie@x.test", password: "motdepasse-1", name: "Copie" });
    const { cookie } = await appel(verifier, { jeton: jetonVerification(dernierMail("copie@x.test").texte) });
    expect((await appel(moi, undefined, cookie)).data.user).toBeTruthy();
    await appel(deconnexion, {}, cookie);
    expect((await appel(moi, undefined, cookie)).data.user).toBeNull();
  });
});
