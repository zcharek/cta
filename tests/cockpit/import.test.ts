import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { beforeAll, describe, expect, it } from "vitest";
import { analyserFeuilles, calculerMiseAJour, cleCabinet, decoderCsv, detecterSeparateur, feuilleDepuisCsv, lireCsv, lireDate, type Analyse } from "../../shared/import";
import { feuillesDepuisClasseur } from "../../shared/import-xlsx";
import type { Sql } from "../../api/_lib/cockpit/db";
import { appeler, creerProfil, preparerBase } from "./outils";

// --- Classeur de test reproduisant les cas de la spécification ---

const ANNUAIRE = [
  ["Annuaire des cabinets vétérinaires – Alger"], // titre au-dessus de l'en-tête
  [],
  ["N°", "Nom de l'établissement", "Vétérinaire(s)", "Commune", "Adresse exacte", "Téléphone 1", "Téléphone 2", "Autres téléphones", "Latitude", "Longitude", "Lien carte (Google Maps)", "Statut", "Notes", "Notes terrain", "Horaires", "Spécialité"],
  [1, "Clinique El Biar", "Dr Amrani", "El Biar", "5 rue Ali Khodja", "0550 12 34 56", "021 92 11 22", "0661 00 11 22", "36,7690", "3,0300", "Voir la carte", "Ouvert", "Parking", "Accueil top", "8h-18h", "Canine"],
  [2, "Cabinet Hydra", "Dr Benali", "Hydra", "12 rue des Pins", "0770 98 76 54", null, null, 36.7468, 3.0368, null, null, null, null, null, "NAC"],
  [3, "Cabinet Hydra", null, "Hydra", null, "0770 98 76 54", null, null, null, null, null, null, "Doublon plus pauvre", null, "9h-17h", null],
  [4, "Vétérinaire Kouba", "Dr Saïdi", "Kouba", null, "021 28 00 00", null, null, null, null, null, "Fermé définitivement", null, null, null, null],
  [5, "Clinique Bab Ezzouar", "Dr Lounes", "Bab Ezzouar", null, "0661 22 33 44", null, null, null, null, null, null, null, null, null, null],
  [6, "TEST Cockpit", "Moi", "Alger", null, "0550 00 00 00", null, null, null, null, null, null, null, null, null, null],
];

const PROSPECTION = [
  ["Nom de l'établissement", "Commune", "Segment", "Semaine", "Canal 1", "Contact canal 1", "Message 1 (à personnaliser)", "Ensuite", "Date 1er contact", "Lien WhatsApp", "Statut"],
  ["Clinique El Biar", "El Biar", "Clinique", "S1", "WhatsApp", "0550 12 34 56", "Bonjour Dr Amrani,\\nVetCare vous intéresse ?", "[Relance J+5]", "20/11/2026", "https://wa.me/ancien", "Message WhatsApp envoyé"],
  ["Cabinet Hydra", "Hydra", "Cabinet", "S2", "WhatsApp", "0770 98 76 54", null, null, null, null, null],
  ["Vétérinaire Kouba", "Kouba", "Cabinet", "S2", "Appel", "021 28 00 00", null, null, null, null, null],
  ["TEST Cockpit", "Alger", "Test", "S0", null, null, null, null, null, null, null],
];

function classeur(): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();
  const ann = XLSX.utils.aoa_to_sheet(ANNUAIRE);
  ann["K4"]!.l = { Target: "https://maps.app.goo.gl/ElBiar" };
  XLSX.utils.book_append_sheet(wb, ann, "Annuaire");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(PROSPECTION), "Prospection");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["Notes diverses"], ["rien"]]), "Brouillon");
  // Aller-retour par un vrai fichier .xlsx, comme dans le navigateur
  const octets = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return XLSX.read(octets, { cellDates: true });
}

const analyser = (wb: XLSX.WorkBook) => analyserFeuilles(feuillesDepuisClasseur(XLSX, wb));
const parNom = (a: Analyse, nom: string) => a.cabinets.find((c) => c.nom === nom)!;

describe("analyse d'un classeur", () => {
  const a = analyser(classeur());

  it("retient les onglets avec une colonne de nom dans les 6 premières lignes", () => {
    expect(a.onglets).toEqual(["Annuaire", "Prospection"]);
  });

  it("donne les bons chiffres : doublon fusionné, ligne de test ignorée, hors cible", () => {
    expect(a.cabinets).toHaveLength(4);
    expect(a.doublons).toEqual(["Cabinet Hydra"]);
    expect(a.testsIgnores).toEqual(["TEST Cockpit"]);
    expect(a.cabinets.filter((c) => c.statut === "hors_cible").map((c) => [c.nom, c.raison_hors_cible])).toEqual([
      ["Vétérinaire Kouba", "Fermé selon Google"],
      ["Clinique Bab Ezzouar", "Absent de l'onglet prospection"],
    ]);
    expect(a.colonnesConservees).toEqual(["Spécialité"]);
  });

  it("fusionne annuaire et prospection, les valeurs de prospection l'emportent", () => {
    const c = parNom(a, "Clinique El Biar");
    expect(c).toMatchObject({
      cle: "cliniqueelbiar-elbiar",
      numero: "1",
      veterinaire: "Dr Amrani",
      telephone: "0550 12 34 56",
      telephone2: "021 92 11 22; 0661 00 11 22",
      lat: 36.769,
      lng: 3.03,
      lien_carte: "https://maps.app.goo.gl/ElBiar",
      notes: "Parking\nAccueil top",
      segment: "Clinique",
      semaine_plan: "S1",
      canal1: "WhatsApp",
      message: "Bonjour Dr Amrani,\nVetCare vous intéresse ?",
      ensuite: "Relance J+5",
      premier_contact: "2026-11-20",
      statut: "message_envoye",
      extra: { Spécialité: "Canine" },
    });
    expect(c).not.toHaveProperty("lien_whatsapp");
  });

  it("le doublon ne complète que les champs vides, et un lien de carte est construit à partir des coordonnées", () => {
    const h = parNom(a, "Cabinet Hydra");
    expect(h).toMatchObject({ veterinaire: "Dr Benali", horaires: "9h-17h", notes: "Doublon plus pauvre", lien_carte: "https://www.google.com/maps?q=36.7468,3.0368" });
  });

  it("le statut « Fermé » va dans l'état Google", () => {
    expect(parNom(a, "Vétérinaire Kouba").etat_google).toBe("Fermé définitivement");
  });
});

describe("CSV", () => {
  it("décode l'UTF-8, sinon Windows-1252 ou Mac Roman selon les accents", () => {
    expect(decoderCsv(new TextEncoder().encode("﻿Nom;Commune\nÉté;Béjaïa")).encodage).toBe("UTF-8");
    const win = Uint8Array.from([0x4e, 0x6f, 0x6d, 0x0a, 0xc9, 0x74, 0xe9, 0x20, 0xe0, 0x20, 0xe7, 0x61]); // « Été à ça » en Windows-1252
    expect(decoderCsv(win)).toEqual({ texte: "Nom\nÉté à ça", encodage: "Windows-1252" });
    const mac = Uint8Array.from([0x4e, 0x6f, 0x6d, 0x0a, 0x83, 0x74, 0x8e, 0x20, 0x88, 0x20, 0x8d, 0x61]); // « Été à ça » en Mac Roman
    expect(decoderCsv(mac)).toEqual({ texte: "Nom\nÉté à ça", encodage: "Mac Roman" });
  });

  it("détecte le séparateur et gère les guillemets", () => {
    expect(detecterSeparateur('Nom;Commune;"a,b,c"\n1;2;3')).toBe(";");
    expect(detecterSeparateur("Nom,Commune\n")).toBe(",");
    expect(detecterSeparateur("Nom\tCommune\tX\n")).toBe("\t");
    expect(lireCsv('a;"b;c";"d ""e"""\r\n"f\ng";h;\n\n', ";")).toEqual([
      ["a", "b;c", 'd "e"'],
      ["f\ng", "h", ""],
    ]);
  });

  it("avertit quand l'export a perdu les caractères arabes", () => {
    const csv = "Nom de l'établissement;Commune\nعيادة;Alger\n";
    const perdu = new TextEncoder().encode(csv.replace("عيادة", "Cabinet ___"));
    const { feuille } = feuilleDepuisCsv(perdu);
    expect(analyserFeuilles([feuille]).avertissements[0]).toContain("caractères arabes");
  });

  it("dates jj/mm/aaaa et numéros de série Excel", () => {
    expect(lireDate({ v: "05/03/2026" })).toBe("2026-03-05");
    expect(lireDate({ v: "5/3/2026" })).toBe("2026-03-05");
    expect(lireDate({ v: 46086 })).toBe("2026-03-05");
    expect(lireDate({ v: "pas une date" })).toBeNull();
  });

  it("la clé ignore accents, casse et ponctuation ; à défaut de commune, le téléphone", () => {
    expect(cleCabinet("Clinique Vétérinaire d'El-Biar", "EL BIAR", null)).toBe("cliniqueveterinairedelbiar-elbiar");
    expect(cleCabinet("Cabinet X", null, "+213 550 12 34 56")).toBe("cabinetx-t550123456");
    expect(cleCabinet("عيادة", "Alger", null)).toBe("عيادة-alger");
  });
});

describe("mise à jour des cabinets déjà importés", () => {
  const base = { cle: "k", nom: "Cabinet", statut: "a_contacter" as const, raison_hors_cible: null, extra: {} };

  it("ignore casse, ponctuation et préfixe Dr", () => {
    expect(calculerMiseAJour({ nom: "Cabinet", veterinaire: "Dr. Amrani", telephone: "0550 12 34 56" }, { ...base, veterinaire: "amrani", telephone: "0550-12-34-56" })).toBeNull();
  });
  it("ne remplace jamais par un texte avec « ___ » ni un vrai lien de carte par un lien recalculé", () => {
    expect(calculerMiseAJour({ nom: "Cabinet", veterinaire: "د. أحمد", lien_carte: "https://maps.app.goo.gl/x" }, { ...base, veterinaire: "___", lien_carte: "https://www.google.com/maps?q=1,2" })).toBeNull();
    expect(calculerMiseAJour({ nom: "Cabinet", lien_carte: "https://www.google.com/maps?q=1,2" }, { ...base, lien_carte: "https://maps.app.goo.gl/y" })).toEqual({ lien_carte: "https://maps.app.goo.gl/y" });
  });
  it("ne touche jamais au statut ni aux dates, et ne complète les notes que si elles sont vides", () => {
    expect(
      calculerMiseAJour(
        { nom: "Cabinet", statut: "relance", relance_le: "2026-11-01", notes: "Mes notes", horaires: null },
        { ...base, statut: "hors_cible", relance_le: "2026-12-01", premier_contact: "2026-10-01", notes: "Autres", horaires: "8h-12h" },
      ),
    ).toEqual({ horaires: "8h-12h" });
  });
  it("complète « extra » sans perdre les clés existantes", () => {
    expect(calculerMiseAJour({ nom: "Cabinet", extra: { a: "1" } }, { ...base, extra: { b: "2" } })).toEqual({ extra: { a: "1", b: "2" } });
  });
});

describe("API d'import", () => {
  let sql: Sql;
  let admin: Awaited<ReturnType<typeof creerProfil>>;

  beforeAll(async () => {
    ({ sql } = await preparerBase());
    admin = await creerProfil(sql, "qa_manager");
  });

  const importer = async (a: Analyse, mettreAJour = false) => {
    const total = { crees: 0, misAJour: 0 };
    for (let i = 0; i < a.cabinets.length; i += 2) {
      const r = await appeler("POST", "import/lot", { cookie: admin.cookie, corps: { cabinets: a.cabinets.slice(i, i + 2), mettreAJour } });
      expect(r.status).toBe(200);
      total.crees += r.data.crees;
      total.misAJour += r.data.misAJour;
    }
    return total;
  };

  it("prévisualise puis importe par lots", async () => {
    const a = analyser(classeur());
    const apercu = await appeler("POST", "import/analyser", { cookie: admin.cookie, corps: { cabinets: a.cabinets } });
    expect(apercu.data).toMatchObject({ nouveaux: 4, nouveauxHorsCible: 2, aMettreAJour: 0, identiques: 0 });
    expect(await importer(a)).toEqual({ crees: 4, misAJour: 0 });

    const [c] = await sql`SELECT statut, premier_contact::text AS pc, extra, lat FROM cabinets WHERE cle = 'cliniqueelbiar-elbiar'`;
    expect(c).toMatchObject({ statut: "message_envoye", pc: "2026-11-20", extra: { Spécialité: "Canine" }, lat: 36.769 });
    const [h] = await sql`SELECT count(*)::int AS n FROM historique_cabinet WHERE action = 'Importé'`;
    expect(h!.n).toBe(4);
  });

  it("réimporter le même fichier ne crée rien et tout est identique", async () => {
    const apercu = await appeler("POST", "import/analyser", { cookie: admin.cookie, corps: { cabinets: analyser(classeur()).cabinets } });
    expect(apercu.data).toMatchObject({ nouveaux: 0, aMettreAJour: 0, identiques: 4 });
  });

  it("le CSV du même fichier (Windows-1252, « ; », arabe perdu) donne 0 nouveau cabinet", async () => {
    const lignes = ANNUAIRE.slice(2).map((l) => l.map((v) => (v === null || v === undefined ? "" : String(v).includes(";") ? `"${v}"` : String(v))).join(";"));
    lignes[2] = lignes[2]!.replace("Dr Benali", "Dr Benali ___");
    const octets = Uint8Array.from([...lignes.join("\r\n")].map((ch) => ch.charCodeAt(0) < 256 ? ch.charCodeAt(0) : 0x3f));
    const { feuille, encodage, separateur } = feuilleDepuisCsv(octets);
    expect([encodage, separateur]).toEqual(["Windows-1252", ";"]);
    const a = analyserFeuilles([feuille]);
    expect(a.avertissements).toHaveLength(1);
    const apercu = await appeler("POST", "import/analyser", { cookie: admin.cookie, corps: { cabinets: a.cabinets } });
    expect(apercu.data.nouveaux).toBe(0);
  });

  it("la mise à jour est une option et ne touche ni au statut, ni aux dates, ni à l'historique", async () => {
    const [cab] = await sql`SELECT id FROM cabinets WHERE cle = 'cabinethydra-hydra'`;
    await appeler("POST", `cabinets/${cab!.id}/statut`, { cookie: admin.cookie, corps: { statut: "en_discussion" } });
    const avant = await sql`SELECT count(*)::int AS n FROM historique_cabinet WHERE cabinet_id = ${cab!.id}`;

    const a = analyser(classeur());
    const hydra = a.cabinets.find((c) => c.nom === "Cabinet Hydra")!;
    hydra.horaires = "8h-20h";
    hydra.extra = { ...hydra.extra, Parking: "Oui" };
    const apercu = await appeler("POST", "import/analyser", { cookie: admin.cookie, corps: { cabinets: a.cabinets } });
    expect(apercu.data).toMatchObject({ nouveaux: 0, aMettreAJour: 1, identiques: 3 });
    expect(apercu.data.exemplesMiseAJour).toEqual([{ nom: "Cabinet Hydra", champs: ["horaires", "extra"] }]);

    expect(await importer(a, false)).toEqual({ crees: 0, misAJour: 0 });
    expect(await importer(a, true)).toEqual({ crees: 0, misAJour: 1 });
    const [apres] = await sql`SELECT horaires, statut, extra FROM cabinets WHERE id = ${cab!.id}`;
    expect(apres).toMatchObject({ horaires: "8h-20h", statut: "en_discussion", extra: { Spécialité: "NAC", Parking: "Oui" } });
    expect(await sql`SELECT count(*)::int AS n FROM historique_cabinet WHERE cabinet_id = ${cab!.id}`).toEqual(avant);
  });

  it("refuse un lot invalide", async () => {
    expect((await appeler("POST", "import/lot", { cookie: admin.cookie, corps: { cabinets: [{ nom: "" }] } })).status).toBe(400);
    expect((await appeler("POST", "import/lot", { cookie: admin.cookie, corps: { cabinets: "x" } })).status).toBe(400);
  });
});

// Test de référence du prompt : actif dès que fixtures/Veterinaires_Alger.xlsx est déposé dans le dépôt.
const REFERENCE = path.resolve(__dirname, "../../fixtures/Veterinaires_Alger.xlsx");
const REFERENCE_CSV = path.resolve(__dirname, "../../fixtures/Veterinaires_Alger.csv");

describe.skipIf(!existsSync(REFERENCE))("fichier de référence Veterinaires_Alger.xlsx", () => {
  it("362 cabinets (334 À contacter, 28 Hors cible), 3 doublons fusionnés, 1 ligne de test ignorée", () => {
    const a = analyser(XLSX.read(readFileSync(REFERENCE), { cellDates: true }));
    expect(a.cabinets).toHaveLength(362);
    expect(a.cabinets.filter((c) => c.statut === "a_contacter")).toHaveLength(334);
    expect(a.cabinets.filter((c) => c.statut === "hors_cible")).toHaveLength(28);
    expect(a.doublons).toHaveLength(3);
    expect(a.testsIgnores).toHaveLength(1);
  });

  it.skipIf(!existsSync(REFERENCE_CSV))("réimporter le CSV du même fichier donne 0 nouveau cabinet", async () => {
    const { sql } = await preparerBase();
    const admin = await creerProfil(sql, "cofounder");
    const a = analyser(XLSX.read(readFileSync(REFERENCE), { cellDates: true }));
    for (let i = 0; i < a.cabinets.length; i += 100)
      await appeler("POST", "import/lot", { cookie: admin.cookie, corps: { cabinets: a.cabinets.slice(i, i + 100) } });
    const csv = analyserFeuilles([feuilleDepuisCsv(readFileSync(REFERENCE_CSV)).feuille]);
    const r = await appeler("POST", "import/analyser", { cookie: admin.cookie, corps: { cabinets: csv.cabinets } });
    expect(r.data.nouveaux).toBe(0);
  });
});
