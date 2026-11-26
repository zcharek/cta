import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { ROLE_LABEL, aujourdhui, formatDzd, type Role } from "../../../../shared/cockpit";
import { CATEGORIES, CATEGORIES_CLIENT, CATEGORIE_LABEL, detecter, type Categorie } from "../../../../shared/detection";
import type { DonneesFacture } from "../../../../shared/facture";
import { api, ErreurApi, type ClientAdmin, type Collaborateur } from "../api";
import { ACCEPT, envoyerFichier, lireTexte, ouvrirFichier } from "../coffre";
import { telechargerFacture } from "../documents";
import { naviguer, surClicLien } from "../routeur";
import { Avatar, Bouton, COULEUR_ROLE, Carte, Chargement, Erreur, Icone, Info, classeChamp } from "../ui";
import { FenetreClient, supprimerClient } from "./Equipe";
import { BadgeEnvoi, CHEMIN_PROSPECTS, Lien, cheminCompte, date as dateLongue, type Envoi } from "./EspaceClient";

type Doc = {
  id: string;
  categorie: Categorie;
  titre: string;
  date_document: string | null;
  expire_le: string | null;
  nom_fichier: string;
  type_mime: string;
  taille: number;
  ajoute_par: string | null;
  ajoute_le: string;
  versions_precedentes: number;
};
type Statut = "envoyee" | "payee" | "en_retard";
type Facture = {
  id: string;
  numero_affiche: string;
  mois: string;
  date_emission: string;
  jours: number | null;
  montant_ht: number;
  montant_ttc: number;
  importee: boolean;
  payee_le: string | null;
  statut: Statut;
};
type Membre = { id: string; nom: string; role: Role; fonction: string | null; actif: boolean; jours_mois: number };
type CompteSite = { id: string; nom: string; email: string; inscrit_le: string; dernier_envoi: Envoi | null; envois: number };
type Dossier = {
  client: ClientAdmin & { cree_le: string; jours_total: number };
  equipe: Membre[];
  comptesSite: CompteSite[];
  documents: Doc[] | null; // null : pas l'onglet Documents
  factures: Facture[] | null; // null : pas l'onglet Factures
  facturesEmises: number;
  peutSupprimer: boolean;
};

type Ligne = { cle: string; fichier: File; lecture: boolean; titre: string; categorie: Categorie; date: string; expireLe: string; etat: "pret" | "envoi" | "erreur"; message: string };

const dateFr = (iso: string | null) => (iso ? iso.slice(0, 10).split("-").reverse().join("/") : "");
const taille = (o: number) => (o < 1024 * 1024 ? `${Math.max(1, Math.round(o / 1024))} Ko` : `${(o / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`);
const jours = (n: number) => `${n.toLocaleString("fr-FR")} j`;
const moisFr = (m: string) => {
  const t = new Date(`${m}-01T12:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const STATUT: Record<Statut, { libelle: string; style: string }> = {
  envoyee: { libelle: "Envoyée", style: "bg-[#eef2fb] text-[#2f5bd3]" },
  payee: { libelle: "Payée", style: "bg-emerald-50 text-emerald-700" },
  en_retard: { libelle: "En retard", style: "bg-red-50 text-red-700" },
};

/** Rubriques du dossier : les trois types propres aux clients, puis le reste. */
const RUBRIQUES: { cle: "tous" | Categorie | "autres"; libelle: string }[] = [
  { cle: "tous", libelle: "Tous" },
  { cle: "contrat", libelle: "Contrats" },
  { cle: "nda", libelle: "NDA" },
  { cle: "bon_commande", libelle: "Bons de commande" },
  { cle: "autres", libelle: "Autres" },
];

function expiration(expireLe: string | null) {
  if (!expireLe) return null;
  const j = Math.round((new Date(`${expireLe}T12:00:00Z`).getTime() - new Date(`${aujourdhui()}T12:00:00Z`).getTime()) / 86400000);
  if (j < 0) return { libelle: `Expiré le ${dateFr(expireLe)}`, style: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" };
  if (j <= 30) return { libelle: `Expire le ${dateFr(expireLe)}`, style: "bg-orange-50 text-ck-orange-texte" };
  return { libelle: `Jusqu'au ${dateFr(expireLe)}`, style: "bg-ck-surface-2 text-ck-texte-2" };
}

function Extension({ nom }: { nom: string }) {
  const ext = (nom.split(".").pop() ?? "").slice(0, 4).toUpperCase();
  const pdf = ext === "PDF";
  return (
    <span aria-hidden="true" className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[10px] font-extrabold ${pdf ? "bg-orange-50 text-ck-orange-texte" : "bg-[#eef2fb] text-[#2f5bd3]"}`}>
      {ext || "DOC"}
    </span>
  );
}

/** Ligne « clé : valeur » de la fiche ; une valeur absente est signalée. */
function Donnee({ libelle, valeur, large = false }: { libelle: string; valeur: string | null | undefined; large?: boolean }) {
  return (
    <div className={large ? "sm:col-span-2" : undefined}>
      <dt className="text-xs font-semibold text-ck-texte-2">{libelle}</dt>
      <dd className={`mt-0.5 text-sm ${valeur ? "font-semibold text-ck-titre" : "italic text-ck-texte-2"}`}>{valeur || "À renseigner"}</dd>
    </div>
  );
}

function Fait({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-white/60">{libelle}</p>
      <p className="mt-0.5 truncate font-bold tabular-nums text-white">{valeur}</p>
    </div>
  );
}

const sansExtension = (nom: string) => nom.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();

export default function DossierClient({ id }: { id: string }) {
  const [d, setD] = useState<Dossier | null>(null);
  const [collaborateurs, setCollaborateurs] = useState<Collaborateur[]>([]);
  const [erreur, setErreur] = useState("");
  const [introuvable, setIntrouvable] = useState(false);
  const [message, setMessage] = useState("");
  const [fenetre, setFenetre] = useState(false);
  const [rubrique, setRubrique] = useState<(typeof RUBRIQUES)[number]["cle"]>("tous");
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [survol, setSurvol] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const entree = useRef<HTMLInputElement>(null);

  const charger = useCallback(() => {
    api<Dossier>(`clients/${id}/dossier`)
      .then((r) => {
        setD(r);
        document.title = `${r.client.nom} – Cockpit`;
      })
      .catch((e: ErreurApi) => (e.status === 404 ? setIntrouvable(true) : setErreur(e.message)));
  }, [id]);

  useEffect(charger, [charger]);
  // Liste des collaborateurs pour « Modifier la fiche » (choix de l'équipe)
  useEffect(() => {
    api<{ collaborateurs: Collaborateur[] }>("collaborateurs")
      .then((r) => setCollaborateurs(r.collaborateurs))
      .catch(() => undefined);
  }, []);

  const documents = useMemo(() => {
    if (!d?.documents) return [];
    if (rubrique === "tous") return d.documents;
    if (rubrique === "autres") return d.documents.filter((x) => !CATEGORIES_CLIENT.includes(x.categorie));
    return d.documents.filter((x) => x.categorie === rubrique);
  }, [d, rubrique]);

  if (introuvable)
    return (
      <Carte className="text-center">
        <p className="font-bold text-ck-titre">Ce client n'existe plus.</p>
        <p className="mt-1 text-sm text-ck-texte-2">Il a peut-être été supprimé.</p>
        <Bouton variante="contour" className="mt-4" onClick={() => naviguer("/reglages/clients")}>
          Retour aux clients
        </Bouton>
      </Carte>
    );
  if (!d) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const { client: c } = d;
  const equipeActive = d.equipe.some((m) => m.actif);
  const etat = !c.actif
    ? { libelle: "Archivé", style: "bg-white/10 text-white/80", point: "bg-white/60" }
    : equipeActive
      ? { libelle: "Actif", style: "bg-emerald-400/15 text-emerald-200", point: "bg-emerald-400" }
      : { libelle: "Sans équipe", style: "bg-white/10 text-white/80", point: "bg-white/60" };
  const tarif = c.forfait_mensuel_dzd ? `${formatDzd(c.forfait_mensuel_dzd)} / mois` : `${formatDzd(c.tjm_dzd)} / jour`;
  const factures = d.factures ?? [];
  const totalTtc = factures.reduce((s, f) => s + f.montant_ttc, 0);
  const aEncaisser = factures.filter((f) => f.statut !== "payee").reduce((s, f) => s + f.montant_ttc, 0);
  const enRetard = factures.filter((f) => f.statut === "en_retard").length;
  const voitDocs = d.documents !== null;
  const compte = (cle: (typeof RUBRIQUES)[number]["cle"]) =>
    !d.documents ? 0 : cle === "tous" ? d.documents.length : cle === "autres" ? d.documents.filter((x) => !CATEGORIES_CLIENT.includes(x.categorie)).length : d.documents.filter((x) => x.categorie === cle).length;

  async function action(f: () => Promise<unknown>) {
    setErreur("");
    try {
      await f();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  async function changerActif(actif: boolean) {
    if (!actif && !window.confirm(`Archiver ${c.nom} ? Il disparaît des listes de saisie ; ses documents et factures restent dans son dossier.`)) return;
    await action(async () => {
      await api(`clients/${c.id}`, { methode: "PATCH", corps: { actif } });
      setMessage(actif ? "Client réactivé." : "Client archivé.");
      charger();
    });
  }

  async function supprimer() {
    await action(async () => {
      if (await supprimerClient(c)) naviguer("/reglages/clients");
    });
  }

  // ——— Ajout de documents, rattachés d'office à ce client ———

  const modifier = (cle: string, p: Partial<Ligne>) => setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, ...p } : l)));

  async function ajouter(fichiers: FileList | File[]) {
    const liste = [...fichiers].map((f) => ({
      cle: crypto.randomUUID(),
      fichier: f,
      lecture: true,
      titre: sansExtension(f.name),
      categorie: (rubrique !== "tous" && rubrique !== "autres" ? rubrique : "contrat") as Categorie,
      date: "",
      expireLe: "",
      etat: "pret" as const,
      message: "",
    }));
    setLignes((ls) => [...ls, ...liste]);
    for (const l of liste) {
      // Type, titre et date lus dans le PDF quand c'est possible
      const r = detecter(await lireTexte(l.fichier), l.fichier.name, [], {});
      const categorie = r.type === "facture" ? l.categorie : r.texte || r.type !== "autre" ? r.type : l.categorie;
      modifier(l.cle, { lecture: false, categorie, titre: r.titre && r.titre !== "Document" ? r.titre : l.titre, date: r.date ?? "" });
    }
  }

  function deposer(e: DragEvent) {
    e.preventDefault();
    setSurvol(false);
    if (e.dataTransfer.files.length) void ajouter(e.dataTransfer.files);
  }

  async function enregistrer() {
    setEnCours(true);
    let ok = 0;
    for (const l of lignes) {
      if (l.lecture || l.etat === "envoi" || !l.titre.trim()) continue;
      modifier(l.cle, { etat: "envoi", message: "Envoi…" });
      try {
        const fichier = await envoyerFichier("documents", l.fichier, (p) => modifier(l.cle, { message: `Envoi… ${Math.round(p)} %` }));
        await api("coffre/documents", {
          corps: { fichier, nomFichier: l.fichier.name, categorie: l.categorie, titre: l.titre, dateDocument: l.date || null, expireLe: l.expireLe || null, clientId: c.id },
        });
        ok++;
        setLignes((ls) => ls.filter((x) => x.cle !== l.cle));
      } catch (e) {
        modifier(l.cle, { etat: "erreur", message: (e as Error).message });
      }
    }
    setEnCours(false);
    if (ok) {
      setMessage(ok > 1 ? `${ok} documents ajoutés au dossier.` : "Document ajouté au dossier.");
      charger();
    }
  }

  async function supprimerDocument(doc: Doc) {
    if (!window.confirm(`Supprimer « ${doc.titre} » (${doc.nom_fichier}) ?${doc.versions_precedentes ? " La version précédente redeviendra la version actuelle." : ""} Le fichier est effacé définitivement.`)) return;
    await action(async () => {
      await api(`coffre/documents/${doc.id}`, { methode: "DELETE" });
      charger();
    });
  }

  const prets = lignes.filter((l) => !l.lecture && l.etat !== "envoi" && l.titre.trim()).length;
  const champ = `${classeChamp} !py-1.5 text-sm`;

  return (
    <>
      <a href="/cockpit/reglages/clients" onClick={(e) => surClicLien(e, "/reglages/clients")} className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ck-texte-2 hover:text-ck-titre">
        <Icone nom="gauche" taille={16} /> Tous les clients
      </a>

      {/* ——— En-tête du dossier ——— */}
      <section aria-labelledby="titre-client" className="relative overflow-hidden rounded-[22px] bg-[#071538] p-6 text-white shadow-[0_24px_60px_-30px_rgba(7,21,56,0.8)] sm:p-8">
        <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(220,90,46,0.35),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-32 right-40 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(47,91,211,0.35),transparent)]" />
        <div className="relative flex flex-wrap items-start gap-5">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white text-2xl font-extrabold text-[#071538]">{c.nom.trim().charAt(0).toUpperCase()}</span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 id="titre-client" className="ck-titre text-2xl !text-white sm:text-3xl">
                {c.nom}
              </h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${etat.style}`}>
                <span className={`h-2 w-2 rounded-full ${etat.point}`} />
                {etat.libelle}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/70">{[c.raison_sociale_facture || c.raison_sociale, c.adresse].filter(Boolean).join(", ") || "Dossier client"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setFenetre(true)} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#071538] transition hover:bg-white/90">
              <Icone nom="crayon" taille={16} /> Modifier la fiche
            </button>
            <details className="relative">
              <summary aria-label="Plus d'actions" title="Plus d'actions" className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 [&::-webkit-details-marker]:hidden">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <circle cx="5" cy="12" r="1.8" />
                  <circle cx="12" cy="12" r="1.8" />
                  <circle cx="19" cy="12" r="1.8" />
                </svg>
              </summary>
              <div className="absolute right-0 z-20 mt-1 w-60 rounded-xl border border-ck-bordure bg-ck-surface p-1 text-left shadow-[var(--ck-ombre)]">
                {([
                  { libelle: c.actif ? "Archiver le client" : "Réactiver le client", action: () => void changerActif(!c.actif) },
                  d.factures !== null && c.actif && { libelle: "Émettre une facture", action: () => naviguer(`/factures?client=${c.id}`) },
                  d.peutSupprimer && { libelle: "Supprimer définitivement", action: () => void supprimer(), danger: true },
                ] as (false | { libelle: string; action: () => void; danger?: boolean })[])
                  .filter((a): a is { libelle: string; action: () => void; danger?: boolean } => !!a)
                  .map((a) => (
                    <button
                      key={a.libelle}
                      type="button"
                      onClick={(e) => {
                        (e.currentTarget.closest("details") as HTMLDetailsElement).open = false;
                        a.action();
                      }}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-ck-surface-2 ${a.danger ? "text-red-700" : "text-ck-titre"}`}
                    >
                      {a.libelle}
                    </button>
                  ))}
              </div>
            </details>
          </div>
        </div>
        <div className="relative mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-5 sm:grid-cols-4">
          <Fait libelle="Tarif" valeur={tarif} />
          <Fait libelle="Saisi ce mois" valeur={jours(c.jours_mois)} />
          <Fait libelle="Saisi au total" valeur={jours(c.jours_total)} />
          <Fait libelle="Client depuis" valeur={new Date(c.cree_le).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })} />
        </div>
      </section>

      {(message || erreur) && (
        <div className="mt-6">{erreur ? <Erreur>{erreur}</Erreur> : <Info>{message}</Info>}</div>
      )}

      {/* ——— Fiche et équipe ——— */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Carte className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-bold text-ck-titre">
              <Icone nom="identite" taille={18} className="text-ck-texte-2" /> Fiche de facturation
            </h2>
            <button type="button" onClick={() => setFenetre(true)} className="text-sm font-semibold text-[#2f5bd3] hover:underline">
              Modifier
            </button>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Donnee libelle="Raison sociale (facture)" valeur={c.raison_sociale_facture || c.raison_sociale} large />
            <Donnee libelle="RC" valeur={c.rc} />
            <Donnee libelle="NIF" valeur={c.nif} />
            <Donnee libelle="Adresse" valeur={c.adresse} large />
            <Donnee libelle="Contrat N°" valeur={c.numero_contrat} />
            <Donnee libelle="Projet / mission" valeur={c.mission} />
          </dl>
        </Carte>

        <Carte className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-bold text-ck-titre">
              <Icone nom="equipe" taille={18} className="text-ck-texte-2" /> Équipe
              <span className="rounded-full bg-ck-surface-2 px-2 py-0.5 text-xs font-semibold text-ck-texte-2">{d.equipe.length}</span>
            </h2>
            <button type="button" onClick={() => setFenetre(true)} className="text-sm font-semibold text-[#2f5bd3] hover:underline">
              Gérer
            </button>
          </div>
          {d.equipe.length === 0 ? (
            <p className="rounded-xl bg-ck-surface-2 px-4 py-6 text-center text-sm text-ck-texte-2">Aucune personne assignée à ce client.</p>
          ) : (
            <ul className="grid gap-3">
              {d.equipe.map((m) => (
                <li key={m.id} className={`flex items-center gap-3 ${m.actif ? "" : "opacity-60"}`}>
                  <Avatar nom={m.nom} couleur={COULEUR_ROLE[m.role]} taille={38} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ck-titre">{m.nom}</span>
                    <span className="block truncate text-xs text-ck-texte-2">{m.fonction || ROLE_LABEL[m.role]}{m.actif ? "" : " · archivé"}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ck-texte-2" title="Jours saisis ce mois pour ce client">
                    {jours(m.jours_mois)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Carte>
      </div>

      {/* ——— Espace client du site ——— */}
      <section aria-labelledby="titre-espace" className="mt-10">
        <div className="mb-4">
          <h2 id="titre-espace" className="ck-titre text-xl">
            Espace client
          </h2>
          <p className="mt-1 text-sm text-ck-texte-2">Les contacts de {c.nom} inscrits sur le site, et leurs questionnaires de cadrage.</p>
        </div>
        {d.comptesSite.length === 0 ? (
          <p className="rounded-xl bg-ck-surface-2 px-4 py-6 text-center text-sm text-ck-texte-2">
            Aucun compte rattaché.{" "}
            <Lien vers={CHEMIN_PROSPECTS} className="font-semibold text-[#2f5bd3] hover:underline">
              Rattacher un prospect
            </Lien>
          </p>
        ) : (
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {d.comptesSite.map((u) => (
                <li key={u.id}>
                  <Lien vers={cheminCompte(u.id)} className="flex flex-col gap-2 px-5 py-4 hover:bg-ck-surface-2 sm:flex-row sm:items-center">
                    <span className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar nom={u.nom} couleur="#2F5BD3" taille={38} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-ck-titre">{u.nom}</span>
                        <span className="block truncate text-xs text-ck-texte-2">
                          {u.email}
                          {u.dernier_envoi ? ` · ${u.dernier_envoi.titre}, envoyé le ${dateLongue(u.dernier_envoi.envoye_le)}` : ` · inscrit le ${dateLongue(u.inscrit_le)}`}
                          {u.envois > 1 ? ` (+${u.envois - 1})` : ""}
                        </span>
                      </span>
                    </span>
                    {u.dernier_envoi ? <BadgeEnvoi statut={u.dernier_envoi.statut} /> : <span className="text-sm font-bold text-ck-orange-texte">Questionnaire à envoyer →</span>}
                  </Lien>
                </li>
              ))}
            </ul>
          </Carte>
        )}
      </section>

      {/* ——— Documents ——— */}
      <section aria-labelledby="titre-docs" className="mt-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="titre-docs" className="ck-titre text-xl">
              Documents du client
            </h2>
            <p className="mt-1 text-sm text-ck-texte-2">Contrats, NDA, bons de commande et pièces échangées avec {c.nom}.</p>
          </div>
          {voitDocs && (
            <div role="group" aria-label="Filtrer par type" className="flex flex-wrap gap-1.5">
              {RUBRIQUES.map((r) => (
                <button
                  key={r.cle}
                  type="button"
                  aria-pressed={rubrique === r.cle}
                  onClick={() => setRubrique(r.cle)}
                  className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${rubrique === r.cle ? "bg-ck-plein text-ck-plein-texte" : "bg-ck-surface text-ck-titre ring-1 ring-ck-bordure hover:bg-ck-surface-2"}`}
                >
                  {r.libelle}
                  <span className="ml-1.5 tabular-nums opacity-70">{compte(r.cle)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!voitDocs ? (
          <Info>Les documents de ce client sont réservés aux personnes ayant l'onglet Documents.</Info>
        ) : (
          <>
            <input
              ref={entree}
              type="file"
              multiple
              accept={ACCEPT}
              className="sr-only"
              aria-label="Choisir des documents"
              onChange={(e) => {
                if (e.target.files?.length) void ajouter(e.target.files);
                e.target.value = "";
              }}
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setSurvol(true);
              }}
              onDragLeave={() => setSurvol(false)}
              onDrop={deposer}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-4 transition ${survol ? "border-ck-orange bg-orange-50/50" : "border-ck-bordure bg-ck-surface"}`}
            >
              <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eef2fb] text-ck-titre">
                <Icone nom="dossier" taille={20} />
              </span>
              <span className="min-w-0 flex-1 basis-52">
                <span className="block font-bold text-ck-titre">Déposez ici les fichiers de {c.nom}</span>
                <span className="block text-xs text-ck-texte-2">Ils sont rangés directement dans ce dossier. PDF, images, Word ou Excel, 25 Mo maximum.</span>
              </span>
              <Bouton variante="contour" onClick={() => entree.current?.click()}>
                Choisir des fichiers
              </Bouton>
            </div>

            {lignes.length > 0 && (
              <Carte className="mt-4 !p-4">
                <ul className="grid gap-3">
                  {lignes.map((l) => (
                    <li key={l.cle} className={`rounded-xl border p-3 ${l.etat === "erreur" ? "border-red-300" : "border-ck-bordure"}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ck-titre" title={l.fichier.name}>
                          {l.fichier.name} <span className="font-normal text-ck-texte-2">· {taille(l.fichier.size)}</span>
                        </p>
                        {l.lecture && <span className="text-xs text-ck-texte-2">Lecture…</span>}
                        {l.etat === "envoi" && <span className="text-xs font-semibold text-[#2f5bd3]">{l.message}</span>}
                        {l.etat !== "envoi" && (
                          <button type="button" onClick={() => setLignes((ls) => ls.filter((x) => x.cle !== l.cle))} aria-label={`Retirer ${l.fichier.name}`} className="grid h-7 w-7 place-items-center rounded-full text-ck-texte-2 hover:bg-ck-surface-2">
                            <Icone nom="fermer" taille={16} />
                          </button>
                        )}
                      </div>
                      <fieldset disabled={l.lecture || l.etat === "envoi"} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1fr_1fr]">
                        <label className="grid gap-1 text-xs font-semibold text-ck-texte-2">
                          Titre
                          <input value={l.titre} maxLength={200} onChange={(e) => modifier(l.cle, { titre: e.target.value })} className={champ} />
                        </label>
                        <label className="grid gap-1 text-xs font-semibold text-ck-texte-2">
                          Type
                          <select value={l.categorie} onChange={(e) => modifier(l.cle, { categorie: e.target.value as Categorie })} className={champ}>
                            {CATEGORIES.map((k) => (
                              <option key={k} value={k}>
                                {CATEGORIE_LABEL[k]}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="grid gap-1 text-xs font-semibold text-ck-texte-2">
                          Date du document
                          <input type="date" value={l.date} onChange={(e) => modifier(l.cle, { date: e.target.value })} className={champ} />
                        </label>
                        <label className="grid gap-1 text-xs font-semibold text-ck-texte-2">
                          Expire le (facultatif)
                          <input type="date" value={l.expireLe} onChange={(e) => modifier(l.cle, { expireLe: e.target.value })} className={champ} />
                        </label>
                      </fieldset>
                      {l.etat === "erreur" && <p className="mt-2 text-xs font-semibold text-red-700">{l.message}</p>}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-end gap-2">
                  <Bouton variante="discret" disabled={enCours} onClick={() => setLignes([])}>
                    Annuler
                  </Bouton>
                  <Bouton variante="orange" disabled={enCours || prets === 0} onClick={() => void enregistrer()}>
                    {enCours ? "Enregistrement…" : prets > 1 ? `Ajouter les ${prets} documents` : "Ajouter au dossier"}
                  </Bouton>
                </div>
              </Carte>
            )}

            <Carte className="mt-4 !p-0">
              {documents.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-ck-texte-2">{d.documents!.length ? "Aucun document de ce type." : `Aucun document pour ${c.nom} : déposez son contrat ou son NDA ci-dessus.`}</p>
              ) : (
                <ul className="divide-y divide-[color:var(--ck-bordure)]">
                  {documents.map((doc) => {
                    const ex = expiration(doc.expire_le);
                    return (
                      <li key={doc.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                        <Extension nom={doc.nom_fichier} />
                        <span className="min-w-0 flex-1 basis-56">
                          <span className="block truncate font-bold text-ck-titre">{doc.titre}</span>
                          <span className="block truncate text-xs text-ck-texte-2">
                            {doc.nom_fichier} · {taille(doc.taille)}
                            {doc.versions_precedentes > 0 && ` · ${doc.versions_precedentes + 1} versions`}
                          </span>
                        </span>
                        <span className="rounded-full bg-[#eef2fb] px-2.5 py-0.5 text-xs font-semibold text-[#2f5bd3]">{CATEGORIE_LABEL[doc.categorie]}</span>
                        {ex && <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ex.style}`}>{ex.libelle}</span>}
                        <span className="w-28 text-xs text-ck-texte-2">
                          {doc.date_document ? `Du ${dateFr(doc.date_document)}` : `Ajouté le ${dateFr(doc.ajoute_le)}`}
                          {doc.ajoute_par && <span className="block truncate">{doc.ajoute_par}</span>}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={() => void action(() => ouvrirFichier(`coffre/documents/${doc.id}/lien`))}>
                            Ouvrir
                          </Bouton>
                          {d.peutSupprimer && (
                            <button type="button" onClick={() => void supprimerDocument(doc)} aria-label={`Supprimer ${doc.titre}`} title="Supprimer" className="grid h-8 w-8 place-items-center rounded-full text-ck-texte-2 transition hover:bg-red-50 hover:text-red-700">
                              <Icone nom="fermer" taille={16} />
                            </button>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Carte>
          </>
        )}
      </section>

      {/* ——— Factures ——— */}
      {d.factures !== null && (
        <section aria-labelledby="titre-factures" className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="titre-factures" className="ck-titre text-xl">
                Factures
              </h2>
              <p className="mt-1 text-sm text-ck-texte-2">
                {factures.length === 0
                  ? "Aucune facture pour ce client."
                  : `${factures.length} facture${factures.length > 1 ? "s" : ""} · ${formatDzd(totalTtc)} TTC facturés${aEncaisser ? ` · ${formatDzd(aEncaisser)} à encaisser` : ""}`}
                {enRetard > 0 && <span className="font-semibold text-red-700"> · {enRetard} en retard</span>}
              </p>
            </div>
            {c.actif && (
              <Bouton variante="contour" onClick={() => naviguer(`/factures?client=${c.id}`)}>
                <Icone nom="facture" taille={16} /> Émettre une facture
              </Bouton>
            )}
          </div>
          {factures.length > 0 && (
            <Carte className="overflow-x-auto !p-0">
              <table className="w-full text-sm">
                <thead className="text-ck-texte-2">
                  <tr className="border-b border-ck-bordure">
                    {["N°", "Mois facturé", "Émise le", "Montant TTC", "Statut", ""].map((t, i) => (
                      <th key={i} scope="col" className={`px-4 py-3 font-semibold ${i === 3 ? "text-right" : "text-left"}`}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f.id} className="border-b border-ck-bordure last:border-0">
                      <th scope="row" className="px-4 py-3 text-left font-bold tabular-nums text-ck-titre">
                        {f.numero_affiche}
                        {f.importee && <span className="ml-2 rounded bg-ck-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-ck-texte-2">importée</span>}
                      </th>
                      <td className="px-4 py-3">{moisFr(f.mois)}</td>
                      <td className="whitespace-nowrap px-4 py-3">{dateFr(f.date_emission)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums text-ck-titre">{formatDzd(f.montant_ttc)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUT[f.statut].style}`} title={f.payee_le ? `Payée le ${dateFr(f.payee_le)}` : undefined}>
                          {STATUT[f.statut].libelle}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => void action(async () => (f.importee ? ouvrirFichier(`factures/${f.id}`) : telechargerFacture((await api<{ donnees: DonneesFacture }>(`factures/${f.id}`)).donnees)))}
                          className="font-bold text-ck-orange-texte hover:underline"
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Carte>
          )}
          {d.facturesEmises > 0 && d.peutSupprimer && (
            <p className="mt-3 text-xs text-ck-texte-2">Ce client a des factures émises par Cockpit : elles doivent être conservées, il ne peut donc qu'être archivé, pas supprimé.</p>
          )}
        </section>
      )}

      {fenetre && (
        <FenetreClient
          client={c}
          collaborateurs={collaborateurs}
          peutSupprimer={d.peutSupprimer}
          onFermer={() => setFenetre(false)}
          onEnregistre={() => {
            setFenetre(false);
            setMessage("Fiche enregistrée.");
            charger();
          }}
          onSupprime={() => naviguer("/reglages/clients")}
        />
      )}
    </>
  );
}
