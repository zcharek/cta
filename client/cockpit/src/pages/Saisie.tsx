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
import { Bouton, Carte, Chargement, EnTete, Erreur, Info, classeChamp } from "../ui";

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

/** Case de la grille : vide, journée pleine (carré plein) ou demi-journée (carré coupé en diagonale). */
function Case({ valeur, libelle, modifiable, onClic }: { valeur: number; libelle: string; modifiable: boolean; onClic: () => void }) {
  const etat = valeur === 1 ? "1 jour" : valeur === 0.5 ? "½ jour" : "vide";
  return (
    <button
      type="button"
      onClick={onClic}
      disabled={!modifiable}
      aria-label={`${libelle} : ${etat}${modifiable ? ". Cliquer pour changer." : ""}`}
      className={`mx-auto flex h-12 w-full max-w-[3.5rem] items-center justify-center rounded-[10px] border-2 text-xs font-bold transition disabled:cursor-default ${
        valeur ? "border-ck-plein" : "border-dashed border-ck-bordure hover:border-ck-texte-2 disabled:hover:border-ck-bordure"
      } ${modifiable ? "active:scale-95" : "opacity-80"}`}
      style={{
        background: valeur === 1 ? "var(--ck-plein)" : valeur === 0.5 ? "linear-gradient(135deg, var(--ck-plein) 50%, transparent 50%)" : undefined,
      }}
    />
  );
}

/** Ligne de la grille : nom (et total sur mobile) puis 5 cases puis total sur grand écran. */
const LIGNE = "grid grid-cols-5 items-center gap-x-2 gap-y-2 sm:grid-cols-[minmax(0,1fr)_repeat(5,3.5rem)_4.5rem]";

export default function Saisie({ moi }: { moi: Moi }) {
  const params = new URLSearchParams(window.location.search);
  const [profilId, setProfilId] = useState(() => (moi.admin && params.get("profil")) || moi.id);
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
    if (!moi.admin) return;
    api<{ collaborateurs: Collaborateur[] }>("collaborateurs").then((d) => setCollaborateurs(d.collaborateurs)).catch(() => {});
    api<{ clients: ClientAdmin[] }>("clients").then((d) => setClients(d.clients)).catch(() => {});
  }, [moi.admin]);

  const jours = useMemo(() => joursOuvres(lundi), [lundi]);
  const statut = donnees?.semaine.statut ?? "brouillon";
  const modifiable = moi.admin ? statut !== "validee" : statut === "brouillon";
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
    const k = cle(clientId, jour);
    const avant = valeurs.get(k) ?? 0;
    const apres = valeurSuivante(avant);
    setValeurs((m) => new Map(m).set(k, apres));
    setEnCours((n) => n + 1);
    const precedent = files.current.get(k) ?? Promise.resolve();
    const suivant = precedent
      .catch(() => {})
      .then(() => api("temps", { methode: "PUT", corps: { profilId, lundi, clientId, jour, valeur: apres } }))
      .catch((e: ErreurApi) => {
        setErreur(e.message);
        if (e.status === 409) charger();
        else setValeurs((m) => new Map(m).set(k, avant));
      })
      .finally(() => setEnCours((n) => n - 1));
    files.current.set(k, suivant);
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

  const cible = moi.admin ? collaborateurs.find((c) => c.id === profilId) : undefined;
  const ajoutables = clients.filter((c) => c.actif && !lignes.some((l) => l.id === c.id));
  const cetteSemaine = lundiDe(aujourdhui());

  return (
    <>
      {moi.admin ? (
        <EnTete titre="Saisie" accent="des temps." />
      ) : (
        <EnTete titre={`Bonjour ${prenom(moi.nom)},`} accent="voici votre semaine." />
      )}

      <div className="mb-5 flex flex-wrap items-end gap-3">
        {moi.admin && (
          <div className="w-full sm:w-72">
            <label htmlFor="choix-collab" className="mb-1.5 block text-sm font-semibold text-ck-titre">
              Collaborateur
            </label>
            <select id="choix-collab" value={profilId} onChange={(e) => setProfilId(e.target.value)} className={classeChamp}>
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
        <nav aria-label="Changer de semaine" className="flex flex-1 flex-wrap items-center gap-2">
          <Bouton variante="contour" className="!px-3" onClick={() => setLundi(ajouterJours(lundi, -7))} aria-label="Semaine précédente">
            ←
          </Bouton>
          <Bouton variante="contour" className="!px-3" onClick={() => setLundi(ajouterJours(lundi, 7))} aria-label="Semaine suivante">
            →
          </Bouton>
          {lundi !== cetteSemaine && (
            <Bouton variante="discret" onClick={() => setLundi(cetteSemaine)}>
              Cette semaine
            </Bouton>
          )}
        </nav>
      </div>

      {erreur && (
        <div className="mb-4">
          <Erreur>{erreur}</Erreur>
        </div>
      )}

      {!donnees ? (
        !erreur && <Chargement />
      ) : (
        <Carte>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="ck-titre text-xl">{libelleSemaine(lundi)}</h2>
              <p className="text-sm text-ck-texte-2">
                {cible && cible.id !== moi.id ? `${cible.nom} · ` : ""}
                {enCours > 0 ? "Enregistrement…" : "Enregistrement automatique"}
              </p>
            </div>
            <BadgeSemaine statut={statut} />
          </div>

          {lignes.length === 0 ? (
            <Info>
              {moi.admin
                ? "Aucun client assigné à ce collaborateur. Ajoutez un client ponctuel ci-dessous, ou assignez-lui des clients dans Réglages."
                : "Aucun client ne vous est assigné pour l'instant. Contactez un responsable de Central Test Agency."}
            </Info>
          ) : (
            <div role="group" aria-label="Grille de la semaine">
              {/* En-tête des jours */}
              <div className={`${LIGNE} mb-2 text-center text-xs font-semibold uppercase tracking-wide text-ck-texte-2`}>
                <span className="hidden text-left sm:block">Client</span>
                {jours.map((j) => (
                  <span key={j} className={j === aujourdhui() ? "text-ck-orange-texte" : undefined}>
                    {jourCourt(j).nom}
                    <span className="block text-base font-bold normal-case tracking-normal text-ck-titre">{jourCourt(j).numero}</span>
                  </span>
                ))}
                <span className="hidden text-right sm:block">Total</span>
              </div>

              <ul className="divide-y divide-[color:var(--ck-bordure)] border-y border-ck-bordure">
                {lignes.map((l) => (
                  <li key={l.id} className={`${LIGNE} py-3`}>
                    <div className="col-span-5 flex items-baseline justify-between gap-2 sm:col-span-1">
                      <span className="truncate font-semibold text-ck-titre">{l.nom}</span>
                      <span className="text-sm font-bold text-ck-texte-2 sm:hidden">{formatJours(totalLigne(l.id))}</span>
                    </div>
                    {jours.map((j) => (
                      <Case key={j} valeur={v(l.id, j)} libelle={`${l.nom}, ${jourCourt(j).long}`} modifiable={modifiable} onClic={() => cliquer(l.id, j)} />
                    ))}
                    <span className="hidden text-right font-bold text-ck-titre sm:block">{formatJours(totalLigne(l.id))}</span>
                  </li>
                ))}
              </ul>

              {/* Totaux par jour */}
              <div className={`${LIGNE} pt-3 text-center text-sm font-bold`}>
                <span className="col-span-5 text-left text-ck-texte-2 sm:col-span-1">Total par jour</span>
                {jours.map((j) => {
                  const t = totalJour(j);
                  return (
                    <span key={j} className={t > 1 ? "rounded-md bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200" : "text-ck-titre"}>
                      {t ? formatJours(t, false) : "–"}
                    </span>
                  );
                })}
                <span className="hidden text-right text-lg text-ck-titre sm:block">{formatJours(total)}</span>
              </div>
              <p className="mt-2 text-right text-lg font-bold text-ck-titre sm:hidden">Total : {formatJours(total)}</p>

              {joursDepasses.length > 0 && (
                <div className="mt-4">
                  <Erreur>
                    {joursDepasses.map((j) => `${jourCourt(j).long} : ${formatJours(totalJour(j))}`).join(" · ")}. Une journée ne devrait pas dépasser 1 jour.
                  </Erreur>
                </div>
              )}
            </div>
          )}

          {moi.admin && modifiable && ajoutables.length > 0 && (
            <div className="mt-5 sm:w-80">
              <label htmlFor="ajout-client" className="mb-1.5 block text-sm font-semibold text-ck-titre">
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

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-ck-bordure pt-5">
            {statut === "validee" && (
              <p className="mr-auto text-sm text-ck-texte-2">Semaine validée le {dateCourte(donnees.semaine.validee_le)}.</p>
            )}
            {statut === "soumise" && (
              <p className="mr-auto text-sm text-ck-texte-2">
                Soumise le {dateCourte(donnees.semaine.soumise_le)}
                {moi.admin ? "." : ", en attente de validation."}
              </p>
            )}
            {statut === "brouillon" && (
              <Bouton disabled={occupe || enCours > 0} onClick={() => void changerStatut("soumise")}>
                Soumettre la semaine
              </Bouton>
            )}
            {statut === "soumise" && (
              <Bouton variante="contour" disabled={occupe} onClick={() => void changerStatut("brouillon")}>
                {moi.admin ? "Renvoyer en brouillon" : "Repasser en brouillon"}
              </Bouton>
            )}
            {statut === "soumise" && moi.admin && (
              <Bouton disabled={occupe || enCours > 0} onClick={() => void changerStatut("validee")}>
                Valider
              </Bouton>
            )}
            {statut === "validee" && moi.admin && (
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
