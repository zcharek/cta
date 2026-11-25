// Parcours d'invitation, de connexion, d'archivage et de mot de passe oublié.
import { beforeAll, describe, expect, it } from "vitest";
import type { Email } from "../../api/_lib/cockpit/emails";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, jetonDe, preparerBase } from "./outils";

let sql: Sql;
let boite: Email[];
let cofounder: Awaited<ReturnType<typeof creerProfil>>;
let clientId: string;

beforeAll(async () => {
  ({ sql, boite } = await preparerBase());
  cofounder = await creerProfil(sql, "cofounder", { nom: "Charek Zennouda" });
  [{ id: clientId }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('VetCare', 50000) RETURNING id`) as [{ id: string }];
});

describe("invitation d'un collaborateur", () => {
  let id: string;
  let jeton: string;
  let session: string;

  it("un Co-Founder crée le collaborateur, qui reçoit un e-mail", async () => {
    const r = await appeler("POST", "collaborateurs", {
      cookie: cofounder.cookie,
      corps: { nom: "Yasmine Belkacem", email: "  Yasmine@CTA.test ", role: "collaborateur", clientIds: [clientId] },
    });
    expect(r.status).toBe(201);
    expect(r.data.invitation.envoye).toBe(true);
    id = r.data.id;

    const mail = boite.at(-1)!;
    expect(mail.a).toBe("yasmine@cta.test");
    expect(mail.sujet).toContain("Cockpit");
    expect(mail.texte).toContain("Charek Zennouda");
    expect(mail.texte).toContain("https://cockpit.test/cockpit/definir-mot-de-passe?jeton=");
    expect(mail.html).toContain("#071538");
    jeton = jetonDe(mail);

    const [stocke] = await sql`SELECT empreinte FROM jetons WHERE profil_id = ${id}`;
    expect(stocke!.empreinte).not.toBe(jeton);
  });

  it("statut « Invitation envoyée » et clients assignés", async () => {
    const r = await appeler("GET", "collaborateurs", { cookie: cofounder.cookie });
    const y = r.data.collaborateurs.find((c: { id: string }) => c.id === id);
    expect(y).toMatchObject({ statut: "invitation", role: "collaborateur", client_ids: [clientId] });
  });

  it("refuse un e-mail déjà utilisé", async () => {
    const r = await appeler("POST", "collaborateurs", { cookie: cofounder.cookie, corps: { nom: "Autre", email: "yasmine@cta.test", role: "assistant" } });
    expect(r.status).toBe(409);
  });

  it("ne peut pas se connecter avant d'avoir défini son mot de passe", async () => {
    const r = await appeler("POST", "auth/connexion", { corps: { email: "yasmine@cta.test", motDePasse: "" } });
    expect(r.status).toBe(401);
  });

  it("le lien affiche le nom, puis le mot de passe est contrôlé", async () => {
    const info = await appeler("GET", `auth/jeton?jeton=${jeton}`);
    expect(info.data).toMatchObject({ nom: "Yasmine Belkacem", type: "invitation" });

    const court = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton, motDePasse: "court", confirmation: "court" } });
    expect(court.status).toBe(400);
    const differents = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton, motDePasse: "motdepasse1", confirmation: "motdepasse2" } });
    expect(differents.status).toBe(400);
  });

  it("définit son mot de passe et arrive connectée, en tant que Collaborateur", async () => {
    const r = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton, motDePasse: "motdepasse1", confirmation: "motdepasse1" } });
    expect(r.status).toBe(200);
    expect(r.data.moi).toMatchObject({ email: "yasmine@cta.test", role: "collaborateur", admin: false });
    session = r.cookie!;
    expect((await appeler("GET", "auth/moi", { cookie: session })).data.moi.id).toBe(id);
    expect((await appeler("GET", "clients", { cookie: session })).data.clients).toEqual([{ id: clientId, nom: "VetCare" }]);
  });

  it("le lien ne sert qu'une fois, et « Renvoyer l'invitation » n'est plus possible", async () => {
    expect((await appeler("GET", `auth/jeton?jeton=${jeton}`)).status).toBe(410);
    const r = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton, motDePasse: "autremdp99", confirmation: "autremdp99" } });
    expect(r.status).toBe(410);
    expect((await appeler("POST", `collaborateurs/${id}/invitation`, { cookie: cofounder.cookie })).status).toBe(409);
    const liste = await appeler("GET", "collaborateurs", { cookie: cofounder.cookie });
    expect(liste.data.collaborateurs.find((c: { id: string }) => c.id === id).statut).toBe("actif");
  });

  it("se connecte ensuite par e-mail et mot de passe", async () => {
    expect((await appeler("POST", "auth/connexion", { corps: { email: "yasmine@cta.test", motDePasse: "mauvais" } })).status).toBe(401);
    const r = await appeler("POST", "auth/connexion", { corps: { email: "YASMINE@cta.test", motDePasse: "motdepasse1" } });
    expect(r.status).toBe(200);
    expect(r.cookie).toMatch(/^cockpit_session=/);
  });

  it("l'archivage bloque la connexion sans supprimer les temps, la réactivation la rétablit", async () => {
    await appeler("PUT", "temps", { cookie: session, corps: { profilId: id, lundi: "2026-11-23", clientId, jour: "2026-11-23", valeur: 1 } });

    const archive = await appeler("PATCH", `collaborateurs/${id}`, { cookie: cofounder.cookie, corps: { actif: false } });
    expect(archive.status).toBe(200);
    expect((await appeler("POST", "auth/connexion", { corps: { email: "yasmine@cta.test", motDePasse: "motdepasse1" } })).status).toBe(403);
    expect((await appeler("GET", "auth/moi", { cookie: session })).data.moi).toBeNull();
    const [t] = await sql`SELECT count(*)::int AS n FROM temps t JOIN semaines s ON s.id = t.semaine_id WHERE s.profil_id = ${id}`;
    expect(t!.n).toBe(1);

    await appeler("PATCH", `collaborateurs/${id}`, { cookie: cofounder.cookie, corps: { actif: true } });
    expect((await appeler("POST", "auth/connexion", { corps: { email: "yasmine@cta.test", motDePasse: "motdepasse1" } })).status).toBe(200);
  });

  it("un admin ne peut pas archiver son propre compte ni se retirer l'accès complet", async () => {
    expect((await appeler("PATCH", `collaborateurs/${cofounder.id}`, { cookie: cofounder.cookie, corps: { actif: false } })).status).toBe(400);
    expect((await appeler("PATCH", `collaborateurs/${cofounder.id}`, { cookie: cofounder.cookie, corps: { role: "collaborateur" } })).status).toBe(400);
    expect((await appeler("PATCH", `collaborateurs/${cofounder.id}`, { cookie: cofounder.cookie, corps: { role: "qa_manager" } })).status).toBe(200);
  });
});

describe("renvoi d'invitation", () => {
  it("un nouveau lien annule le précédent", async () => {
    const r = await appeler("POST", "collaborateurs", { cookie: cofounder.cookie, corps: { nom: "Karim Ait", email: "karim@cta.test", role: "assistant" } });
    const premier = jetonDe(boite.at(-1)!);
    const renvoi = await appeler("POST", `collaborateurs/${r.data.id}/invitation`, { cookie: cofounder.cookie });
    expect(renvoi.status).toBe(200);
    const second = jetonDe(boite.at(-1)!);
    expect(second).not.toBe(premier);
    expect((await appeler("GET", `auth/jeton?jeton=${premier}`)).status).toBe(410);
    expect((await appeler("GET", `auth/jeton?jeton=${second}`)).status).toBe(200);
  });

  it("un compte archivé ne peut pas utiliser un lien en attente", async () => {
    const r = await appeler("POST", "collaborateurs", { cookie: cofounder.cookie, corps: { nom: "Lina B", email: "lina@cta.test", role: "collaborateur" } });
    const jeton = jetonDe(boite.at(-1)!);
    await appeler("PATCH", `collaborateurs/${r.data.id}`, { cookie: cofounder.cookie, corps: { actif: false } });
    const def = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton, motDePasse: "motdepasse1", confirmation: "motdepasse1" } });
    expect(def.status).toBe(410);
    expect((await appeler("POST", `collaborateurs/${r.data.id}/invitation`, { cookie: cofounder.cookie })).status).toBe(409);
  });
});

describe("mot de passe oublié", () => {
  it("répond pareil pour une adresse inconnue, sans envoyer d'e-mail", async () => {
    const avant = boite.length;
    const r = await appeler("POST", "auth/mot-de-passe-oublie", { corps: { email: "inconnu@cta.test" } });
    expect(r.status).toBe(200);
    expect(boite.length).toBe(avant);
  });

  it("envoie un lien qui change le mot de passe et ferme les anciennes sessions", async () => {
    const p = await creerProfil(sql, "assistant", { motDePasse: "ancien-mdp-123" });
    await appeler("POST", "auth/mot-de-passe-oublie", { corps: { email: p.email } });
    const mail = boite.at(-1)!;
    expect(mail.a).toBe(p.email);
    expect(mail.sujet).toContain("Réinitialisation");

    const r = await appeler("POST", "auth/definir-mot-de-passe", { corps: { jeton: jetonDe(mail), motDePasse: "nouveau-mdp-123", confirmation: "nouveau-mdp-123" } });
    expect(r.status).toBe(200);
    expect((await appeler("GET", "auth/moi", { cookie: p.cookie })).data.moi).toBeNull();
    expect((await appeler("GET", "auth/moi", { cookie: r.cookie })).data.moi.email).toBe(p.email);
    expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: "ancien-mdp-123" } })).status).toBe(401);
    expect((await appeler("POST", "auth/connexion", { corps: { email: p.email, motDePasse: "nouveau-mdp-123" } })).status).toBe(200);
  });
});

describe("routeur", () => {
  it("404 sur une route inconnue, 405 sur une mauvaise méthode", async () => {
    expect((await appeler("GET", "inconnue")).status).toBe(404);
    expect((await appeler("DELETE", "auth/connexion")).status).toBe(405);
  });

  it("accepte le chemin passé en paramètre par la réécriture Vercel", async () => {
    const { traiter } = await import("../../api/_lib/cockpit/app");
    const res = await traiter(new Request("https://cockpit.test/api/cockpit?route=auth/moi"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ moi: null });
  });
});
