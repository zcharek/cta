// Conversion d'un classeur SheetJS en feuilles de cellules (valeur + lien hypertexte éventuel).
// Le module xlsx est passé en paramètre : chargé à la demande dans le navigateur, importé directement dans les tests.
import type * as XLSX from "xlsx";
import type { Feuille } from "./import.js";

export function feuillesDepuisClasseur(xlsx: typeof XLSX, classeur: XLSX.WorkBook): Feuille[] {
  return classeur.SheetNames.flatMap((nom) => {
    const ws = classeur.Sheets[nom];
    if (!ws?.["!ref"]) return [];
    const plage = xlsx.utils.decode_range(ws["!ref"]);
    const lignes: Feuille["lignes"] = [];
    for (let r = plage.s.r; r <= plage.e.r; r++) {
      const ligne: Feuille["lignes"][number] = [];
      for (let c = plage.s.c; c <= plage.e.c; c++) {
        const cel = ws[xlsx.utils.encode_cell({ r, c })] as XLSX.CellObject | undefined;
        const formule = cel?.f && /HYPERLINK\(\s*"([^"]+)"/i.exec(cel.f)?.[1];
        ligne.push({ v: (cel?.v as Feuille["lignes"][number][number]["v"]) ?? null, lien: cel?.l?.Target || formule || undefined });
      }
      lignes.push(ligne);
    }
    return [{ nom, lignes }];
  });
}
