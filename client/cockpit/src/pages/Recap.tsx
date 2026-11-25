import { useEffect, useState } from "react";
import {
  aujourdhui,
  decalerMois,
  formatDzd,
  formatJours,
  libelleMois,
  libelleSemaine,
  recapEnCsv,
  STATUT_SEMAINE_LABEL,
  type RecapClient,
  type StatutSemaine,
} from "../../../../shared/cockpit";
import type { DonneesTimesheet } from "../../../../shared/timesheet";
import { api, type Moi } from "../api";
import { naviguer, surClicLien } from "../routeur";
import { Bouton, Carte, Chargement, EnTete, Erreur, Info } from "../ui";

type Portee = "validees" | "toutes";
type Recap = {
  mois: string;
  portee: Portee;
  clients: RecapClient[];
  jours: number;
  montant: number;
  nonValidees: { id: string; profil_id: string; nom: string; lundi: string; statut: StatutSemaine }[];
};

function telecharger(nom: string, contenu: string) {
  const url = URL.createObjectURL(new Blob([contenu], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Timesheet PDF d'un client au format du modèle AEBS (jours validés uniquement). */
function BoutonTimesheet({ clientId, mois }: { clientId: string; mois: string }) {
  const [etat, setEtat] = useState<"" | "occupe" | string>("");
  async function generer() {
    setEtat("occupe");
    try {
      const [donnees, pdf] = await Promise.all([
        api<DonneesTimesheet & { joursNonValides: number }>(`timesheet?client=${clientId}&mois=${mois}`),
        import("../../../../shared/timesheet"),
      ]);
      const octets = await pdf.genererTimesheet(donnees);
      const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = pdf.nomFichier(donnees);
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setEtat(donnees.joursNonValides > 0 ? `${formatJours(donnees.joursNonValides)} non validé${donnees.joursNonValides > 1 ? "s" : ""}, non inclus.` : "");
    } catch (e) {
      setEtat((e as Error).message);
    }
  }
  return (
    <span className="ml-3 inline-flex items-center gap-2 align-middle">
      <button type="button" onClick={() => void generer()} disabled={etat === "occupe"} className="rounded-lg border border-ck-bordure bg-ck-surface px-2.5 py-1 text-xs font-bold text-ck-titre hover:border-ck-plein disabled:opacity-50">
        {etat === "occupe" ? "Génération…" : "Timesheet PDF"}
      </button>
      {etat && etat !== "occupe" && (
        <span role="status" className="text-xs font-normal text-ck-orange-texte">
          {etat}
        </span>
      )}
    </span>
  );
}

/** Raccourci vers l'émission de la facture du client pour ce mois. */
function LienFacture({ clientId, mois }: { clientId: string; mois: string }) {
  const vers = `/factures?client=${clientId}&mois=${mois}`;
  return (
    <a href={`/cockpit${vers}`} onClick={(e) => surClicLien(e, vers)} className="ml-2 inline-block rounded-lg border border-ck-bordure bg-ck-surface px-2.5 py-1 align-middle text-xs font-bold text-ck-titre hover:border-ck-plein">
      Facture
    </a>
  );
}

export default function RecapMensuel({ moi }: { moi: Moi }) {
  const [mois, setMois] = useState(() => aujourdhui().slice(0, 7));
  const [portee, setPortee] = useState<Portee>("validees");
  const [recap, setRecap] = useState<Recap | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    setRecap(null);
    setErreur("");
    api<Recap>(`recap?mois=${mois}&portee=${portee}`)
      .then(setRecap)
      .catch((e: Error) => setErreur(e.message));
  }, [mois, portee]);

  const titreMois = libelleMois(mois);

  return (
    <>
      <EnTete
        titre="Récap"
        accent="mensuel."
        actions={
          <Bouton variante="contour" disabled={!recap || recap.clients.length === 0} onClick={() => recap && telecharger(`recap-${mois}-${portee}.csv`, recapEnCsv(recap))}>
            Exporter en CSV
          </Bouton>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <nav aria-label="Changer de mois" className="flex items-center gap-2">
          <Bouton variante="contour" className="!px-3" onClick={() => setMois(decalerMois(mois, -1))} aria-label="Mois précédent">
            ←
          </Bouton>
          <p className="ck-titre min-w-[10rem] text-center text-lg first-letter:uppercase" aria-live="polite">
            {titreMois}
          </p>
          <Bouton variante="contour" className="!px-3" onClick={() => setMois(decalerMois(mois, 1))} aria-label="Mois suivant">
            →
          </Bouton>
        </nav>
        <div role="radiogroup" aria-label="Temps pris en compte" className="flex rounded-[10px] bg-ck-surface p-1 shadow-sm ring-1 ring-ck-bordure sm:ml-auto">
          {(
            [
              ["validees", "Semaines validées"],
              ["toutes", "Toutes les saisies"],
            ] as const
          ).map(([p, libelle]) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={portee === p}
              onClick={() => setPortee(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${portee === p ? "bg-ck-plein text-ck-plein-texte" : "text-ck-texte-2 hover:text-ck-titre"}`}
            >
              {libelle}
            </button>
          ))}
        </div>
      </div>

      {erreur && <Erreur>{erreur}</Erreur>}
      {!recap && !erreur && <Chargement />}

      {recap && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Carte className="!py-4">
              <p className="ck-titre text-3xl">{formatJours(recap.jours)}</p>
              <p className="text-sm text-ck-texte-2">jours facturables</p>
            </Carte>
            <Carte className="!py-4">
              <p className="ck-titre text-3xl">{formatDzd(recap.montant)}</p>
              <p className="text-sm text-ck-texte-2">montant estimé HT</p>
            </Carte>
          </div>

          {recap.nonValidees.length > 0 && (
            <div role="status" className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
              <p className="font-bold">
                {recap.nonValidees.length} semaine{recap.nonValidees.length > 1 ? "s" : ""} de {titreMois} pas encore validée{recap.nonValidees.length > 1 ? "s" : ""}
                {portee === "validees" ? " : leurs jours ne sont pas comptés ci-dessous." : "."}
              </p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                {recap.nonValidees.map((s) => {
                  const lien = `/saisie?profil=${s.profil_id}&lundi=${s.lundi}`;
                  return (
                    <li key={s.id}>
                      <a
                        href={`/cockpit${lien}`}
                        onClick={(e) => {
                          e.preventDefault();
                          naviguer(lien);
                        }}
                        className="underline underline-offset-2 hover:no-underline"
                      >
                        {s.nom}, {libelleSemaine(s.lundi).toLowerCase()} ({STATUT_SEMAINE_LABEL[s.statut].toLowerCase()})
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {recap.clients.length === 0 ? (
            <Info>{portee === "validees" ? "Aucune semaine validée sur ce mois." : "Aucun temps saisi sur ce mois."}</Info>
          ) : (
            <Carte className="overflow-x-auto !p-0">
              <table className="w-full min-w-[32rem] text-sm">
                <caption className="sr-only">Récap de {titreMois} par client et par collaborateur</caption>
                <thead>
                  <tr className="border-b border-ck-bordure text-xs uppercase tracking-wide text-ck-texte-2">
                    <th scope="col" className="px-5 py-3 text-left font-semibold">
                      Client / collaborateur
                    </th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">
                      Jours
                    </th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">
                      TJM
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      Montant HT
                    </th>
                  </tr>
                </thead>
                {recap.clients.map((c) => (
                  <tbody key={c.client_id} className="border-b border-ck-bordure last:border-0">
                    <tr className="bg-ck-surface-2">
                      <th scope="row" className="px-5 py-3 text-left text-base font-bold text-ck-titre">
                        {c.nom}
                        {portee === "validees" && <BoutonTimesheet clientId={c.client_id} mois={mois} />}
                        {portee === "validees" && moi.onglets.includes("factures") && <LienFacture clientId={c.client_id} mois={mois} />}
                      </th>
                      <td className="px-3 py-3 text-right font-bold text-ck-titre">{formatJours(c.jours)}</td>
                      <td className="px-3 py-3 text-right text-ck-texte-2">{formatDzd(c.tjm_dzd)}</td>
                      <td className="px-5 py-3 text-right font-bold text-ck-titre">{formatDzd(c.montant)}</td>
                    </tr>
                    {c.collaborateurs.map((p) => (
                      <tr key={p.profil_id}>
                        <th scope="row" className="py-2.5 pl-9 pr-5 text-left font-normal text-ck-texte">
                          {p.nom}
                        </th>
                        <td className="px-3 py-2.5 text-right">{formatJours(p.jours)}</td>
                        <td />
                        <td className="px-5 py-2.5 text-right">{formatDzd(p.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                ))}
                <tfoot>
                  <tr className="border-t-2 border-ck-plein">
                    <th scope="row" className="px-5 py-3 text-left text-base font-extrabold text-ck-titre">
                      Total
                    </th>
                    <td className="px-3 py-3 text-right font-extrabold text-ck-titre">{formatJours(recap.jours)}</td>
                    <td />
                    <td className="px-5 py-3 text-right text-base font-extrabold text-ck-titre">{formatDzd(recap.montant)}</td>
                  </tr>
                </tfoot>
              </table>
            </Carte>
          )}
          <p className="mt-3 text-xs text-ck-texte-2">Montants calculés avec le tarif actuel de chaque client (TJM, ou forfait mensuel divisé par ses jours de référence). Le timesheet PDF ne reprend que les jours validés.</p>
        </>
      )}
    </>
  );
}
