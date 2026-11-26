// Dossier d'un client (fiche, équipe, documents, factures) et suppression définitive.
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { definirStockage, type InfosFichier } from "../../api/_lib/cockpit/stockage";
import { appeler, creerProfil, preparerBase } from "./outils";

describe("dossier client", () => {
  let sql: Sql;
  let founder: Awaited<ReturnType<typeof creerProfil>>;
  let assistant: Awaited<ReturnType<typeof creerProfil>>;
  let collab: Awaited<ReturnType<typeof creerProfil>>;
  const fichiers = new Map<string, InfosFichier>();
  const supprimes: string[] = [];

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    definirStockage({
      jetonEnvoi: async (chemin) => `jeton:${chemin}`,
      infos: async (chemin) => fichiers.get(chemin) ?? null,
      lienLecture: async (chemin) => `https://stockage.test/${chemin}`,
      supprimer: async (chemin) => void supprimes.push(chemin),
    });
    founder = await creerProfil(sql, "cofounder");
    assistant = await creerProfil(sql, "assistant");
    collab = await creerProfil(sql, "collaborateur");
  });
  afterAll(() => definirStockage(null));

  async function deposer(usage: string, nom: string) {
    const j = await appeler("POST", "coffre/jeton", { cookie: founder.cookie, corps: { usage, nom, type: "application/pdf", taille: 1000 } });
    fichiers.set(j.data.chemin, { taille: 1000, type: "application/pdf" });
    return j.data.chemin as string;
  }

  async function nouveauClient(nom: string) {
    const r = await appeler("POST", "clients", { cookie: founder.cookie, corps: { nom, tjmDzd: 10000, profilIds: [collab.id] } });
    expect(r.status).toBe(201);
    return r.data.id as string;
  }

  it("rassemble la fiche, l'équipe, les documents et les factures ; masque ce que l'onglet ne permet pas", async () => {
    const id = await nouveauClient("Client Dossier");
    const fichier = await deposer("documents", "contrat.pdf");
    expect((await appeler("POST", "coffre/documents", { cookie: founder.cookie, corps: { fichier, categorie: "contrat", titre: "Contrat cadre", clientId: id } })).status).toBe(201);

    const r = await appeler("GET", `clients/${id}/dossier`, { cookie: founder.cookie });
    expect(r.status).toBe(200);
    expect(r.data.client).toMatchObject({ id, nom: "Client Dossier", jours_total: 0 });
    expect(r.data.equipe.map((m: { id: string }) => m.id)).toEqual([collab.id]);
    expect(r.data.documents).toHaveLength(1);
    expect(r.data.documents[0]).toMatchObject({ titre: "Contrat cadre", categorie: "contrat" });
    expect(r.data.factures).toEqual([]);
    expect(r.data.peutSupprimer).toBe(true);

    // Assistant : onglet Clients, sans Documents ni gestion des accès
    const a = await appeler("GET", `clients/${id}/dossier`, { cookie: assistant.cookie });
    expect(a.status).toBe(200);
    expect(a.data.documents).toBeNull();
    expect(a.data.peutSupprimer).toBe(false);
    expect((await appeler("GET", `clients/${id}/dossier`, { cookie: collab.cookie })).status).toBe(403);
    expect((await appeler("GET", "clients/00000000-0000-0000-0000-000000000000/dossier", { cookie: founder.cookie })).status).toBe(404);
  });

  it("suppression définitive : temps, documents (toutes versions) et factures importées effacés, fichiers compris", async () => {
    const id = await nouveauClient("Client à supprimer");
    const v1 = await deposer("documents", "nda-v1.pdf");
    const d1 = await appeler("POST", "coffre/documents", { cookie: founder.cookie, corps: { fichier: v1, categorie: "nda", titre: "NDA", clientId: id } });
    const v2 = await deposer("documents", "nda-v2.pdf");
    await appeler("POST", "coffre/documents", { cookie: founder.cookie, corps: { fichier: v2, categorie: "nda", titre: "NDA", clientId: id, precedentId: d1.data.id } });
    const f = await deposer("factures", "f.pdf");
    expect((await appeler("POST", "coffre/factures", { cookie: founder.cookie, corps: { fichier: f, numero: "090-25", dateEmission: "2025-06-02", ht: 100, tva: 19, ttc: 119, clientId: id } })).status).toBe(201);
    const [s] = await sql`INSERT INTO semaines (profil_id, lundi) VALUES (${collab.id}, '2026-11-02') RETURNING id`;
    await sql`INSERT INTO temps (semaine_id, client_id, jour, valeur) VALUES (${s!.id}, ${id}, '2026-11-02', 1)`;

    // Réservé à la gestion des accès
    expect((await appeler("DELETE", `clients/${id}`, { cookie: assistant.cookie })).status).toBe(403);
    expect((await appeler("DELETE", `clients/${id}`, { cookie: founder.cookie })).status).toBe(200);

    expect(await sql`SELECT id FROM clients WHERE id = ${id}`).toHaveLength(0);
    expect(await sql`SELECT 1 FROM temps WHERE client_id = ${id}`).toHaveLength(0);
    expect(await sql`SELECT 1 FROM documents WHERE fichier = ANY(${[v1, v2]}::text[])`).toHaveLength(0);
    expect(await sql`SELECT 1 FROM factures WHERE client_id = ${id}`).toHaveLength(0);
    expect(supprimes).toEqual(expect.arrayContaining([v1, v2, f]));
    expect((await appeler("DELETE", `clients/${id}`, { cookie: founder.cookie })).status).toBe(404);
  });

  it("une facture émise par Cockpit bloque la suppression : le client s'archive", async () => {
    const id = await nouveauClient("Client facturé");
    await sql`INSERT INTO factures (annee, numero, client_id, mois, date_emission, jours, montant_ht, montant_tva, montant_ttc, donnees)
      VALUES (2026, 900, ${id}, '2026-10', '2026-11-01', 1, 100, 19, 119, '{}'::jsonb)`;
    const r = await appeler("DELETE", `clients/${id}`, { cookie: founder.cookie });
    expect(r.status).toBe(409);
    expect(r.data.error).toMatch(/archivez-le/);
    expect((await appeler("GET", `clients/${id}/dossier`, { cookie: founder.cookie })).data.facturesEmises).toBe(1);
  });
});
