import { useCallback, useEffect, useState, type FormEvent } from "react";
import { isAnswered, visibleSections, type Answers, type Section } from "../../../src/portal/api";
import { api } from "../api";
import { naviguer, surClicLien } from "../routeur";
import { Avatar, Bouton, Carte, Chargement, EnTete, Erreur, Info, Pastille, ZoneTexte, classeChamp } from "../ui";

// Comptes de l'espace client du site, dans l'onglet Clients : prospects (comptes non rattachés), fiche d'un compte
// (rattachement à un client, questionnaires envoyés) et réponses.
// Routes : /reglages/clients/prospects · /reglages/clients/comptes/<compte> · /reglages/clients/reponses/<envoi>

export const CHEMIN_PROSPECTS = "/reglages/clients/prospects";
export const cheminCompte = (id: string) => `/reglages/clients/comptes/${id}`;
export const cheminReponses = (id: string) => `/reglages/clients/reponses/${id}`;

export type Statut = "sent" | "in_progress" | "submitted";
export type Envoi = { id: string; titre: string; statut: Statut; envoye_le: string; repondu_le: string | null };
type Compte = {
  id: string;
  nom: string;
  email: string;
  societe: string | null;
  telephone: string | null;
  inscrit_le: string;
  client_id: string | null;
  client_nom: string | null;
  envois: Envoi[];
};
type Modele = { id: string; slug: string; titre: string; description: string | null };
type ClientCourt = { id: string; nom: string; actif: boolean };
type Donnees = { comptes: Compte[]; questionnaires: Modele[]; clients: ClientCourt[] };

const LIBELLE: Record<Statut, string> = { sent: "À compléter", in_progress: "En cours", submitted: "Répondu" };
const STYLE: Record<Statut, string> = {
  sent: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  in_progress: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  submitted: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
};

export const date = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "");

export function BadgeEnvoi({ statut }: { statut: Statut }) {
  return <Pastille className={STYLE[statut]}>{LIBELLE[statut]}</Pastille>;
}

export function Lien({ vers, children, className }: { vers: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={`/cockpit${vers}`} onClick={(e) => surClicLien(e, vers)} className={className}>
      {children}
    </a>
  );
}

function useDonnees() {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const charger = useCallback(() => {
    api<Donnees>("portail")
      .then(setDonnees)
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);
  return { donnees, erreur, charger };
}

/** Sélecteur des deux vues de l'onglet Clients : les clients (entreprises) et les prospects (comptes du site non rattachés). */
export function VuesClients({ actif, nbProspects }: { actif: "clients" | "prospects"; nbProspects?: number }) {
  const [n, setN] = useState<number | undefined>(nbProspects);
  useEffect(() => {
    if (nbProspects !== undefined) return setN(nbProspects);
    api<Donnees>("portail")
      .then((d) => setN(d.comptes.filter((c) => !c.client_id).length))
      .catch(() => setN(undefined));
  }, [nbProspects]);
  const vue = (cle: "clients" | "prospects", libelle: string, vers: string, compte?: number) => (
    <Lien
      vers={vers}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${actif === cle ? "bg-ck-surface text-ck-titre shadow-sm" : "text-ck-texte-2 hover:text-ck-titre"}`}
    >
      <span aria-current={actif === cle ? "page" : undefined}>{libelle}</span>
      {compte !== undefined && compte > 0 && <span className="rounded-full bg-ck-orange px-2 py-0.5 text-xs text-white">{compte}</span>}
    </Lien>
  );
  return (
    <nav aria-label="Vues de l'onglet Clients" className="mb-6 inline-flex gap-1 rounded-xl bg-ck-surface-2 p-1">
      {vue("clients", "Clients", "/reglages/clients")}
      {vue("prospects", "Prospects", CHEMIN_PROSPECTS, n)}
    </nav>
  );
}

function LigneCompte({ c }: { c: Compte }) {
  const dernier = c.envois[0];
  return (
    <li>
      <Lien vers={cheminCompte(c.id)} className="flex flex-col gap-2 px-5 py-4 hover:bg-ck-surface-2 sm:flex-row sm:items-center">
        <span className="flex min-w-0 flex-1 items-center gap-3">
          <Avatar nom={c.nom} couleur="#2F5BD3" />
          <span className="min-w-0">
            <span className="block truncate font-bold text-ck-titre">
              {c.nom}
              {(c.client_nom ?? c.societe) && <span className="font-normal text-ck-texte-2"> · {c.client_nom ?? c.societe}</span>}
            </span>
            <span className="block truncate text-sm text-ck-texte-2">
              {c.email} · inscrit le {date(c.inscrit_le)}
            </span>
          </span>
        </span>
        {dernier ? <BadgeEnvoi statut={dernier.statut} /> : <span className="text-sm font-bold text-ck-orange-texte">Questionnaire à envoyer →</span>}
      </Lien>
    </li>
  );
}

/** Vue Prospects : comptes du site pas encore rattachés à un client ; en dessous, ceux déjà rattachés. */
function Prospects({ donnees }: { donnees: Donnees }) {
  const prospects = donnees.comptes.filter((c) => !c.client_id);
  const rattaches = donnees.comptes.filter((c) => c.client_id);
  const sansQuestionnaire = prospects.filter((c) => c.envois.length === 0).length;
  const avecReponses = prospects.filter((c) => c.envois.some((e) => e.statut === "submitted")).length;
  return (
    <>
      <EnTete titre="Nos" accent="clients." sousTitre="Les personnes inscrites sur l'espace client du site. Rattachez-les à leur client une fois la relation engagée." />
      <VuesClients actif="prospects" nbProspects={prospects.length} />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          [prospects.length, prospects.length > 1 ? "prospects" : "prospect"],
          [sansQuestionnaire, "sans questionnaire"],
          [avecReponses, "avec réponses reçues"],
        ].map(([v, l]) => (
          <Carte key={l} className="!py-4">
            <p className="ck-titre text-3xl">{v}</p>
            <p className="text-sm text-ck-texte-2">{l}</p>
          </Carte>
        ))}
      </div>
      {prospects.length === 0 ? (
        <Info>
          Aucun prospect en attente. Les prospects s'inscrivent depuis{" "}
          <a href="/#/espace" className="font-semibold underline">
            l'espace client du site
          </a>
          .
        </Info>
      ) : (
        <Carte className="!p-0">
          <ul className="divide-y divide-[color:var(--ck-bordure)]">
            {prospects.map((c) => (
              <LigneCompte key={c.id} c={c} />
            ))}
          </ul>
        </Carte>
      )}
      {rattaches.length > 0 && (
        <section aria-labelledby="titre-rattaches" className="mt-10">
          <h2 id="titre-rattaches" className="ck-titre mb-4 text-lg text-ck-texte-2">
            Comptes rattachés à un client
          </h2>
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {rattaches.map((c) => (
                <LigneCompte key={c.id} c={c} />
              ))}
            </ul>
          </Carte>
        </section>
      )}
    </>
  );
}

/** Client auquel le compte est rattaché : choisir, créer depuis la société saisie, ou détacher. */
function Rattachement({ compte, clients, onChange }: { compte: Compte; clients: ClientCourt[]; onChange: () => void }) {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const nomPropose = (compte.societe ?? "").trim() || compte.nom;
  const existe = clients.some((c) => c.nom.toLowerCase() === nomPropose.toLowerCase());

  async function modifier(corps: { clientId: string | null } | { creerClient: true }) {
    setOccupe(true);
    setErreur("");
    try {
      await api(`portail/comptes/${compte.id}`, { methode: "PATCH", corps });
      onChange();
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <Carte aria-labelledby="titre-rattachement">
      <h2 id="titre-rattachement" className="ck-titre mb-1 text-xl">
        Client
      </h2>
      {compte.client_id ? (
        <div className="grid gap-3">
          <p className="text-sm text-ck-texte-2">
            Rattaché à{" "}
            <Lien vers={`/reglages/clients/${compte.client_id}`} className="font-bold text-ck-titre hover:underline">
              {compte.client_nom}
            </Lien>
            : ses questionnaires apparaissent dans le dossier du client.
          </p>
          <Bouton variante="contour" disabled={occupe} onClick={() => void modifier({ clientId: null })} className="justify-self-start">
            Détacher (repasser en prospect)
          </Bouton>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = new FormData(e.currentTarget).get("clientId");
            if (v) void modifier({ clientId: String(v) });
          }}
          className="grid gap-3"
        >
          <p className="text-sm text-ck-texte-2">Prospect. Rattachez ce compte au client pour lequel la personne travaille.</p>
          <label htmlFor="client-rattache" className="sr-only">
            Client
          </label>
          <select id="client-rattache" name="clientId" required defaultValue="" className={classeChamp}>
            <option value="" disabled>
              Choisir un client…
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
                {c.actif ? "" : " (archivé)"}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-2">
            <Bouton type="submit" disabled={occupe}>
              Rattacher
            </Bouton>
            {!existe && (
              <Bouton variante="contour" disabled={occupe} onClick={() => void modifier({ creerClient: true })}>
                Créer le client « {nomPropose} »
              </Bouton>
            )}
          </div>
        </form>
      )}
      {erreur && (
        <div className="mt-3">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
    </Carte>
  );
}

function FicheCompte({ compte, questionnaires, clients, onEnvoye }: { compte: Compte; questionnaires: Modele[]; clients: ClientCourt[]; onEnvoye: () => void }) {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setOccupe(true);
    setErreur("");
    setOk(false);
    try {
      await api("portail/envois", { corps: { compteId: compte.id, questionnaireId: f.get("questionnaireId"), message: f.get("message") } });
      form.reset();
      setOk(true);
      onEnvoye();
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <>
      <Lien
        vers={compte.client_id ? `/reglages/clients/${compte.client_id}` : CHEMIN_PROSPECTS}
        className="mb-4 inline-block text-sm font-bold text-ck-orange-texte hover:underline"
      >
        ← {compte.client_id ? `Dossier ${compte.client_nom}` : "Prospects"}
      </Lien>
      <EnTete titre={compte.nom} sousTitre={[compte.societe, compte.email, compte.telephone, `inscrit le ${date(compte.inscrit_le)}`].filter(Boolean).join(" · ")} />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <section aria-labelledby="titre-envois" className="lg:col-span-3">
          <h2 id="titre-envois" className="ck-titre mb-4 text-xl">
            Questionnaires envoyés
          </h2>
          {compte.envois.length === 0 ? (
            <Info>Aucun questionnaire envoyé pour l'instant.</Info>
          ) : (
            <ul className="grid gap-3">
              {compte.envois.map((e) => (
                <li key={e.id}>
                  <Lien vers={cheminReponses(e.id)} className="ck-carte flex items-center justify-between gap-4 p-5 hover:ring-2 hover:ring-ck-orange">
                    <span>
                      <span className="block font-bold text-ck-titre">{e.titre}</span>
                      <span className="text-sm text-ck-texte-2">
                        Envoyé le {date(e.envoye_le)}
                        {e.repondu_le && ` · répondu le ${date(e.repondu_le)}`}
                      </span>
                    </span>
                    <BadgeEnvoi statut={e.statut} />
                  </Lien>
                </li>
              ))}
            </ul>
          )}
        </section>
        <div className="grid gap-6 lg:col-span-2">
        <Rattachement compte={compte} clients={clients} onChange={onEnvoye} />
        <Carte aria-labelledby="titre-envoyer">
          <h2 id="titre-envoyer" className="ck-titre mb-4 text-xl">
            Envoyer un questionnaire
          </h2>
          <form onSubmit={envoyer} className="grid gap-4">
            <div>
              <label htmlFor="questionnaire" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                Questionnaire
              </label>
              <select id="questionnaire" name="questionnaireId" required className={classeChamp}>
                {questionnaires.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.titre}
                  </option>
                ))}
              </select>
            </div>
            <ZoneTexte
              libelle="Message au client (facultatif)"
              name="message"
              rows={4}
              placeholder={`Bonjour ${compte.nom.split(" ")[0]}, merci pour votre inscription. Ce questionnaire nous aidera à préparer notre premier échange.`}
            />
            {erreur && <Erreur>{erreur}</Erreur>}
            {ok && (
              <p role="status" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Envoyé. Le client le voit dans son espace.
              </p>
            )}
            <Bouton type="submit" disabled={occupe || questionnaires.length === 0}>
              {occupe ? "Envoi…" : "Envoyer"}
            </Bouton>
          </form>
        </Carte>
        </div>
      </div>
    </>
  );
}

type EnvoiDetaille = {
  id: string;
  titre: string;
  message: string | null;
  statut: Statut;
  envoye_le: string;
  repondu_le: string | null;
  maj_le: string;
  questionnaire: { description?: string; sections: Section[] };
  reponses: Answers;
  compte_id: string;
  nom: string;
  email: string;
  societe: string | null;
};

function Reponses({ id }: { id: string }) {
  const [envoi, setEnvoi] = useState<EnvoiDetaille | null>(null);
  const [erreur, setErreur] = useState("");
  useEffect(() => {
    api<{ envoi: EnvoiDetaille }>(`portail/envois/${id}`)
      .then((d) => setEnvoi(d.envoi))
      .catch((e: Error) => setErreur(e.message));
  }, [id]);
  if (!envoi) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const sections = visibleSections(envoi.questionnaire.sections, envoi.reponses ?? {});
  return (
    <>
      <Lien vers={cheminCompte(envoi.compte_id)} className="mb-4 inline-block text-sm font-bold text-ck-orange-texte hover:underline">
        ← {envoi.nom}
      </Lien>
      <EnTete
        titre={envoi.titre}
        sousTitre={`${envoi.nom}${envoi.societe ? ` · ${envoi.societe}` : ""} · envoyé le ${date(envoi.envoye_le)}${envoi.repondu_le ? ` · répondu le ${date(envoi.repondu_le)}` : ""}`}
        actions={<BadgeEnvoi statut={envoi.statut} />}
      />
      {envoi.statut !== "submitted" && (
        <div className="mb-6">
          <Info>
            {envoi.statut === "sent" ? "Le client n'a pas encore commencé." : `Réponses en cours, enregistrées le ${date(envoi.maj_le)}. Le client ne les a pas encore envoyées.`}
          </Info>
        </div>
      )}
      <div className="grid gap-6">
        {sections.map((s) => (
          <Carte key={s.id} aria-labelledby={`section-${s.id}`}>
            <h2 id={`section-${s.id}`} className="ck-titre mb-4 text-lg">
              {s.title}
            </h2>
            <dl className="grid gap-4">
              {s.questions.map((q) => {
                const r = envoi.reponses?.[q.id];
                return (
                  <div key={q.id}>
                    <dt className="text-sm font-semibold text-ck-titre">{q.label}</dt>
                    <dd className={`mt-1 whitespace-pre-line ${isAnswered(r) ? "text-ck-texte" : "italic text-ck-texte-2"}`}>
                      {isAnswered(r) ? (Array.isArray(r) ? r.join(" · ") : r) : "Sans réponse"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Carte>
        ))}
      </div>
    </>
  );
}

/** Pages de l'espace client dans l'onglet Clients : chemin = /reglages/clients/(prospects | comptes/<id> | reponses/<id>). */
export default function EspaceClient({ chemin }: { chemin: string }) {
  const parties = chemin.split("/").filter(Boolean); // ["reglages", "clients", ...]
  const { donnees, erreur, charger } = useDonnees();
  if (parties[2] === "reponses" && parties[3]) return <Reponses id={parties[3]} />;
  if (!donnees) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;
  if (parties[2] === "comptes" && parties[3]) {
    const compte = donnees.comptes.find((c) => c.id === parties[3]);
    if (!compte)
      return (
        <>
          <Erreur>Compte client introuvable.</Erreur>
          <Bouton variante="contour" className="mt-4" onClick={() => naviguer(CHEMIN_PROSPECTS)}>
            Prospects
          </Bouton>
        </>
      );
    return <FicheCompte key={compte.id} compte={compte} questionnaires={donnees.questionnaires} clients={donnees.clients} onEnvoye={charger} />;
  }
  return <Prospects donnees={donnees} />;
}

/** Ancienne adresse (/espace-client…) → nouvelle adresse dans l'onglet Clients. */
export function nouvelleAdresseEspaceClient(chemin: string): string {
  const p = chemin.split("/").filter(Boolean); // ["espace-client", ...]
  if (p[1] === "reponses" && p[2]) return cheminReponses(p[2]);
  if (p[1]) return cheminCompte(p[1]);
  return CHEMIN_PROSPECTS;
}
