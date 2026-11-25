import { STATUT_SEMAINE_LABEL, formatJours, joursOuvres, type StatutSemaine } from "../../../shared/cockpit";
import { Pastille } from "./ui";

const STYLE_SEMAINE: Record<StatutSemaine, string> = {
  brouillon: "bg-ck-surface-2 text-ck-texte-2 ring-1 ring-ck-bordure",
  soumise: "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-200",
  validee: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export function BadgeSemaine({ statut }: { statut: StatutSemaine }) {
  return <Pastille className={`!px-3 !py-1 !text-sm ${STYLE_SEMAINE[statut]}`}>{STATUT_SEMAINE_LABEL[statut]}</Pastille>;
}

export type SemaineDetaillee = {
  id: string;
  profil_id: string;
  nom: string;
  lundi: string;
  soumise_le: string | null;
  validee_le: string | null;
  validee_par_nom: string | null;
  lignes: { client_id: string; nom: string; jours: Record<string, number>; total: number }[];
  total: number;
};

const court = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", timeZone: "UTC" }).replace(".", "");
const valeur = (n: number | undefined) => (n === 1 ? "1" : n === 0.5 ? "½" : "");

/** Détail d'une semaine : une ligne par client, les jours du lundi au vendredi et le total. */
export function DetailSemaine({ semaine }: { semaine: SemaineDetaillee }) {
  const jours = joursOuvres(semaine.lundi);
  if (semaine.lignes.length === 0) return <p className="text-sm text-ck-texte-2">Semaine vide (aucun temps saisi).</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[28rem] text-sm">
        <caption className="sr-only">Détail des jours par client</caption>
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ck-texte-2">
            <th scope="col" className="py-2 text-left font-semibold">
              Client
            </th>
            {jours.map((j) => (
              <th key={j} scope="col" className="w-12 py-2 text-center font-semibold">
                {court(j)}
              </th>
            ))}
            <th scope="col" className="w-16 py-2 text-right font-semibold">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--ck-bordure)] border-y border-ck-bordure">
          {semaine.lignes.map((l) => (
            <tr key={l.client_id}>
              <th scope="row" className="py-2 text-left font-semibold text-ck-titre">
                {l.nom}
              </th>
              {jours.map((j) => (
                <td key={j} className="py-2 text-center font-bold text-ck-titre">
                  {valeur(l.jours[j])}
                </td>
              ))}
              <td className="py-2 text-right font-bold text-ck-titre">{formatJours(l.total)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={6} className="pt-2 text-right font-semibold text-ck-texte-2">
              Total de la semaine
            </th>
            <td className="pt-2 text-right text-base font-extrabold text-ck-titre">{formatJours(semaine.total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
