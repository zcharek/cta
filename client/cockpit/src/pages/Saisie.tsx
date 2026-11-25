import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ajouterJours,
  aujourdhui,
  formatJours,
  joursOuvres,
  libelleSemaine,
  lundiDe,
  prenom,
  valeurSuivante,
  type StatutSemaine,
  type Temps,
} from "../../../../shared/cockpit";
import { ErreurApi, api, type ClientAdmin, type Collaborateur, type Moi } from "../api";
import { BadgeSemaine } from "../suivi";
import { Bouton, Carte, Chargement, EnTete, Erreur, Icone, Info, classeChamp } from "../ui";

type Semaine = { id: string | null; lundi: string; statut: StatutSemaine; soumise_le: string | null; validee_le: string | null };
type Donnees = { semaine: Semaine; lignes: { id: string; nom: string }[]; temps: Temps[] };

const cle = (clientId: string, jour: string) => `${clientId}|${jour}`;

function jourCourt(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  return {
    nom: d.toLocaleDateString("fr-FR", { weekday: "short", timeZone: "UTC" }).replace(".", ""),
    numero: d.getUTCDate(),
    long: d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }),
  };
}

function dateCourte(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" }) : "";
}

/** Case de la grille : vide, journée pleine (1) ou demi-journée (½). Un clic passe à l'état suivant. */
function Case({ valeur, libelle, modifiable, aujourdhui, onClic }: { valeur: number; libelle: string; modifiable: boolean; aujourdhui: boolean; onClic: () => void }) {
  const etat = valeur === 1 ? "1 jour" : valeur === 0.5 ? "½ jour" : "vide";
  const style =
    valeur === 1
      ? "border-ck-plein bg-ck-plein text-white"
      : valeur === 0.5
        ? "border-[#f2b79f] bg-[#fbe3d9] text-ck-orange-texte"
        : "border-dashed border-ck-bordure bg-ck-surface text-[#b5bccb] hover:border-ck-texte-2";
  return (
    <button
      type="button"
      onClick={onClic}
      disabled={!modifiable}
      aria-label={`${libelle} : ${etat}${modifiable ? ". Cliquer pour changer." : ""}`}
      className={`mx-auto flex h-11 w-full max-w-[5rem] items-center justify-center rounded-xl border-2 text-sm font-bold tabular-nums transition disabled:cursor-default ${style} ${
        aujourdhui ? "ring-2 ring-ck-orange ring-offset-2 ring-offset-ck-surface" : ""
      } ${modifiable ? "active:scale-95" : "opacity-80"}`}
    >
      <span aria-hidden="true">{valeur === 1 ? "1" : valeur === 0.5 ? "½" : "–"}</span>
    </button>
  );
}

/** Ligne de la grille : nom (et total sur mobile) puis 5 cases puis total sur grand écran. */
const LIGNE = "grid grid-cols-5 items-center gap-x-2 gap-y-2 sm:grid-cols-[minmax(0,1fr)_repeat(5,minmax(3.5rem,5rem))_5rem] sm:gap-x-3";

export default function Saisie({ moi }: { moi: Moi }) {
  // Avec l'onglet Validation : saisie de tout le monde, validation et réouverture.
  const valideur = moi.onglets.includes("validation");
  const params = new URLSearchParams(window.location.search);
  const [profilId, setProfilId] = useState(() => (valideur && params.get("profil")) || moi.id);
  const [lundi, setLundi] = useState(() => {
    const l = params.get("lundi");
    return l && /^\d{4}-\d{2}-\d{2}$/.test(l) ? lundiDe(l) : lundiDe(aujourdhui());
  });
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [valeurs, setValeurs] = useState<Map<string, number>>(new Map());
  const [ponctuels, setPonctuels] = useState<{ id: string; nom: string }[]>([]);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [clients, setClients] = useState<ClientAdmin[]>([]);
  const [erreur, setErreur] = useState("");
  const [enCours, setEnCours] = useState(0);
  const [occupe, setOccupe] = useState(false);
  const files = useRef(new Map<string, Promise<unknown>>());

  const charger = useCallback(() => {
    setErreur("");
    api<Donnees>(`semaines?profil=${profilId}&lundi=${lundi}`)
      .then((d) => {
        setDonnees(d);
        setValeurs(new Map(d.temps.map((t) => [cle(t.client_id, t.jour), t.valeur])));
      })
      .catch((e: Error) => setErreur(e.message));
  }, [profilId, lundi]);

  useEffect(() => {
    setDonnees(null);
    setPonctuels([]);
    charger();
    const q = new URLSearchParams({ lundi, ...(profilId !== moi.id ? { profil: profilId } : {}) });
    window.history.replaceState(null, "", `/cockpit/saisie?${q}`);
  }, [charger, lundi, profilId, moi.id]);

  useEffect(() => {
    if (!valideur) return;
    api<{ collaborateurs: Collaborateur[] }>("collaborateurs").then((d) => setCollaborateurs(d.collaborateurs)).catch(() => {});
    api<{ clients: ClientAdmin[] }>("clients").then((d) => setClients(d.clients)).catch(() => {});
  }, [valideur]);

  const jours = useMemo(() => joursOuvres(lundi), [lundi]);
  const statut = donnees?.semaine.statut ?? "brouillon";
  const modifiable = valideur ? statut !== "validee" : statut === "brouillon";
  const lignes = useMemo(() => {
    const vues = new Set(donnees?.lignes.map((l) => l.id));
    return [...(donnees?.lignes ?? []), ...ponctuels.filter((p) => !vues.has(p.id))];
  }, [donnees, ponctuels]);

  const v = (clientId: string, jour: string) => valeurs.get(cle(clientId, jour)) ?? 0;
  const totalLigne = (clientId: string) => jours.reduce((s, j) => s + v(clientId, j), 0);
  const totalJour = (jour: string) => lignes.reduce((s, l) => s + v(l.id, jour), 0);
  const total = jours.reduce((s, j) => s + totalJour(j), 0);
  const joursDepasses = jours.filter((j) => totalJour(j) > 1);

  /** Enregistrement automatique : les clics sur une même case partent dans l'ordre. */
  function cliquer(clientId: string, jour: string) {
    if (!modifiable) return;
    void enregistrer(clientId, jour, valeurSuivante(valeurs.get(cle(clientId, jour)) ?? 0));
  }

  /** Remet toutes les cases de la semaine à vide. */
  async function vider() {
    if (!window.confirm("Vider toutes les cases de cette semaine ?")) return;
    for (const l of lignes) for (const j of jours) if (v(l.id, j)) await enregistrer(l.id, j, 0);
  }

  /** Enregistre une valeur précise (même file d'attente que les clics). */
  function enregistrer(clientId: string, jour: string, valeur: number) {
    const k = cle(clientId, jour);
    const avant = valeurs.get(k) ?? 0;
    setValeurs((m) => new Map(m).set(k, valeur));
    setEnCours((n) => n + 1);
    const suivant = (files.current.get(k) ?? Promise.resolve())
      .catch(() => {})
      .then(() => api("temps", { methode: "PUT", corps: { profilId, lundi, clientId, jour, valeur } }))
      .catch((e: ErreurApi) => {
        setErreur(e.message);
        if (e.status === 409) charger();
        else setValeurs((m) => new Map(m).set(k, avant));
      })
      .finally(() => setEnCours((n) => n - 1));
    files.current.set(k, suivant);
    return suivant;
  }

  async function changerStatut(vers: StatutSemaine) {
    setOccupe(true);
    setErreur("");
    try {
      await Promise.allSettled(files.current.values());
      await api("semaines/statut", { corps: { profilId, lundi, statut: vers } });
      charger();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const cible = valideur ? collaborateurs.find((c) => c.id === profilId) : undefined;
  const ajoutables = clients.filter((c) => c.actif && !lignes.some((l) => l.id === c.id));
  const cetteSemaine = lundiDe(aujourdhui());

  const auj = aujourdhui();
  const totalJ = (n: number) => formatJours(n, false);

  return (
    <>
      <EnTete
        icone="horloge"
        titre={valideur ? "Saisie" : `Bonjour ${prenom(moi.nom)},`}
        accent={valideur ? "des temps." : "voici votre semaine."}
        sousTitre="Une case = une journée sur un client : un clic pour 1 jour, deux pour ½, trois pour vider."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {valideur && (
          <div className="w-full sm:w-64">
            <label htmlFor="choix-collab" className="sr-only">
              Collaborateur
            </label>
            <select id="choix-collab" value={profilId} onChange={(e) => setProfilId(e.target.value)} className={`${classeChamp} !rounded-2xl !bg-ck-surface !py-3 shadow-[var(--ck-ombre)]`}>
              {collaborateurs.length === 0 && <option value={profilId}>{moi.nom}</option>}
              {collaborateurs
                .filter((c) => c.actif || c.id === profilId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                    {c.id === moi.id ? " (moi)" : ""}
                  </option>
                ))}
            </select>
          </div>
        )}
        <nav aria-label="Changer de semaine" className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2.5 rounded-2xl bg-ck-surface px-4 py-3 font-bold text-ck-titre shadow-[var(--ck-ombre)]">
            <Icone nom="calendrier" taille={20} className="text-ck-texte-2" />
            {libelleSemaine(lundi)}
          </span>
          <button type="button" onClick={() => setLundi(ajouterJours(lundi, -7))} aria-label="Semaine précédente" className="grid h-12 w-12 place-items-center rounded-2xl bg-ck-surface text-ck-titre shadow-[var(--ck-ombre)] hover:bg-ck-surface-2">
            <Icone nom="gauche" />
          </button>
          <button type="button" onClick={() => setLundi(ajouterJours(lundi, 7))} aria-label="Semaine suivante" className="grid h-12 w-12 place-items-center rounded-2xl bg-ck-surface text-ck-titre shadow-[var(--ck-ombre)] hover:bg-ck-surface-2">
            <Icone nom="droite" />
          </button>
          {lundi !== cetteSemaine && (
            <Bouton variante="discret" onClick={() => setLundi(cetteSemaine)}>
              Cette semaine
            </Bouton>
          )}
        </nav>
        {statut === "brouillon" && !valideur && (
          <p className="flex items-center gap-3 rounded-2xl bg-[#eef2fb] px-4 py-3 text-sm text-ck-titre lg:ml-auto">
            <Icone nom="info" className="shrink-0 text-[#2f5bd3]" />
            N'oubliez pas de soumettre vos temps à la fin de la semaine.
          </p>
        )}
      </div>

      {erreur && (
        <div className="mb-4">
          <Erreur>{erreur}</Erreur>
        </div>
      )}

      {!donnees ? (
        !erreur && <Chargement />
      ) : (
        <Carte className="sm:!p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eef2fb] text-ck-titre">
                <Icone nom="calendrier" taille={26} />
              </span>
              <div>
                <h2 className="ck-titre text-xl">{libelleSemaine(lundi)}</h2>
                <p className="text-sm text-ck-texte-2">
                  {cible && cible.id !== moi.id ? `${cible.nom} · ` : ""}
                  {enCours > 0 ? "Enregistrement…" : "Enregistrement automatique"}
                </p>
              </div>
            </div>
            <BadgeSemaine statut={statut} />
          </div>

          {lignes.length === 0 ? (
            <Info>
              {valideur
                ? "Aucun client assigné à ce collaborateur. Ajoutez un client ponctuel ci-dessous, ou assignez-lui des clients dans Réglages."
                : "Aucun client ne vous est assigné pour l'instant. Contactez un responsable de Central Test Agency."}
            </Info>
          ) : (
            <div role="group" aria-label="Grille de la semaine" className="overflow-hidden rounded-2xl border border-ck-bordure">
              {/* En-tête des jours */}
              <div className={`${LIGNE} bg-[var(--ck-champ)] px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-ck-texte-2`}>
                <span className="hidden text-left sm:block">Client</span>
                {jours.map((j) => (
                  <span key={j} className={j === auj ? "text-ck-orange" : undefined}>
                    {jourCourt(j).nom}
                    <span className={`block text-lg font-extrabold normal-case tracking-normal ${j === auj ? "text-ck-orange" : "text-ck-titre"}`}>{jourCourt(j).numero}</span>
                  </span>
                ))}
                <span className="hidden text-right sm:block">Total</span>
              </div>

              <ul className="divide-y divide-[color:var(--ck-bordure)]">
                {lignes.map((l) => (
                  <li key={l.id} className={`${LIGNE} px-4 py-3.5`}>
                    <div className="col-span-5 flex items-baseline justify-between gap-2 sm:col-span-1">
                      <span className="truncate font-bold text-ck-titre">{l.nom}</span>
                      <span className="text-sm font-bold text-ck-texte-2 sm:hidden">{formatJours(totalLigne(l.id))}</span>
                    </div>
                    {jours.map((j) => (
                      <Case key={j} valeur={v(l.id, j)} aujourdhui={j === auj} libelle={`${l.nom}, ${jourCourt(j).long}`} modifiable={modifiable} onClic={() => cliquer(l.id, j)} />
                    ))}
                    <span className="hidden text-right text-lg font-extrabold text-ck-titre sm:block">{formatJours(totalLigne(l.id))}</span>
                  </li>
                ))}
              </ul>

              {/* Totaux par jour */}
              <div className={`${LIGNE} bg-[var(--ck-champ)] px-4 py-3 text-center text-sm font-bold`}>
                <span className="col-span-5 text-left text-ck-titre sm:col-span-1">Total par jour</span>
                {jours.map((j) => {
                  const t = totalJour(j);
                  return (
                    <span key={j} className={t > 1 ? "rounded-md bg-red-100 text-red-800" : "text-ck-titre"}>
                      {t ? totalJ(t) : "–"}
                    </span>
                  );
                })}
                <span className="hidden text-right text-xl font-extrabold text-ck-titre sm:block">{formatJours(total)}</span>
              </div>
              <p className="px-4 pb-3 text-right text-lg font-bold text-ck-titre sm:hidden">Total : {formatJours(total)}</p>
            </div>
          )}

          {joursDepasses.length > 0 && (
            <div className="mt-4">
              <Erreur>
                {joursDepasses.map((j) => `${jourCourt(j).long} : ${formatJours(totalJour(j))}`).join(" · ")}. Une journée ne devrait pas dépasser 1 jour.
              </Erreur>
            </div>
          )}

          {valideur && modifiable && ajoutables.length > 0 && (
            <div className="mt-6 sm:w-96">
              <label htmlFor="ajout-client" className="mb-2 flex items-center gap-2 text-sm font-bold text-ck-titre">
                <Icone nom="plusRond" taille={20} className="text-[#2f5bd3]" />
                Ajouter un client ponctuel à la semaine
              </label>
              <select
                id="ajout-client"
                value=""
                className={classeChamp}
                onChange={(e) => {
                  const c = ajoutables.find((x) => x.id === e.target.value);
                  if (c) setPonctuels((p) => [...p, { id: c.id, nom: c.nom }]);
                }}
              >
                <option value="">Choisir un client…</option>
                {ajoutables.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-end gap-3 border-t border-ck-bordure pt-6">
            {modifiable && total > 0 && (
              <Bouton variante="contour" className="mr-auto" disabled={occupe || enCours > 0} onClick={() => void vider()}>
                <Icone nom="recharger" taille={18} /> Vider la semaine
              </Bouton>
            )}
            {statut === "validee" && <p className="mr-auto text-sm text-ck-texte-2">Semaine validée le {dateCourte(donnees.semaine.validee_le)}.</p>}
            {statut === "soumise" && (
              <p className="mr-auto text-sm text-ck-texte-2">
                Soumise le {dateCourte(donnees.semaine.soumise_le)}
                {valideur ? "." : ", en attente de validation."}
              </p>
            )}
            {statut === "brouillon" && (
              <Bouton variante="orange" className="!px-6 !py-3" disabled={occupe || enCours > 0} onClick={() => void changerStatut("soumise")}>
                <Icone nom="envoyer" taille={18} /> Soumettre la semaine
              </Bouton>
            )}
            {statut === "soumise" && (
              <Bouton variante="contour" disabled={occupe} onClick={() => void changerStatut("brouillon")}>
                {valideur ? "Renvoyer en brouillon" : "Repasser en brouillon"}
              </Bouton>
            )}
            {statut === "soumise" && valideur && (
              <Bouton variante="orange" disabled={occupe || enCours > 0} onClick={() => void changerStatut("validee")}>
                <Icone nom="coche" taille={18} /> Valider
              </Bouton>
            )}
            {statut === "validee" && valideur && (
              <Bouton variante="contour" disabled={occupe} onClick={() => void changerStatut("brouillon")}>
                Rouvrir la semaine
              </Bouton>
            )}
          </div>
        </Carte>
      )}
    </>
  );
}
