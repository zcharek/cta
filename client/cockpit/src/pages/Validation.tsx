import { useCallback, useEffect, useState } from "react";
import { formatJours, libelleSemaine } from "../../../../shared/cockpit";
import { api } from "../api";
import { naviguer } from "../routeur";
import { DetailSemaine, type SemaineDetaillee } from "../suivi";
import { Avatar, Bouton, Carte, Chargement, EnTete, Erreur, Info } from "../ui";

const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "");
const lienSaisie = (s: SemaineDetaillee) => `/saisie?profil=${s.profil_id}&lundi=${s.lundi}`;

export default function Validation() {
  const [donnees, setDonnees] = useState<{ soumises: SemaineDetaillee[]; validees: SemaineDetaillee[] } | null>(null);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState<string | null>(null);

  const charger = useCallback(() => {
    api<{ soumises: SemaineDetaillee[]; validees: SemaineDetaillee[] }>("validation")
      .then(setDonnees)
      .catch((e: Error) => setErreur(e.message));
  }, []);

  useEffect(charger, [charger]);

  async function decider(s: SemaineDetaillee, statut: "validee" | "brouillon") {
    setOccupe(s.id);
    setErreur("");
    try {
      await api("semaines/statut", { corps: { profilId: s.profil_id, lundi: s.lundi, statut } });
      charger();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupe(null);
    }
  }

  if (!donnees) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  return (
    <>
      <EnTete
        titre="Validation"
        accent="des semaines."
        sousTitre={donnees.soumises.length ? `${donnees.soumises.length} semaine${donnees.soumises.length > 1 ? "s" : ""} à valider, de la plus ancienne à la plus récente.` : undefined}
      />
      {erreur && (
        <div className="mb-4">
          <Erreur>{erreur}</Erreur>
        </div>
      )}

      {donnees.soumises.length === 0 ? (
        <Info>Aucune semaine en attente de validation.</Info>
      ) : (
        <ul className="grid gap-5">
          {donnees.soumises.map((s) => (
            <li key={s.id}>
              <Carte>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Avatar nom={s.nom} />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-ck-titre">{s.nom}</h2>
                    <p className="text-sm text-ck-texte-2">
                      {libelleSemaine(s.lundi)} · soumise le {date(s.soumise_le)}
                    </p>
                  </div>
                  <p className="ck-titre text-2xl">{formatJours(s.total)}</p>
                </div>
                <DetailSemaine semaine={s} />
                <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
                  <a
                    href={`/cockpit${lienSaisie(s)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      naviguer(lienSaisie(s));
                    }}
                    className="mr-auto text-sm font-bold text-ck-orange-texte hover:underline"
                  >
                    Ouvrir la saisie
                  </a>
                  <Bouton variante="contour" disabled={occupe === s.id} onClick={() => void decider(s, "brouillon")}>
                    Renvoyer au collaborateur
                  </Bouton>
                  <Bouton disabled={occupe === s.id} onClick={() => void decider(s, "validee")}>
                    Valider
                  </Bouton>
                </div>
              </Carte>
            </li>
          ))}
        </ul>
      )}

      <section aria-labelledby="titre-validees" className="mt-12">
        <h2 id="titre-validees" className="ck-titre mb-4 text-xl">
          Dernières semaines validées
        </h2>
        {donnees.validees.length === 0 ? (
          <p className="text-sm text-ck-texte-2">Aucune semaine validée pour l'instant.</p>
        ) : (
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {donnees.validees.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/cockpit${lienSaisie(s)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      naviguer(lienSaisie(s));
                    }}
                    className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-ck-surface-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-semibold text-ck-titre">{s.nom}</span>
                      <span className="text-ck-texte-2"> · {libelleSemaine(s.lundi)}</span>
                    </span>
                    <span className="text-sm text-ck-texte-2">
                      validée le {date(s.validee_le)}
                      {s.validee_par_nom ? ` par ${s.validee_par_nom}` : ""}
                    </span>
                    <span className="w-16 text-right font-bold text-ck-titre">{formatJours(s.total)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Carte>
        )}
      </section>
    </>
  );
}
