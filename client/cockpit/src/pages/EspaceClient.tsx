import { useCallback, useEffect, useState, type FormEvent } from "react";
import { isAnswered, visibleSections, type Answers, type Section } from "../../../src/portal/api";
import { api } from "../api";
import { naviguer, surClicLien } from "../routeur";
import { Avatar, Bouton, Carte, Chargement, EnTete, Erreur, Info, Pastille, ZoneTexte, classeChamp } from "../ui";

// Espace client (portail des prospects et clients) piloté depuis Cockpit.
// Routes : /espace-client · /espace-client/<compte> · /espace-client/reponses/<envoi>

type Statut = "sent" | "in_progress" | "submitted";
type Envoi = { id: string; titre: string; statut: Statut; envoye_le: string; repondu_le: string | null };
type Compte = { id: string; nom: string; email: string; societe: string | null; telephone: string | null; inscrit_le: string; envois: Envoi[] };
type Modele = { id: string; slug: string; titre: string; description: string | null };
type Donnees = { comptes: Compte[]; questionnaires: Modele[] };

const LIBELLE: Record<Statut, string> = { sent: "À compléter", in_progress: "En cours", submitted: "Répondu" };
const STYLE: Record<Statut, string> = {
  sent: "bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200",
  in_progress: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  submitted: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
};

const date = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "");

function BadgeEnvoi({ statut }: { statut: Statut }) {
  return <Pastille className={STYLE[statut]}>{LIBELLE[statut]}</Pastille>;
}

function Lien({ vers, children, className }: { vers: string; children: React.ReactNode; className?: string }) {
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

function Liste({ donnees }: { donnees: Donnees }) {
  const { comptes } = donnees;
  const sansQuestionnaire = comptes.filter((c) => c.envois.length === 0).length;
  const avecReponses = comptes.filter((c) => c.envois.some((e) => e.statut === "submitted")).length;
  return (
    <>
      <EnTete titre="Espace" accent="client." sousTitre="Les comptes créés sur l'espace client du site, leurs questionnaires de cadrage et leurs réponses." />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          [comptes.length, comptes.length > 1 ? "comptes clients" : "compte client"],
          [sansQuestionnaire, "sans questionnaire"],
          [avecReponses, "avec réponses reçues"],
        ].map(([v, l]) => (
          <Carte key={l} className="!py-4">
            <p className="ck-titre text-3xl">{v}</p>
            <p className="text-sm text-ck-texte-2">{l}</p>
          </Carte>
        ))}
      </div>
      {comptes.length === 0 ? (
        <Info>
          Aucun compte pour l'instant. Les clients s'inscrivent depuis{" "}
          <a href="/#/espace" className="font-semibold underline">
            l'espace client du site
          </a>
          .
        </Info>
      ) : (
        <Carte className="!p-0">
          <ul className="divide-y divide-[color:var(--ck-bordure)]">
            {comptes.map((c) => {
              const dernier = c.envois[0];
              return (
                <li key={c.id}>
                  <Lien vers={`/espace-client/${c.id}`} className="flex flex-col gap-2 px-5 py-4 hover:bg-ck-surface-2 sm:flex-row sm:items-center">
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar nom={c.nom} couleur="#2F5BD3" />
                      <span className="min-w-0">
                        <span className="block truncate font-bold text-ck-titre">
                          {c.nom}
                          {c.societe && <span className="font-normal text-ck-texte-2"> · {c.societe}</span>}
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
            })}
          </ul>
        </Carte>
      )}
    </>
  );
}

function FicheCompte({ compte, questionnaires, onEnvoye }: { compte: Compte; questionnaires: Modele[]; onEnvoye: () => void }) {
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
      <Lien vers="/espace-client" className="mb-4 inline-block text-sm font-bold text-ck-orange-texte hover:underline">
        ← Tous les comptes
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
                  <Lien vers={`/espace-client/reponses/${e.id}`} className="ck-carte flex items-center justify-between gap-4 p-5 hover:ring-2 hover:ring-ck-orange">
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
        <Carte className="lg:col-span-2" aria-labelledby="titre-envoyer">
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
      <Lien vers={`/espace-client/${envoi.compte_id}`} className="mb-4 inline-block text-sm font-bold text-ck-orange-texte hover:underline">
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

export default function EspaceClient({ chemin }: { chemin: string }) {
  const parties = chemin.split("/").filter(Boolean); // ["espace-client", ...]
  const { donnees, erreur, charger } = useDonnees();
  if (parties[1] === "reponses" && parties[2]) return <Reponses id={parties[2]} />;
  if (!donnees) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;
  if (parties[1]) {
    const compte = donnees.comptes.find((c) => c.id === parties[1]);
    if (!compte)
      return (
        <>
          <Erreur>Compte client introuvable.</Erreur>
          <Bouton variante="contour" className="mt-4" onClick={() => naviguer("/espace-client")}>
            Tous les comptes
          </Bouton>
        </>
      );
    return <FicheCompte key={compte.id} compte={compte} questionnaires={donnees.questionnaires} onEnvoye={charger} />;
  }
  return <Liste donnees={donnees} />;
}
