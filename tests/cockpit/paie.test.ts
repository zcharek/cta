// Bulletins de paie : calcul net → brut (modèle de novembre 2025), données reprises d'un mois sur l'autre, PDF.
import { readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { beforeAll, describe, expect, it } from "vitest";
import type { Sql } from "../../api/_lib/cockpit/db";
import { genererBulletin, irgMensuel, montantPaie, moisBulletin, nomFichierBulletin, paieDepuisBrut, paieDepuisNet } from "../../shared/paie";
import { appeler, creerProfil, preparerBase } from "./outils";

describe("calcul de la paie", () => {
  it("reproduit le bulletin modèle : 80 000,00 net ← 109 730,77 brut", () => {
    expect(paieDepuisNet(80000)).toEqual({ brut: 109730.77, retenueSs: 9875.77, imposable: 99855, irg: 19855, net: 80000 });
  });

  it("IRG : exonération, lissage et barème", () => {
    expect(irgMensuel(30000)).toBe(0);
    expect(irgMensuel(99855)).toBe(19855); // imposable arrondi à 99 850
    expect(irgMensuel(40000)).toBe(3100); // 4 600 - abattement plafonné à 1 500
    expect(irgMensuel(32000)).toBeGreaterThan(0);
    expect(irgMensuel(32000)).toBeLessThan(irgMensuel(36000));
  });

  it("le brut trouvé est le plus petit qui donne le net", () => {
    for (const net of [35000, 52000, 80000, 150000, 400000]) {
      const p = paieDepuisNet(net);
      expect(p.net).toBeGreaterThanOrEqual(net);
      expect(paieDepuisBrut(p.brut - 0.01).net).toBeLessThan(net);
    }
  });

  it("formats", () => {
    expect(montantPaie(109730.77)).toBe("109 730,77");
    expect(moisBulletin("2025-11")).toBe("NOVEMBRE 2025");
  });
});

describe("génération des bulletins", () => {
  let sql: Sql;
  let rh: string;
  let omar: Awaited<ReturnType<typeof creerProfil>>;

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    rh = (await creerProfil(sql, "cofounder")).cookie;
    omar = await creerProfil(sql, "collaborateur", { nom: "BENALI KARIM" });
    // Le salarié renseigne lui-même ses informations de paie
    await appeler("PATCH", "profil", { cookie: omar.cookie, corps: { situation_familiale: "C", numero_ss: "1234567890 12", numero_compte: "00799999001234567890" } });
  });

  it("premier bulletin : N° adhérent, matricule et fonction obligatoires, puis repris", async () => {
    const sansAdherent = await appeler("POST", "paie/bulletins", { cookie: rh, corps: { profilId: omar.id, mois: "2025-11", net: "80 000", matricule: "002", fonction: "Ingénieur logiciel" } });
    expect(sansAdherent.status).toBe(400);

    const r = await appeler("POST", "paie/bulletins", {
      cookie: rh,
      corps: { profilId: omar.id, mois: "2025-11", net: "80 000", numeroAdherent: "12345678 90", matricule: "002", fonction: "Ingénieur logiciel", dateEntree: "2025-10-06" },
    });
    expect(r.status).toBe(201);
    expect(r.data.donnees).toMatchObject({
      entreprise: { raison_sociale: "SARL CENTRAL TEST APPLICATION", numero_adherent: "12345678 90" },
      salarie: { matricule: "002", nom: "BENALI KARIM", situation_familiale: "C", fonction: "Ingénieur logiciel", date_entree: "2025-10-06", numero_ss: "1234567890 12", numero_compte: "00799999001234567890" },
      paie: { brut: 109730.77, retenueSs: 9875.77, irg: 19855, net: 80000 },
    });

    // Mois suivant : tout est repris, rien à ressaisir
    const liste = await appeler("GET", "paie", { cookie: rh });
    expect(liste.data.numeroAdherent).toBe("12345678 90");
    expect(liste.data.salaries.find((s: { id: string }) => s.id === omar.id)).toMatchObject({ matricule: "002", fonction: "Ingénieur logiciel", salaire_net: 80000 });
    expect(liste.data.prochainMatricule).toBe("003");

    // Regénérer le même mois remplace le bulletin
    await appeler("POST", "paie/bulletins", { cookie: rh, corps: { profilId: omar.id, mois: "2025-11", net: 85000, matricule: "002", fonction: "Ingénieur logiciel" } });
    const [{ n }] = (await sql`SELECT count(*)::int AS n FROM bulletins WHERE profil_id = ${omar.id}`) as [{ n: number }];
    expect(n).toBe(1);
  });

  it("matricule unique ; réservé à l'onglet Bulletins de paie (pas un Assistant par défaut)", async () => {
    const autre = await creerProfil(sql, "collaborateur");
    expect((await appeler("POST", "paie/bulletins", { cookie: rh, corps: { profilId: autre.id, mois: "2025-11", net: 50000, matricule: "002", fonction: "Testeur" } })).status).toBe(409);
    expect((await appeler("GET", "paie", { cookie: omar.cookie })).status).toBe(403);
    const assistant = await creerProfil(sql, "assistant");
    expect((await appeler("GET", "paie", { cookie: assistant.cookie })).status).toBe(403);
  });

  it("produit un PDF d'une page", async () => {
    const r = await appeler("POST", "paie/bulletins", { cookie: rh, corps: { profilId: omar.id, mois: "2025-12", net: 80000, matricule: "002", fonction: "Ingénieur logiciel" } });
    const logo = new Uint8Array(readFileSync(new URL("../../client/public/images/logo-cta-icone.png", import.meta.url)));
    expect(r.data.donnees.salarie.date_entree).toBe("2025-10-06"); // repris sans être renvoyé
    const octets = await genererBulletin(r.data.donnees, logo);
    expect((await PDFDocument.load(octets)).getPageCount()).toBe(1);
    expect(nomFichierBulletin(r.data.donnees)).toBe("Bulletin_2025-12_BENALI-KARIM.pdf");
    if (process.env.BULLETIN_SORTIE) (await import("node:fs")).writeFileSync(process.env.BULLETIN_SORTIE, octets);
  });
});
