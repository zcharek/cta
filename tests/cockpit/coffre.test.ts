// Coffre de documents et import des factures d'avant Cockpit : détection automatique, droits, stockage privé.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { definirStockage, type InfosFichier } from "../../api/_lib/cockpit/stockage";
import { detecter, lireMontant } from "../../shared/detection";
import { genererFacture, type DonneesFacture } from "../../shared/facture";
import { lignesPdf } from "../../shared/lecture-pdf";
import { appeler, creerProfil, preparerBase } from "./outils";

const SOI = { raison_sociale: "SARL CENTRAL TEST APPLICATION", rc: "16/00-1111111 B 25", nif: "000000000000002" };

describe("détection automatique", () => {
  it("lit les montants dans les deux notations", () => {
    expect(lireMontant("160,000.00")).toBe(160000);
    expect(lireMontant("109 730,77")).toBe(109730.77);
    expect(lireMontant("109.730,77")).toBe(109730.77);
    expect(lireMontant("80000")).toBe(80000);
    expect(lireMontant("7,272.72")).toBe(7272.72);
  });

  it("reconnaît une facture du modèle CTA dans un vrai PDF et crée le client absent", async () => {
    const d: DonneesFacture = {
      numero: "014-26",
      date_emission: "2026-05-01",
      entreprise: { ...SOI, siege: "Draria, Alger", nis: "3", ai: "4", rib: "5", banque: "Banque Test", email: "f@cta.test", ville: "Alger" } as never,
      client: { raison_sociale: "SARL Algeria E-Banking Services", adresse: "Zone industrielle, Cheraga, Alger", rc: "16/00-0000000 B 00", nif: "000000000000001" },
      ligne: { designation: "Prestation de service", debut: "2026-04-01", fin: "2026-04-30", unite: "Jour", quantite: 22, pu: 7272.72, montant: 160000 },
      tva_taux: 19,
      montant_ht: 160000,
      montant_tva: 30400,
      montant_ttc: 190400,
    };
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const lignes = await lignesPdf(pdfjs as never, await genererFacture(d));
    const r = detecter(lignes, "facture 014.pdf", [], SOI);
    expect(r).toMatchObject({
      type: "facture",
      titre: "Facture 014-26",
      date: "2026-05-01",
      facture: { numero: 14, annee: 2026, mois: "2026-04", ht: 160000, tva: 30400, ttc: 190400 },
      client: { nouveau: { nom: "SARL Algeria E-Banking Services", rc: "16/00-0000000 B 00", nif: "000000000000001" } },
    });
    // Client déjà connu : rattaché, pas recréé
    expect(detecter(lignes, "f.pdf", [{ id: "c1", nom: "AEBS", raison_sociale_facture: "SARL Algeria E-Banking Services" }], SOI).client).toEqual({ id: "c1" });
  });

  it("classe NDA, contrat, documents légaux ; un scan sans texte reste à compléter", () => {
    const nda = detecter(["ACCORD DE CONFIDENTIALITÉ", "Entre :", "SARL CENTRAL TEST APPLICATION", "Et :", "SPA Sonatrach Digital", "Fait à Alger le 12/03/2025"], "NDA Sonatrach.pdf", [], SOI);
    expect(nda).toMatchObject({ type: "nda", client: { nouveau: { nom: "SPA Sonatrach Digital" } }, date: "2025-03-12" });
    expect(detecter(["CONTRAT DE PRESTATION DE SERVICES", "EURL Beyn Tech"], "contrat.pdf", [{ id: "b", nom: "Beyn Tech" }], SOI)).toMatchObject({ type: "contrat", client: { id: "b" } });
    expect(detecter(["Extrait du registre de commerce"], "rc.pdf", [], SOI)).toMatchObject({ type: "registre_commerce", client: null });
    expect(detecter(["CNAS", "Attestation de mise à jour"], "x.pdf", [], SOI).type).toBe("social");
    expect(detecter([], "Statuts CTA.pdf", [], SOI)).toMatchObject({ type: "autre", texte: false, titre: "Statuts CTA" });
    expect(detecter([], "NDA-Client.pdf", [], SOI).type).toBe("nda");
  });
});

describe("coffre : routes", () => {
  let sql: Sql;
  let founder: Awaited<ReturnType<typeof creerProfil>>;
  let comptable: Awaited<ReturnType<typeof creerProfil>>;
  let qa: Awaited<ReturnType<typeof creerProfil>>;
  let collab: Awaited<ReturnType<typeof creerProfil>>;
  const fichiers = new Map<string, InfosFichier>();
  const supprimes: string[] = [];

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    definirStockage({
      jetonEnvoi: async (chemin) => `jeton:${chemin}`,
      infos: async (chemin) => fichiers.get(chemin) ?? null,
      lienLecture: async (chemin) => `https://stockage.test/${chemin}?signature=x`,
      supprimer: async (chemin) => void supprimes.push(chemin),
    });
    founder = await creerProfil(sql, "cofounder");
    comptable = await creerProfil(sql, "comptable");
    qa = await creerProfil(sql, "qa_manager");
    collab = await creerProfil(sql, "collaborateur");
  });
  afterAll(() => definirStockage(null));

  /** Simule l'envoi direct du navigateur vers le store. */
  async function deposer(cookie: string, usage: string, nom = "doc.pdf", type = "application/pdf") {
    const j = await appeler("POST", "coffre/jeton", { cookie, corps: { usage, nom, type, taille: 1000 } });
    if (j.status !== 200) return j;
    fichiers.set(j.data.chemin, { taille: 1000, type });
    return j;
  }

  it("onglet Documents : Co-Founder et Comptable par défaut, pas un Collaborateur ni un QA Manager", async () => {
    expect((await appeler("GET", "coffre", { cookie: comptable.cookie })).status).toBe(200);
    expect((await appeler("GET", "coffre", { cookie: founder.cookie })).status).toBe(200);
    expect((await appeler("GET", "coffre", { cookie: collab.cookie })).status).toBe(403);
    expect((await appeler("GET", "coffre", { cookie: qa.cookie })).status).toBe(403);
    expect((await appeler("POST", "coffre/jeton", { cookie: collab.cookie, corps: { usage: "documents", nom: "a.pdf", type: "application/pdf", taille: 10 } })).status).toBe(403);
  });

  it("jeton : formats et taille contrôlés, chemin propre à l'usage", async () => {
    expect((await appeler("POST", "coffre/jeton", { cookie: comptable.cookie, corps: { usage: "documents", nom: "a.exe", type: "application/x-msdownload", taille: 10 } })).status).toBe(415);
    expect((await appeler("POST", "coffre/jeton", { cookie: comptable.cookie, corps: { usage: "documents", nom: "a.pdf", type: "application/pdf", taille: 30 * 1024 * 1024 } })).status).toBe(413);
    const j = await deposer(comptable.cookie, "documents", "NDA Société Générale.pdf");
    expect(j.data.chemin).toMatch(/^documents\/\d{4}\/[0-9a-f-]{36}-NDA-Societe-Generale\.pdf$/);
  });

  it("enregistre un NDA en créant le client (archivé), le relit par lien signé et trace l'ouverture", async () => {
    const j = await deposer(comptable.cookie, "documents", "nda.pdf");
    // Un fichier jamais déposé, ou d'un autre usage, est refusé
    expect((await appeler("POST", "coffre/documents", { cookie: comptable.cookie, corps: { fichier: j.data.chemin.replace(/[0-9a-f]{8}-/, "00000000-"), categorie: "nda", titre: "NDA" } })).status).toBe(400);
    expect((await appeler("POST", "coffre/documents", { cookie: comptable.cookie, corps: { fichier: "factures/2026/x.pdf", categorie: "nda", titre: "NDA" } })).status).toBe(400);

    const r = await appeler("POST", "coffre/documents", {
      cookie: comptable.cookie,
      corps: { fichier: j.data.chemin, nomFichier: "nda.pdf", categorie: "nda", titre: "NDA Sonatrach Digital", dateDocument: "2025-03-12", nouveauClient: { nom: "SPA Sonatrach Digital", rc: "16/00-123456 B 10" } },
    });
    expect(r.status).toBe(201);
    expect(r.data.clientCree).toBe(true);
    const [client] = await sql`SELECT nom, actif, rc FROM clients WHERE nom = 'SPA Sonatrach Digital'`;
    expect(client).toMatchObject({ actif: false, rc: "16/00-123456 B 10" });

    const liste = await appeler("GET", "coffre", { cookie: comptable.cookie });
    expect(liste.data.documents[0]).toMatchObject({ titre: "NDA Sonatrach Digital", categorie: "nda", client: "SPA Sonatrach Digital", date_document: "2025-03-12", versions_precedentes: 0 });
    expect(liste.data.clients.some((c: { nom: string }) => c.nom === "SPA Sonatrach Digital")).toBe(true);

    const lien = await appeler("GET", `coffre/documents/${r.data.id}/lien`, { cookie: comptable.cookie });
    expect(lien.data.lien).toBe(`https://stockage.test/${j.data.chemin}?signature=x`);
    const h = await appeler("GET", `coffre/documents/${r.data.id}/historique`, { cookie: founder.cookie });
    expect(h.data.consultations).toHaveLength(1);
  });

  it("nouvelle version : l'ancienne reste dans l'historique ; supprimer la nouvelle rétablit l'ancienne", async () => {
    const a = await deposer(comptable.cookie, "documents", "rc-2024.pdf");
    const v1 = await appeler("POST", "coffre/documents", { cookie: comptable.cookie, corps: { fichier: a.data.chemin, categorie: "registre_commerce", titre: "Registre de commerce", expireLe: "2026-12-31" } });
    const b = await deposer(comptable.cookie, "documents", "rc-2026.pdf");
    const v2 = await appeler("POST", "coffre/documents", { cookie: comptable.cookie, corps: { fichier: b.data.chemin, categorie: "registre_commerce", titre: "Registre de commerce", precedentId: v1.data.id } });
    expect(v2.status).toBe(201);
    // On ne remplace pas deux fois la même version
    const c = await deposer(comptable.cookie, "documents", "rc-bis.pdf");
    expect((await appeler("POST", "coffre/documents", { cookie: comptable.cookie, corps: { fichier: c.data.chemin, categorie: "registre_commerce", titre: "RC", precedentId: v1.data.id } })).status).toBe(409);

    let docs = (await appeler("GET", "coffre", { cookie: comptable.cookie })).data.documents.filter((d: { categorie: string }) => d.categorie === "registre_commerce");
    expect(docs).toHaveLength(1);
    expect(docs[0]).toMatchObject({ id: v2.data.id, versions_precedentes: 1 });
    expect((await appeler("GET", `coffre/documents/${v2.data.id}/historique`, { cookie: comptable.cookie })).data.versions).toHaveLength(2);

    // Le Comptable ne supprime pas ; un Co-Founder oui
    expect((await appeler("DELETE", `coffre/documents/${v2.data.id}`, { cookie: comptable.cookie })).status).toBe(403);
    expect((await appeler("DELETE", `coffre/documents/${v2.data.id}`, { cookie: founder.cookie })).status).toBe(200);
    expect(supprimes).toContain(b.data.chemin);
    docs = (await appeler("GET", "coffre", { cookie: comptable.cookie })).data.documents.filter((d: { categorie: string }) => d.categorie === "registre_commerce");
    expect(docs.map((d: { id: string }) => d.id)).toEqual([v1.data.id]);
  });

  it("importe une facture d'avant Cockpit : client créé une seule fois, numérotation continuée, PDF d'origine", async () => {
    const corps = (fichier: string, numero: string) => ({ fichier, numero, dateEmission: "2026-03-02", mois: "2026-02", ht: "100000", tva: 19000, ttc: 119000, nouveauClient: { nom: "SARL Ancien Client", nif: "000111222333444" } });
    const a = await deposer(comptable.cookie, "factures", "f30.pdf");
    const r = await appeler("POST", "coffre/factures", { cookie: comptable.cookie, corps: { ...corps(a.data.chemin, "030-26"), payeeLe: "2026-03-20" } });
    expect(r.status).toBe(201);
    expect(r.data).toMatchObject({ numero: "030-26", clientCree: true });
    const b = await deposer(comptable.cookie, "factures", "f31.pdf");
    const r2 = await appeler("POST", "coffre/factures", { cookie: comptable.cookie, corps: corps(b.data.chemin, "31-2026") });
    expect(r2.data.clientCree).toBe(false);
    expect((await sql`SELECT count(*)::int AS n FROM clients WHERE nom = 'SARL Ancien Client'`)[0]).toEqual({ n: 1 });

    // Doublon, montants incohérents
    const c = await deposer(comptable.cookie, "factures", "f.pdf");
    expect((await appeler("POST", "coffre/factures", { cookie: comptable.cookie, corps: corps(c.data.chemin, "030-26") })).status).toBe(409);
    expect((await appeler("POST", "coffre/factures", { cookie: comptable.cookie, corps: { ...corps(c.data.chemin, "032-26"), ttc: 200000 } })).status).toBe(400);

    const liste = await appeler("GET", "factures", { cookie: comptable.cookie });
    expect(liste.data.prochain).toBe("032-26");
    expect(liste.data.factures.find((f: { numero_affiche: string }) => f.numero_affiche === "030-26")).toMatchObject({ importee: true, client: "SARL Ancien Client", statut: "payee", montant_ttc: 119000 });
    expect((await appeler("GET", `factures/${r.data.id}`, { cookie: comptable.cookie })).data.lien).toContain(a.data.chemin);

    // Une facture importée se retire à tout moment, avec son fichier
    expect((await appeler("DELETE", `factures/${r.data.id}`, { cookie: comptable.cookie })).status).toBe(200);
    expect(supprimes).toContain(a.data.chemin);
    // Sans l'onglet Factures, pas d'import
    expect((await appeler("POST", "coffre/jeton", { cookie: collab.cookie, corps: { usage: "factures", nom: "f.pdf", type: "application/pdf", taille: 10 } })).status).toBe(403);
  });

  it("un vrai PDF de test reste lisible par la détection (fichier du dépôt)", async () => {
    // Garde-fou : la lecture ne plante pas sur une image (aucun texte)
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.create();
    const img = await doc.embedPng(readFileSync(new URL("../../client/public/images/logo-cta-icone.png", import.meta.url)));
    doc.addPage().drawImage(img, { x: 10, y: 10, width: 50, height: 50 });
    expect(await lignesPdf(pdfjs as never, await doc.save())).toEqual([]);
  });
});
