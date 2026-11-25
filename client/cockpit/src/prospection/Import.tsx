import { useState } from "react";
import { analyserFeuilles, feuilleDepuisCsv, type Analyse } from "../../../../shared/import";
import { feuillesDepuisClasseur } from "../../../../shared/import-xlsx";
import { api } from "../api";
import { Bouton, Erreur, Info, Modale } from "../ui";

const TAILLE_LOT = 50;

type Apercu = { nouveaux: number; nouveauxHorsCible: number; aMettreAJour: number; identiques: number; exemplesMiseAJour: { nom: string; champs: string[] }[] };

function Chiffre({ valeur, libelle, detail }: { valeur: number; libelle: string; detail?: string }) {
  return (
    <div className="rounded-xl bg-ck-surface-2 p-4">
      <p className="ck-titre text-3xl">{valeur}</p>
      <p className="text-sm font-semibold text-ck-titre">{libelle}</p>
      {detail && <p className="text-xs text-ck-texte-2">{detail}</p>}
    </div>
  );
}

function Liste({ titre, elements }: { titre: string; elements: string[] }) {
  if (!elements.length) return null;
  return (
    <details className="rounded-lg border border-ck-bordure px-3 py-2 text-sm">
      <summary className="cursor-pointer font-semibold text-ck-titre">
        {titre} ({elements.length})
      </summary>
      <ul className="mt-2 list-disc pl-5 text-ck-texte-2">
        {elements.map((e, i) => (
          <li key={i}>{e}</li>
        ))}
      </ul>
    </details>
  );
}

/** Lit un .xlsx, .xls ou .csv et le transforme en cabinets. */
async function lireFichier(fichier: File): Promise<Analyse & { format: string }> {
  const octets = new Uint8Array(await fichier.arrayBuffer());
  if (/\.csv$/i.test(fichier.name) || fichier.type === "text/csv") {
    const { feuille, encodage, separateur } = feuilleDepuisCsv(octets, fichier.name);
    const sep = separateur === "\t" ? "tabulation" : `« ${separateur} »`;
    return { ...analyserFeuilles([feuille]), format: `CSV, ${encodage}, séparateur ${sep}` };
  }
  const XLSX = await import("xlsx");
  const classeur = XLSX.read(octets, { cellDates: true });
  return { ...analyserFeuilles(feuillesDepuisClasseur(XLSX, classeur)), format: "Classeur Excel" };
}

export default function ImportCabinets({ onFermer }: { onFermer: (importe: boolean) => void }) {
  const [analyse, setAnalyse] = useState<(Analyse & { format: string; fichier: string }) | null>(null);
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [mettreAJour, setMettreAJour] = useState(false);
  const [erreur, setErreur] = useState("");
  const [etape, setEtape] = useState<"choix" | "lecture" | "apercu" | "import" | "fini">("choix");
  const [progression, setProgression] = useState(0);
  const [bilan, setBilan] = useState({ crees: 0, misAJour: 0 });

  async function choisir(fichier: File | undefined) {
    if (!fichier) return;
    setErreur("");
    setEtape("lecture");
    try {
      const a = await lireFichier(fichier);
      setAnalyse({ ...a, fichier: fichier.name });
      // Comparaison par paquets : la taille d'une requête est limitée (4,5 Mo sur Vercel).
      const total: Apercu = { nouveaux: 0, nouveauxHorsCible: 0, aMettreAJour: 0, identiques: 0, exemplesMiseAJour: [] };
      for (let i = 0; i < a.cabinets.length; i += 500) {
        const r = await api<Apercu>("import/analyser", { corps: { cabinets: a.cabinets.slice(i, i + 500) } });
        total.nouveaux += r.nouveaux;
        total.nouveauxHorsCible += r.nouveauxHorsCible;
        total.aMettreAJour += r.aMettreAJour;
        total.identiques += r.identiques;
        total.exemplesMiseAJour.push(...r.exemplesMiseAJour.slice(0, 20 - total.exemplesMiseAJour.length));
      }
      setApercu(total);
      setEtape("apercu");
    } catch (e) {
      setErreur((e as Error).message || "Ce fichier n'a pas pu être lu.");
      setEtape("choix");
    }
  }

  async function importer() {
    if (!analyse) return;
    setEtape("import");
    setProgression(0);
    const total = { crees: 0, misAJour: 0 };
    try {
      for (let i = 0; i < analyse.cabinets.length; i += TAILLE_LOT) {
        const r = await api<{ crees: number; misAJour: number }>("import/lot", { corps: { cabinets: analyse.cabinets.slice(i, i + TAILLE_LOT), mettreAJour } });
        total.crees += r.crees;
        total.misAJour += r.misAJour;
        setProgression(Math.min(analyse.cabinets.length, i + TAILLE_LOT));
      }
      setBilan(total);
      setEtape("fini");
    } catch (e) {
      setBilan(total);
      setErreur(`${(e as Error).message} L'import s'est arrêté : ${total.crees} cabinet(s) créé(s). Relancer l'import reprendra sans doublon.`);
      setEtape("apercu");
    }
  }

  const fini = etape === "fini";
  const total = analyse?.cabinets.length ?? 0;

  return (
    <Modale
      titre="Importer des cabinets"
      ouverte
      onFermer={() => etape !== "import" && onFermer(fini || bilan.crees > 0)}
      pied={
        fini ? (
          <Bouton onClick={() => onFermer(true)}>Voir les cabinets</Bouton>
        ) : (
          <>
            <Bouton variante="discret" onClick={() => onFermer(bilan.crees > 0)} disabled={etape === "import"}>
              Annuler
            </Bouton>
            {apercu && (
              <Bouton onClick={() => void importer()} disabled={etape !== "apercu" || (apercu.nouveaux === 0 && !(mettreAJour && apercu.aMettreAJour))}>
                Importer
              </Bouton>
            )}
          </>
        )
      }
    >
      <div className="grid gap-4">
        {erreur && <Erreur>{erreur}</Erreur>}

        {(etape === "choix" || etape === "lecture") && (
          <>
            <p className="text-sm text-ck-texte-2">
              Fichier Excel (.xlsx, .xls) ou CSV. Les onglets « annuaire » et « prospection » sont fusionnés ; les cabinets déjà importés sont reconnus par leur nom et leur commune.
            </p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-ck-bordure px-4 py-10 text-center hover:border-ck-orange has-[:focus-visible]:border-ck-orange">
              <span className="font-bold text-ck-titre">{etape === "lecture" ? "Lecture du fichier…" : "Choisir un fichier"}</span>
              <span className="text-xs text-ck-texte-2">.xlsx, .xls ou .csv</span>
              <input
                type="file"
                accept=".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                disabled={etape === "lecture"}
                onChange={(e) => void choisir(e.target.files?.[0])}
              />
            </label>
          </>
        )}

        {analyse && apercu && etape !== "choix" && etape !== "lecture" && (
          <>
            <p className="text-sm text-ck-texte-2">
              <strong className="text-ck-titre">{analyse.fichier}</strong> · {analyse.format} · {total} cabinet{total > 1 ? "s" : ""}
              {analyse.onglets.length > 1 ? ` · onglets ${analyse.onglets.map((o) => `« ${o} »`).join(" et ")}` : ""}
            </p>
            {analyse.avertissements.map((a) => (
              <div key={a} role="alert" className="rounded-[10px] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
                {a}
              </div>
            ))}
            <div className="grid gap-3 sm:grid-cols-3">
              <Chiffre valeur={apercu.nouveaux} libelle="nouveaux" detail={apercu.nouveauxHorsCible ? `dont ${apercu.nouveauxHorsCible} hors cible` : undefined} />
              <Chiffre valeur={apercu.aMettreAJour} libelle="à mettre à jour" detail="déjà importés, infos différentes" />
              <Chiffre valeur={apercu.identiques} libelle="identiques" detail="déjà importés" />
            </div>
            <Liste titre="Doublons fusionnés" elements={analyse.doublons} />
            <Liste titre="Lignes de test ignorées" elements={analyse.testsIgnores} />
            <Liste titre="Colonnes conservées (infos complémentaires)" elements={analyse.colonnesConservees} />
            <Liste titre="Exemples de mises à jour" elements={apercu.exemplesMiseAJour.map((m) => `${m.nom} : ${m.champs.join(", ")}`)} />
            {apercu.aMettreAJour > 0 && (
              <label className="flex items-start gap-3 rounded-[10px] border border-ck-bordure p-3 text-sm">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#071538]" checked={mettreAJour} onChange={(e) => setMettreAJour(e.target.checked)} disabled={etape !== "apercu"} />
                <span>
                  <strong className="text-ck-titre">Mettre à jour les {apercu.aMettreAJour} cabinets déjà importés.</strong>
                  <span className="block text-ck-texte-2">Le statut, les dates et l'historique ne sont jamais modifiés.</span>
                </span>
              </label>
            )}
          </>
        )}

        {(etape === "import" || fini) && analyse && (
          <div>
            <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={fini ? total : progression} aria-label="Progression de l'import" className="h-3 overflow-hidden rounded-full bg-ck-surface-2">
              <div className="h-full bg-ck-orange transition-all" style={{ width: `${((fini ? total : progression) / Math.max(1, total)) * 100}%` }} />
            </div>
            <p className="mt-2 text-sm text-ck-texte-2" aria-live="polite">
              {fini ? "Import terminé." : `${progression} / ${total} cabinets traités…`}
            </p>
          </div>
        )}
        {fini && (
          <Info>
            {bilan.crees} cabinet{bilan.crees > 1 ? "s" : ""} créé{bilan.crees > 1 ? "s" : ""}
            {mettreAJour ? `, ${bilan.misAJour} mis à jour` : ""}.
          </Info>
        )}
      </div>
    </Modale>
  );
}
