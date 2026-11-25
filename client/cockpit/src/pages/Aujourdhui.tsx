import { useEffect, useState } from "react";
import { STATUT_CABINET_LABEL, aujourdhui, formatDzd, formatJours, libelleSemaine, type StatutCabinet } from "../../../../shared/cockpit";
import { COLONNES_KANBAN, COULEUR_STATUT } from "../../../../shared/prospection";
import { api, type Moi } from "../api";
import { naviguer } from "../routeur";
import { Bouton, Carte, Chargement, EnTete, Erreur } from "../ui";

type Accueil = {
  aujourdhui: string;
  // Chaque bloc vaut null quand l'onglet correspondant est désactivé pour la personne.
  relances: { nombre: number; plus_ancienne: string | null } | null;
  jamaisContactes: {
    nombre: number;
    prochaineSemaine: string | null;
    restantSemaine: number;
  } | null;
  semainesAValider: number | null;
  semainePrecedente: { lundi: string; manquants: { id: string; nom: string }[] } | null;
  prospection: {
    parStatut: Record<StatutCabinet, number>;
    total: number;
    contactes: number;
    interesses: number;
    signes: number;
  } | null;
  temps: { jours_valides: number; montant_valide: number; jours_non_valides: number } | null;
};

function dateDuJour(iso: string) {
  const s = new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const dateLongue = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

function Tache({ nombre, titre, explication, action, lien }: { nombre: number; titre: string; explication: string; action: string; lien: string }) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
      <p className={`ck-titre w-16 shrink-0 text-4xl ${nombre ? "!text-ck-orange" : "text-ck-texte-2"}`} aria-hidden="true">
        {nombre}
      </p>
      <div className="min-w-0 flex-1">
        <p className="font-bold text-ck-titre">
          <span className="sr-only">{nombre} </span>
          {titre}
        </p>
        <p className="text-sm text-ck-texte-2">{explication}</p>
      </div>
      <Bouton variante={nombre ? "plein" : "contour"} className="shrink-0 self-start sm:self-auto" onClick={() => naviguer(lien)}>
        {action}
      </Bouton>
    </li>
  );
}

function Chiffre({ valeur, libelle }: { valeur: string | number; libelle: string }) {
  return (
    <div>
      <p className="ck-titre text-2xl">{valeur}</p>
      <p className="text-sm text-ck-texte-2">{libelle}</p>
    </div>
  );
}

export default function Aujourdhui(_: { moi: Moi }) {
  const [d, setD] = useState<Accueil | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api<Accueil>("accueil")
      .then(setD)
      .catch((e: Error) => setErreur(e.message));
  }, []);

  const entete = <EnTete pastille={dateDuJour(d?.aujourdhui ?? aujourdhui())} titre="Bonjour, voici" accent="votre journée." />;
  if (!d)
    return (
      <>
        {entete}
        {erreur ? <Erreur>{erreur}</Erreur> : <Chargement />}
      </>
    );

  const { relances, jamaisContactes: jc, semainePrecedente: sp, prospection: p, temps: t } = d;
  const manquants = sp?.manquants.map((m) => m.nom) ?? [];
  const aFaire = relances || jc || d.semainesAValider !== null || sp;

  return (
    <>
      {entete}
      <div className="grid gap-6">
        {!aFaire && !p && !t && <p className="text-ck-texte-2">Rien à afficher ici avec vos onglets actuels.</p>}
        {aFaire && (
          <Carte aria-labelledby="titre-a-faire">
            <h2 id="titre-a-faire" className="ck-titre text-xl">
              À faire
            </h2>
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {relances && (
                <Tache
                  nombre={relances.nombre}
                  titre={relances.nombre > 1 ? "relances dues" : "relance due"}
                  explication={relances.nombre ? `La plus ancienne date du ${dateLongue(relances.plus_ancienne!)}.` : "Aucun cabinet à relancer aujourd'hui."}
                  action="Voir les relances"
                  lien="/cabinets?relance=1"
                />
              )}
              {jc && (
                <Tache
                  nombre={jc.nombre}
                  titre={jc.nombre > 1 ? "cabinets jamais contactés" : "cabinet jamais contacté"}
                  explication={
                    jc.prochaineSemaine
                      ? `Prochaine semaine du plan : ${jc.prochaineSemaine}, ${jc.restantSemaine} cabinet${jc.restantSemaine > 1 ? "s" : ""} restant${jc.restantSemaine > 1 ? "s" : ""}.`
                      : jc.nombre
                        ? "Aucune semaine du plan renseignée."
                        : "Tous les cabinets ont été contactés."
                  }
                  action={jc.prochaineSemaine ? `Ouvrir ${jc.prochaineSemaine}` : "Voir les cabinets"}
                  lien={jc.prochaineSemaine ? `/cabinets?semaine=${encodeURIComponent(jc.prochaineSemaine)}` : "/cabinets"}
                />
              )}
              {d.semainesAValider !== null && (
                <Tache
                  nombre={d.semainesAValider}
                  titre={d.semainesAValider > 1 ? "semaines à valider" : "semaine à valider"}
                  explication={d.semainesAValider ? "Des collaborateurs ont soumis leurs temps." : "Aucune semaine en attente."}
                  action="Valider"
                  lien="/validation"
                />
              )}
              {sp && (
                <Tache
                  nombre={manquants.length}
                  titre={manquants.length > 1 ? "collaborateurs sans semaine soumise" : "collaborateur sans semaine soumise"}
                  explication={manquants.length ? `${libelleSemaine(sp.lundi)} : ${manquants.join(", ")}.` : `Tout le monde a soumis la ${libelleSemaine(sp.lundi).toLowerCase()}.`}
                  action="Voir la saisie"
                  lien={sp.manquants[0] ? `/saisie?profil=${sp.manquants[0].id}&lundi=${sp.lundi}` : "/saisie"}
                />
              )}
            </ul>
          </Carte>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {p && (
            <Carte aria-labelledby="titre-prospection">
              <h2 id="titre-prospection" className="ck-titre mb-4 text-xl">
                Prospection VetCare
              </h2>
              {p.total === 0 ? (
                <p className="text-sm text-ck-texte-2">Aucun cabinet importé pour l'instant.</p>
              ) : (
                <>
                  <div
                    className="flex h-4 overflow-hidden rounded-full bg-ck-surface-2"
                    role="img"
                    aria-label={COLONNES_KANBAN.map((s) => `${STATUT_CABINET_LABEL[s]} : ${p.parStatut[s]}`).join(", ")}
                  >
                    {COLONNES_KANBAN.filter((s) => p.parStatut[s]).map((s) => (
                      <div
                        key={s}
                        style={{
                          width: `${(p.parStatut[s] / p.total) * 100}%`,
                          backgroundColor: COULEUR_STATUT[s],
                        }}
                        title={`${STATUT_CABINET_LABEL[s]} : ${p.parStatut[s]}`}
                      />
                    ))}
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ck-texte-2" aria-hidden="true">
                    {COLONNES_KANBAN.map((s) => (
                      <li key={s} className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COULEUR_STATUT[s] }} />
                        {STATUT_CABINET_LABEL[s]} {p.parStatut[s]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Chiffre valeur={p.total} libelle="cabinets" />
                <Chiffre valeur={p.contactes} libelle="contactés" />
                <Chiffre valeur={p.interesses} libelle="intéressés" />
                <Chiffre valeur={p.signes} libelle="signés" />
              </div>
            </Carte>
          )}

          {t && (
            <Carte aria-labelledby="titre-temps">
              <h2 id="titre-temps" className="ck-titre mb-4 text-xl">
                Temps du mois
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <Chiffre valeur={formatJours(t.jours_valides)} libelle="jours validés" />
                <Chiffre valeur={formatDzd(t.montant_valide)} libelle="facturable HT" />
                <Chiffre valeur={formatJours(t.jours_non_valides)} libelle="saisis non validés" />
              </div>
              <Bouton variante="contour" className="mt-5" onClick={() => naviguer("/recap")}>
                Ouvrir le récap
              </Bouton>
            </Carte>
          )}
        </div>
      </div>
    </>
  );
}
