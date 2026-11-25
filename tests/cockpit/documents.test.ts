// Attestation et certificat de travail, poste saisi à la création, bulletins accessibles à leur titulaire.
import { PDFDocument } from "pdf-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { genererDocumentRh, nomFichierDocumentRh, paragraphesDocument, type DonneesDocumentRh } from "../../shared/documents-rh";
import { appeler, creerProfil, preparerBase } from "./outils";

let sql: Sql;
let rh: Awaited<ReturnType<typeof creerProfil>>;
let karim: Awaited<ReturnType<typeof creerProfil>>;

beforeAll(async () => {
  ({ sql } = await preparerBase());
  process.env.ENTREPRISE_CTA = JSON.stringify({ raison_sociale: "SARL CENTRAL TEST APPLICATION", siege: "Draria, Alger", rc: "16/00-1111111 B 25", nif: "000000000000002", ville: "Alger" });
  rh = await creerProfil(sql, "cofounder");
  karim = await creerProfil(sql, "collaborateur", { nom: "Karim Benali" });
});
afterAll(() => {
  delete process.env.ENTREPRISE_CTA;
});

describe("poste du collaborateur", () => {
  it("se saisit à la création et se modifie ensuite", async () => {
    const r = await appeler("POST", "collaborateurs", { cookie: rh.cookie, corps: { nom: "Sara Haddad", email: "sara@cta.test", role: "collaborateur", fonction: "Ingénieure QA" } });
    expect(r.status).toBe(201);
    expect((await sql`SELECT fonction FROM profils WHERE id = ${r.data.id}`)[0]).toMatchObject({ fonction: "Ingénieure QA" });
    await appeler("PATCH", `collaborateurs/${r.data.id}`, { cookie: rh.cookie, corps: { fonction: "Lead QA" } });
    const liste = await appeler("GET", "collaborateurs", { cookie: rh.cookie });
    expect(liste.data.collaborateurs.find((c: { id: string }) => c.id === r.data.id)).toMatchObject({ fonction: "Lead QA" });
  });
});

describe("attestation et certificat de travail", () => {
  it("indique ce qui manque, puis se génère depuis Mon profil", async () => {
    const vide = await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: {} });
    expect(vide.status).toBe(409);
    expect(vide.data.erreur ?? vide.data.message ?? JSON.stringify(vide.data)).toMatch(/date de naissance, lieu de naissance, fonction/);

    await appeler("PATCH", "profil", { cookie: karim.cookie, corps: { civilite: "M", date_naissance: "1990-04-12", lieu_naissance: "Bab El Oued, Alger" } });
    // La fonction est renseignée par l'administration, pas par le salarié
    expect((await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: { fonction: "Directeur" } })).status).toBe(403);
    await appeler("PATCH", `collaborateurs/${karim.id}`, { cookie: rh.cookie, corps: { fonction: "Ingénieur logiciel" } });

    const r = await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: {} });
    expect(r.status).toBe(200);
    expect(r.data.donnees).toMatchObject({ type: "attestation", salarie: { nom: "Karim Benali", civilite: "M", fonction: "Ingénieur logiciel", date_naissance: "1990-04-12" }, entreprise: { raison_sociale: "SARL CENTRAL TEST APPLICATION" } });
    const texte = paragraphesDocument(r.data.donnees).join(" ");
    expect(texte).toContain("Monsieur KARIM BENALI, né le 12/04/1990 à Bab El Oued, Alger");
    expect(texte).toContain("en qualité d'Ingénieur logiciel, et ce jusqu'à ce jour");

    // Certificat : pas de date de sortie, pas de certificat ; un salarié ne peut pas la fixer lui-même
    expect((await appeler("POST", "documents/certificat", { cookie: karim.cookie, corps: {} })).status).toBe(409);
    expect((await appeler("POST", "documents/certificat", { cookie: karim.cookie, corps: { dateSortie: "2026-12-31" } })).status).toBe(403);
    // Ni les documents d'un autre
    expect((await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: { profilId: rh.id } })).status).toBe(403);
  });

  it("le certificat est généré par l'administration avec la date de sortie, qui est enregistrée", async () => {
    expect((await appeler("POST", "documents/certificat", { cookie: rh.cookie, corps: { profilId: karim.id, dateSortie: "1999-01-01" } })).status).toBe(400);
    const r = await appeler("POST", "documents/certificat", { cookie: rh.cookie, corps: { profilId: karim.id, dateSortie: "2026-12-31" } });
    expect(r.status).toBe(200);
    expect(r.data.donnees.salarie.date_sortie).toBe("2026-12-31");
    const texte = paragraphesDocument(r.data.donnees).join(" ");
    expect(texte).toMatch(/a été employé au sein de notre société du \d{2}\/\d{2}\/\d{4} au 31\/12\/2026, en qualité d'Ingénieur logiciel\./);
    expect(texte).toContain("Il nous quitte libre de tout engagement.");
    // Le salarié peut ensuite le télécharger lui-même
    expect((await appeler("POST", "documents/certificat", { cookie: karim.cookie, corps: {} })).status).toBe(200);
    expect((await appeler("GET", "mes-documents", { cookie: karim.cookie })).data).toMatchObject({ manquants: { attestation: [], certificat: [] }, dateSortie: "2026-12-31" });
  });

  it("accorde au féminin et en forme épicène sans civilité", () => {
    const base: DonneesDocumentRh = {
      type: "attestation",
      date: "2026-11-25",
      entreprise: { raison_sociale: "SARL TEST", siege: "Alger" },
      salarie: { civilite: "Mme", nom: "Sara Haddad", matricule: "009", date_naissance: "1995-02-01", lieu_naissance: "Oran", numero_ss: null, fonction: "Ingénieure QA", date_entree: "2026-01-04", date_sortie: null },
    };
    expect(paragraphesDocument(base)[0]).toContain("Madame SARA HADDAD, née le 01/02/1995 à Oran, matricule 009, est employée");
    expect(paragraphesDocument(base)[1]).toContain("à l'intéressée");
    expect(paragraphesDocument({ ...base, salarie: { ...base.salarie, fonction: "Testeuse" } })[0]).toContain("en qualité de Testeuse");
    expect(paragraphesDocument(base)[0]).toMatch(/^Nous soussignés, SARL TEST \(siège social : Alger\), attestons/);
    expect(paragraphesDocument({ ...base, salarie: { ...base.salarie, civilite: null } })[0]).toContain("M. / Mme SARA HADDAD, né(e)");
  });

  it("produit un PDF d'une page", async () => {
    const r = await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: {} });
    const octets = await genererDocumentRh(r.data.donnees, process.env.DOCUMENT_SORTIE ? new Uint8Array((await import("node:fs")).readFileSync(new URL("../../client/public/images/logo-cta-icone.png", import.meta.url))) : undefined);
    expect((await PDFDocument.load(octets)).getPageCount()).toBe(1);
    expect(nomFichierDocumentRh(r.data.donnees)).toMatch(/^Attestation_de_travail_Karim-Benali_\d{4}-\d{2}-\d{2}\.pdf$/);
    if (process.env.DOCUMENT_SORTIE) (await import("node:fs")).writeFileSync(process.env.DOCUMENT_SORTIE, octets);
  });
});

describe("bulletins de paie du salarié", () => {
  it("chacun télécharge les siens, jamais ceux d'un autre", async () => {
    const [b] = await sql`INSERT INTO bulletins (profil_id, mois, brut, retenue_ss, irg, net, donnees) VALUES (${karim.id}, '2026-10', 100, 9, 0, 91, '{"mois":"2026-10"}'::jsonb) RETURNING id`;
    const mes = await appeler("GET", "mes-documents", { cookie: karim.cookie });
    expect(mes.data.bulletins).toEqual([{ id: b!.id, mois: "2026-10", net: 91 }]);
    expect((await appeler("GET", `mes-documents/bulletins/${b!.id}`, { cookie: karim.cookie })).data.donnees).toEqual({ mois: "2026-10" });
    expect((await appeler("GET", `mes-documents/bulletins/${b!.id}`, { cookie: rh.cookie })).status).toBe(404);
  });
});

describe("tampon et signature", () => {
  it("lus en base (jamais dans le dépôt), réservés aux utilisateurs connectés, apposés sur les documents", async () => {
    expect((await appeler("GET", "cachet")).status).toBe(401);
    expect((await appeler("GET", "cachet", { cookie: karim.cookie })).data).toEqual({ png: null });
    // Image de test : le logo tient lieu de tampon
    const { readFileSync } = await import("node:fs");
    const image = readFileSync(new URL("../../client/public/images/logo-cta-icone.png", import.meta.url));
    await sql`INSERT INTO parametres (cle, valeur) VALUES ('cachet', ${JSON.stringify({ png: image.toString("base64") })}::jsonb)`;
    const r = await appeler("GET", "cachet", { cookie: karim.cookie });
    expect(r.data.png).toBe(image.toString("base64"));
    const d = (await appeler("POST", "documents/attestation", { cookie: karim.cookie, corps: {} })).data.donnees;
    const sans = await genererDocumentRh(d);
    const avec = await genererDocumentRh(d, undefined, new Uint8Array(image));
    expect(avec.length).toBeGreaterThan(sans.length + image.length / 2);
  });
});
