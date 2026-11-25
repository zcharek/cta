// « Mon profil » : coordonnées et mot de passe, pour chacun, quels que soient ses onglets.
import { beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { coordonneesManquantes } from "../../shared/cockpit";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;

beforeAll(async () => {
  ({ sql } = await preparerBase());
});

describe("mon profil", () => {
  it("un Collaborateur renseigne ses coordonnées, visibles par un responsable", async () => {
    const c = await creerProfil(sql, "collaborateur", { nom: "Yanis Haddad" });
    const r = await appeler("PATCH", "profil", { cookie: c.cookie, corps: { nom: "Yanis Haddad", telephone: "+213 550 12 34 56", adresse: "12 rue Didouche Mourad, Alger" } });
    expect(r.status).toBe(200);
    expect((await appeler("GET", "profil", { cookie: c.cookie })).data.profil).toMatchObject({
      nom: "Yanis Haddad",
      email: c.email,
      role: "collaborateur",
      telephone: "+213 550 12 34 56",
      adresse: "12 rue Didouche Mourad, Alger",
    });
    const qa = await creerProfil(sql, "qa_manager");
    const liste = await appeler("GET", "collaborateurs", { cookie: qa.cookie });
    expect(liste.data.collaborateurs.find((x: { id: string }) => x.id === c.id)).toMatchObject({ telephone: "+213 550 12 34 56", adresse: "12 rue Didouche Mourad, Alger" });

    // Vider un champ l'efface
    await appeler("PATCH", "profil", { cookie: c.cookie, corps: { adresse: "" } });
    expect((await appeler("GET", "profil", { cookie: c.cookie })).data.profil.adresse).toBeNull();
  });

  it("refuse un téléphone invalide et ne laisse pas changer son type ni son e-mail", async () => {
    const c = await creerProfil(sql, "collaborateur");
    expect((await appeler("PATCH", "profil", { cookie: c.cookie, corps: { telephone: "appelle-moi" } })).status).toBe(400);
    await appeler("PATCH", "profil", { cookie: c.cookie, corps: { role: "cofounder", email: "pirate@cta.test", onglets: ["recap"] } });
    const [p] = await sql`SELECT role, email, onglets FROM profils WHERE id = ${c.id}`;
    expect(p).toMatchObject({ role: "collaborateur", email: c.email, onglets: null });
  });

  it("change son mot de passe avec l'ancien : les autres sessions sont fermées", async () => {
    const c = await creerProfil(sql, "collaborateur");
    const autre = (await appeler("POST", "auth/connexion", { corps: { email: c.email, motDePasse: c.motDePasse } })).cookie!;
    expect((await appeler("POST", "profil/mot-de-passe", { cookie: c.cookie, corps: { actuel: "mauvais", nouveau: "nouveau-secret-1" } })).status).toBe(400);
    expect((await appeler("POST", "profil/mot-de-passe", { cookie: c.cookie, corps: { actuel: c.motDePasse, nouveau: "court" } })).status).toBe(400);

    const r = await appeler("POST", "profil/mot-de-passe", { cookie: c.cookie, corps: { actuel: c.motDePasse, nouveau: "nouveau-secret-1" } });
    expect(r.status).toBe(200);
    expect((await appeler("GET", "profil", { cookie: r.cookie })).status).toBe(200); // la session courante continue
    expect((await appeler("GET", "profil", { cookie: autre })).status).toBe(401);
    expect((await appeler("POST", "auth/connexion", { corps: { email: c.email, motDePasse: "nouveau-secret-1" } })).status).toBe(200);
  });

  it("reste accessible sans aucun onglet", async () => {
    const qa = await creerProfil(sql, "qa_manager");
    const c = await creerProfil(sql, "collaborateur");
    await appeler("PATCH", `collaborateurs/${c.id}`, { cookie: qa.cookie, corps: { onglets: [] } });
    expect((await appeler("GET", "profil", { cookie: c.cookie })).status).toBe(200);
    expect((await appeler("GET", "auth/moi", { cookie: c.cookie })).data.moi.onglets).toEqual([]);
  });
});

describe("coordonnées pour les contrats", () => {
  it("enregistre naissance, ville et wilaya ; la fiche devient complète", async () => {
    const c = await creerProfil(sql, "collaborateur");
    const corps = { civilite: "M", telephone: "0550 11 22 33", adresse: "3 rue Hassiba Ben Bouali", ville: "Sidi M'Hamed", wilaya: "Alger", date_naissance: "1992-07-05", lieu_naissance: "Béjaïa", nationalite: "Algérienne", nin: "109920705012345678", situation_familiale: "M", numero_ss: "1234567890 12", numero_compte: "00799999001234567890" };
    expect((await appeler("PATCH", "profil", { cookie: c.cookie, corps })).status).toBe(200);
    const p = (await appeler("GET", "profil", { cookie: c.cookie })).data.profil;
    expect(p).toMatchObject(corps);
    expect(coordonneesManquantes(p)).toEqual([]);
  });

  it("refuse une date de naissance impossible ou invraisemblable", async () => {
    const c = await creerProfil(sql, "collaborateur");
    for (const d of ["1992-02-30", "05/07/1992", "2024-01-01", "1890-01-01"])
      expect((await appeler("PATCH", "profil", { cookie: c.cookie, corps: { date_naissance: d } })).status).toBe(400);
  });

  it("NIN : 18 chiffres, espaces tolérés à la saisie, jamais exposé dans la liste des collaborateurs", async () => {
    const c = await creerProfil(sql, "collaborateur");
    for (const n of ["12345", "1099207050123456789", "10992070501234567A"])
      expect((await appeler("PATCH", "profil", { cookie: c.cookie, corps: { nin: n } })).status).toBe(400);
    expect((await appeler("PATCH", "profil", { cookie: c.cookie, corps: { nin: "1099 2070 5012 3456 78" } })).status).toBe(200);
    expect((await appeler("GET", "profil", { cookie: c.cookie })).data.profil.nin).toBe("109920705012345678");

    const qa = await creerProfil(sql, "qa_manager");
    const fiche = (await appeler("GET", "collaborateurs", { cookie: qa.cookie })).data.collaborateurs.find((x: { id: string }) => x.id === c.id);
    expect(fiche.nin_renseigne).toBe(true);
    expect(fiche).not.toHaveProperty("nin");
  });

  it("liste les champs manquants", () => {
    expect(coordonneesManquantes({ telephone: "0550", ville: "Oran" })).toEqual(["civilité", "date de naissance", "lieu de naissance", "nationalité", "NIN", "adresse", "wilaya", "situation familiale", "N° de sécurité sociale", "N° de compte bancaire"]);
  });
});

describe("onglets Clients et Collaborateurs séparés", () => {
  it("l'onglet Clients seul permet de gérer les clients, pas les collaborateurs", async () => {
    const qa = await creerProfil(sql, "qa_manager");
    const a = await creerProfil(sql, "assistant");
    await appeler("PATCH", `collaborateurs/${a.id}`, { cookie: qa.cookie, corps: { onglets: ["clients"] } });
    expect((await appeler("POST", "clients", { cookie: a.cookie, corps: { nom: "Djezzy", tjmDzd: 50000 } })).status).toBe(201);
    expect((await appeler("GET", "collaborateurs", { cookie: a.cookie })).status).toBe(200); // pour composer l'équipe d'un client
    expect((await appeler("POST", "collaborateurs", { cookie: a.cookie, corps: { nom: "X", email: "x2@cta.test", role: "collaborateur" } })).status).toBe(403);
  });

  it("l'onglet Collaborateurs seul ne permet pas de créer un client", async () => {
    const qa = await creerProfil(sql, "qa_manager");
    const a = await creerProfil(sql, "assistant");
    await appeler("PATCH", `collaborateurs/${a.id}`, { cookie: qa.cookie, corps: { onglets: ["collaborateurs"] } });
    expect((await appeler("POST", "clients", { cookie: a.cookie, corps: { nom: "Ooredoo", tjmDzd: 50000 } })).status).toBe(403);
    expect((await appeler("POST", "collaborateurs", { cookie: a.cookie, corps: { nom: "Y", email: "y2@cta.test", role: "collaborateur" } })).status).toBe(201);
  });
});
