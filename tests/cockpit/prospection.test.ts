import { beforeAll, describe, expect, it } from "vitest";
import { aujourdhui, ajouterJours } from "../../shared/cockpit";
import {
  appliquerStatut,
  correspond,
  estARelancer,
  lienAppelCabinet,
  lienWhatsApp,
  messageWhatsApp,
  mobileAlgerien,
  neufDerniersChiffres,
  numeroWhatsApp,
  trierCartes,
  trierSemaines,
} from "../../shared/prospection";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

const J = "2026-11-25";
const vierge = { premier_contact: null, relance_le: null, demo_le: null };

describe("règles de relance", () => {
  it.each([
    ["message_envoye", "2026-11-30"],
    ["relance", "2026-12-02"],
    ["en_discussion", "2026-11-28"],
    ["demo_planifiee", "2026-11-27"],
  ] as const)("%s : premier contact aujourd'hui, relance %s", (statut, relance) => {
    expect(appliquerStatut({ statut: "a_contacter", ...vierge }, statut, J)).toEqual({ statut, premier_contact: J, relance_le: relance, demo_le: null });
  });

  it("démo planifiée : relance à la date de la démo si elle est connue", () => {
    expect(appliquerStatut({ statut: "en_discussion", premier_contact: "2026-11-01", relance_le: null, demo_le: "2026-12-10" }, "demo_planifiee", J)).toMatchObject({
      premier_contact: "2026-11-01",
      relance_le: "2026-12-10",
    });
  });

  it.each(["a_contacter", "client_signe", "pas_interesse", "hors_cible"] as const)("%s : premier contact inchangé, relance vide", (statut) => {
    expect(appliquerStatut({ statut: "relance", premier_contact: "2026-11-01", relance_le: "2026-11-20", demo_le: null }, statut, J)).toEqual({
      statut,
      premier_contact: "2026-11-01",
      relance_le: null,
      demo_le: null,
    });
  });

  it("à relancer : relance passée ou du jour, hors statuts finaux et « À contacter »", () => {
    expect(estARelancer({ statut: "message_envoye", relance_le: J }, J)).toBe(true);
    expect(estARelancer({ statut: "relance", relance_le: "2026-11-01" }, J)).toBe(true);
    expect(estARelancer({ statut: "relance", relance_le: "2026-11-26" }, J)).toBe(false);
    expect(estARelancer({ statut: "a_contacter", relance_le: "2026-11-01" }, J)).toBe(false);
    expect(estARelancer({ statut: "client_signe", relance_le: "2026-11-01" }, J)).toBe(false);
    expect(estARelancer({ statut: "en_discussion", relance_le: null }, J)).toBe(false);
  });
});

describe("WhatsApp", () => {
  it("reconnaît les mobiles algériens", () => {
    expect(mobileAlgerien("0550 12 34 56")).toBe("213550123456");
    expect(mobileAlgerien("06.61.23.45.67")).toBe("213661234567");
    expect(mobileAlgerien("+213 7 70 12 34 56")).toBe("213770123456");
    expect(mobileAlgerien("00213550123456")).toBe("213550123456");
    expect(mobileAlgerien("+213 0550 12 34 56")).toBe("213550123456");
    expect(mobileAlgerien("021 23 45 67")).toBeNull();
    expect(mobileAlgerien("0450123456")).toBeNull();
  });

  it("prend le premier mobile valide : contact canal 1, puis téléphone, puis contact relance", () => {
    expect(numeroWhatsApp({ contact_canal1: "021 23 45 67", telephone: "021 11 22 33 / 0661 23 45 67", contact_relance: "0550123456" })).toBe("213661234567");
    expect(numeroWhatsApp({ contact_canal1: null, telephone: "021 11 22 33", contact_relance: "0770 12 34 56" })).toBe("213770123456");
    expect(numeroWhatsApp({ contact_canal1: null, telephone: "021 11 22 33", contact_relance: null })).toBeNull();
  });

  const cab = { nom: "Clinique El Biar", veterinaire: "Dr Amrani", telephone: "0550 12 34 56", contact_canal1: null, contact_relance: null, message: null };

  it("message personnalisé, sinon modèle avec {veterinaire} et {cabinet}", () => {
    expect(messageWhatsApp(cab, "Bonjour {veterinaire} ({cabinet})")).toBe("Bonjour Dr Amrani (Clinique El Biar)");
    expect(messageWhatsApp({ ...cab, message: "Salut !\nÀ bientôt" }, "x")).toBe("Salut !\nÀ bientôt");
    expect(messageWhatsApp({ ...cab, veterinaire: null }, "Bonjour {veterinaire}")).toBe("Bonjour Docteur");
  });

  it("construit le lien wa.me avec le message encodé", () => {
    expect(lienWhatsApp(cab, "Bonjour {veterinaire} & bienvenue")).toBe("https://wa.me/213550123456?text=Bonjour%20Dr%20Amrani%20%26%20bienvenue");
    expect(lienWhatsApp({ ...cab, telephone: "021 23 45 67" }, "x")).toBeNull();
  });

  it("un fixe a un lien d'appel", () => {
    expect(lienAppelCabinet({ telephone: "021 23 45 67", contact_canal1: null, contact_relance: null })).toBe("tel:+21321234567");
    expect(lienAppelCabinet({ telephone: "0550 12 34 56", contact_canal1: null, contact_relance: null })).toBe("tel:+213550123456");
  });

  it("doublon possible : 9 derniers chiffres identiques", () => {
    expect(neufDerniersChiffres("0550 12 34 56")).toBe(neufDerniersChiffres("+213 550 12 34 56"));
    expect(neufDerniersChiffres("12 34")).toBeNull();
  });
});

describe("recherche et tri", () => {
  const c = {
    nom: "Cabinet Vétérinaire Hydra",
    veterinaire: "Dr Benali",
    commune: "Hydra",
    telephone: "0550 12 34 56",
    telephone2: null,
    contact_canal1: null,
    contact_relance: null,
    email: "contact@hydra.dz",
    adresse: "12 rue des Pins",
    notes: "Rappeler après 14h",
  };
  it("cherche sans accents dans les champs texte", () => {
    expect(correspond(c, "veterinaire hydra")).toBe(true);
    expect(correspond(c, "benali")).toBe(true);
    expect(correspond(c, "pins")).toBe(true);
    expect(correspond(c, "14h")).toBe(true);
    expect(correspond(c, "Kouba")).toBe(false);
  });
  it("une suite d'au moins 4 chiffres cherche dans les numéros, espaces ignorés", () => {
    expect(correspond(c, "1234")).toBe(true);
    expect(correspond(c, "0550 1234")).toBe(true);
    expect(correspond(c, "+213 550 12")).toBe(true);
    expect(correspond(c, "9999")).toBe(false);
  });
  it("cartes dues en tête par date de relance, puis semaine du plan, commune et nom", () => {
    const cartes = [
      { nom: "B", commune: "Kouba", semaine_plan: "S10", statut: "a_contacter" as const, relance_le: null },
      { nom: "A", commune: "Kouba", semaine_plan: "S2", statut: "a_contacter" as const, relance_le: null },
      { nom: "Due récente", commune: "Z", semaine_plan: "S9", statut: "relance" as const, relance_le: "2026-11-24" },
      { nom: "Due ancienne", commune: "Z", semaine_plan: "S9", statut: "relance" as const, relance_le: "2026-11-10" },
      { nom: "C", commune: "Alger", semaine_plan: "S2", statut: "a_contacter" as const, relance_le: null },
    ];
    expect(trierCartes(cartes, J).map((x) => x.nom)).toEqual(["Due ancienne", "Due récente", "C", "A", "B"]);
    expect(trierSemaines(["S10", null, "S2", "S1", "S2"])).toEqual(["S1", "S2", "S10"]);
  });
});

describe("API cabinets", () => {
  let sql: Sql;
  let admin: Awaited<ReturnType<typeof creerProfil>>;
  let collab: Awaited<ReturnType<typeof creerProfil>>;
  let id: string;
  const jour = aujourdhui();

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    admin = await creerProfil(sql, "assistant", { nom: "Nadia Assistante" });
    collab = await creerProfil(sql, "collaborateur");
    [{ id }] = (await sql`
      INSERT INTO cabinets (cle, nom, commune, veterinaire, telephone, semaine_plan)
      VALUES ('cabinet-hydra-hydra', 'Cabinet Hydra', 'Hydra', 'Dr Benali', '0550 12 34 56', 'S1') RETURNING id`) as [{ id: string }];
    await sql`INSERT INTO cabinets (cle, nom, statut, raison_hors_cible) VALUES ('ferme', 'Cabinet Fermé', 'hors_cible', 'Fermé selon Google')`;
  });

  it("la liste exclut les Hors cible et fournit le modèle de message", async () => {
    const r = await appeler("GET", "cabinets", { cookie: admin.cookie });
    expect(r.data.cabinets.map((c: { nom: string }) => c.nom)).toEqual(["Cabinet Hydra"]);
    expect(r.data.modele).toContain("{veterinaire}");
  });

  it("ouvrir WhatsApp sur un cabinet « À contacter » le passe en « Message WhatsApp envoyé »", async () => {
    const r = await appeler("POST", `cabinets/${id}/whatsapp`, { cookie: admin.cookie });
    expect(r.data.cabinet).toMatchObject({ statut: "message_envoye", premier_contact: jour, relance_le: ajouterJours(jour, 5) });
    const fiche = await appeler("GET", `cabinets/${id}`, { cookie: admin.cookie });
    expect(fiche.data.historique[0]).toMatchObject({ action: "Message WhatsApp envoyé", statut: "message_envoye", auteur: "Nadia Assistante" });
    // une seconde ouverture ne change pas le statut
    const r2 = await appeler("POST", `cabinets/${id}/whatsapp`, { cookie: admin.cookie });
    expect(r2.data.cabinet.statut).toBe("message_envoye");
  });

  it("déplacer une carte change le statut, programme la relance et alimente l'historique", async () => {
    const r = await appeler("POST", `cabinets/${id}/statut`, { cookie: admin.cookie, corps: { statut: "en_discussion" } });
    expect(r.data.cabinet).toMatchObject({ statut: "en_discussion", premier_contact: jour, relance_le: ajouterJours(jour, 3) });
    const fiche = await appeler("GET", `cabinets/${id}`, { cookie: admin.cookie });
    expect(fiche.data.cabinet).toMatchObject({ statut: "en_discussion", relance_le: ajouterJours(jour, 3) });
    expect(fiche.data.historique.map((h: { action: string }) => h.action)).toContain("Statut : En discussion");

    await appeler("POST", `cabinets/${id}/statut`, { cookie: admin.cookie, corps: { statut: "client_signe" } });
    const signe = await appeler("GET", `cabinets/${id}`, { cookie: admin.cookie });
    expect(signe.data.cabinet).toMatchObject({ statut: "client_signe", relance_le: null, premier_contact: jour });
    expect((await appeler("POST", `cabinets/${id}/statut`, { cookie: admin.cookie, corps: { statut: "nimporte" } })).status).toBe(400);
  });

  it("la fiche modifie les champs principaux, sans toucher aux autres", async () => {
    const r = await appeler("PATCH", `cabinets/${id}`, { cookie: admin.cookie, corps: { notes: "Très intéressé", telephone: "0661 00 00 00", relance_le: "2026-12-20", statut: "hors_cible" } });
    expect(r.status).toBe(200);
    const fiche = await appeler("GET", `cabinets/${id}`, { cookie: admin.cookie });
    expect(fiche.data.cabinet).toMatchObject({ notes: "Très intéressé", telephone: "0661 00 00 00", relance_le: "2026-12-20", statut: "client_signe", commune: "Hydra" });
    expect((await appeler("PATCH", `cabinets/${id}`, { cookie: admin.cookie, corps: { nom: "" } })).status).toBe(400);
    expect((await appeler("PATCH", `cabinets/${id}`, { cookie: admin.cookie, corps: { demo_le: "31/12/2026" } })).status).toBe(400);
  });

  it("modèle WhatsApp : lecture, enregistrement et refus d'un modèle vide", async () => {
    expect((await appeler("PUT", "parametres/whatsapp", { cookie: admin.cookie, corps: { modele: "  " } })).status).toBe(400);
    await appeler("PUT", "parametres/whatsapp", { cookie: admin.cookie, corps: { modele: "Salut {veterinaire} !" } });
    const r = await appeler("GET", "parametres/whatsapp", { cookie: admin.cookie });
    expect(r.data.modele).toBe("Salut {veterinaire} !");
    expect(r.data.exemples[0].nom).toBe("Cabinet Hydra");
  });

  it("un Collaborateur n'accède à rien de la prospection", async () => {
    for (const [m, chemin, corps] of [
      ["GET", "cabinets"],
      ["GET", `cabinets/${id}`],
      ["PATCH", `cabinets/${id}`, { notes: "x" }],
      ["POST", `cabinets/${id}/statut`, { statut: "relance" }],
      ["POST", `cabinets/${id}/whatsapp`],
      ["DELETE", `cabinets/${id}`],
      ["GET", "parametres/whatsapp"],
      ["PUT", "parametres/whatsapp", { modele: "x" }],
      ["POST", "import/analyser", { cabinets: [] }],
      ["POST", "import/lot", { cabinets: [] }],
      ["GET", "accueil"],
    ] as [string, string, unknown?][])
      expect((await appeler(m, chemin, { cookie: collab.cookie, corps })).status, `${m} ${chemin}`).toBe(403);
  });

  it("la suppression retire le cabinet et son historique", async () => {
    expect((await appeler("DELETE", `cabinets/${id}`, { cookie: admin.cookie })).status).toBe(200);
    expect((await appeler("GET", `cabinets/${id}`, { cookie: admin.cookie })).status).toBe(404);
    const [h] = await sql`SELECT count(*)::int AS n FROM historique_cabinet WHERE cabinet_id = ${id}`;
    expect(h!.n).toBe(0);
  });
});

describe("API accueil", () => {
  it("compte relances dues, jamais contactés, semaines à valider et retardataires", async () => {
    const { sql } = await preparerBase();
    const admin = await creerProfil(sql, "cofounder");
    const collab = await creerProfil(sql, "collaborateur", { nom: "Sami Retard" });
    const jour = aujourdhui();
    const [{ id: client }] = (await sql`INSERT INTO clients (nom, tjm_dzd) VALUES ('C', 40000) RETURNING id`) as [{ id: string }];
    await sql`INSERT INTO affectations VALUES (${collab.id}, ${client})`;
    await sql`
      INSERT INTO cabinets (cle, nom, statut, semaine_plan, relance_le) VALUES
        ('a', 'A', 'a_contacter', 'S3', NULL), ('b', 'B', 'a_contacter', 'S2', NULL), ('c', 'C', 'a_contacter', 'S2', NULL),
        ('d', 'D', 'relance', 'S1', ${ajouterJours(jour, -4)}::date), ('e', 'E', 'en_discussion', 'S1', ${jour}::date),
        ('f', 'F', 'demo_planifiee', 'S1', ${ajouterJours(jour, 3)}::date), ('g', 'G', 'client_signe', 'S1', NULL),
        ('h', 'H', 'hors_cible', 'S1', NULL)`;
    const r = await appeler("GET", "accueil", { cookie: admin.cookie });
    expect(r.status).toBe(200);
    expect(r.data.relances).toEqual({ nombre: 2, plus_ancienne: ajouterJours(jour, -4) });
    expect(r.data.jamaisContactes).toEqual({ nombre: 3, prochaineSemaine: "S2", restantSemaine: 2 });
    expect(r.data.prospection).toMatchObject({ total: 7, contactes: 4, interesses: 2, signes: 1 });
    expect(r.data.semainePrecedente.manquants.map((p: { nom: string }) => p.nom)).toEqual(["Sami Retard"]);
    expect(r.data.semainesAValider).toBe(0);
  });
});
