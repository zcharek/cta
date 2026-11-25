import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ONGLETS, ONGLET_LABEL, aujourdhui, ROLES_ATTRIBUABLES, ROLE_DESCRIPTION, ROLE_LABEL, coordonneesManquantes, formatDzd, gereLesAcces, ongletsParDefaut, type Onglet, type Role } from "../../../../shared/cockpit";
import type { DonneesDocumentRh, TypeDocumentRh } from "../../../../shared/documents-rh";
import { api, type ClientAdmin, type Collaborateur, type Invitation, type Moi } from "../api";
import { telechargerDocumentRh } from "../documents";
import { surClicLien } from "../routeur";
import { Avatar, BadgeAcces, BadgeRole, Bouton, COULEUR_ROLE, Carte, Champ, Chargement, EnTete, Erreur, Icone, Info, Modale, Pastille, ZoneTexte } from "../ui";

type Donnees = { clients: ClientAdmin[]; collaborateurs: Collaborateur[] };

const jours = (n: number) => `${n.toLocaleString("fr-FR")} j`;

/** Chiffre clé : icône, valeur, libellé, et un raccourci facultatif (flèche). */
function Chiffre({ valeur, libelle, icone, vers }: { valeur: string | number; libelle: string; icone?: string; vers?: string }) {
  return (
    <Carte className="!py-5">
      <div className="flex items-center gap-4">
        {icone && (
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#eef2fb] text-ck-titre">
            <Icone nom={icone} taille={26} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="ck-titre text-3xl leading-none">{valeur}</p>
          <p className="mt-1 text-sm text-ck-texte-2">{libelle}</p>
        </div>
        {vers && (
          <a href={`/cockpit${vers}`} onClick={(e) => surClicLien(e, vers)} aria-label={`Voir : ${libelle}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef2fb] text-[#2f5bd3] transition hover:bg-[#dfe7fa]">
            <Icone nom="droite" taille={18} />
          </a>
        )}
      </div>
    </Carte>
  );
}

/** Liste de cases à cocher (clients d'un collaborateur, ou équipe d'un client). */
function Cases({ legende, options, choisis, onChange, vide }: { legende: string; options: { id: string; nom: string }[]; choisis: string[]; onChange: (ids: string[]) => void; vide: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ck-titre">{legende}</legend>
      {options.length === 0 ? (
        <p className="text-sm text-ck-texte-2">{vide}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {options.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-ck-bordure px-3 py-2 text-sm hover:bg-ck-surface-2 has-[:checked]:border-ck-plein">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[#071538]"
                checked={choisis.includes(o.id)}
                onChange={(e) => onChange(e.target.checked ? [...choisis, o.id] : choisis.filter((x) => x !== o.id))}
              />
              {o.nom}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function FenetreClient({ client, collaborateurs, onFermer, onEnregistre }: { client: ClientAdmin | "nouveau"; collaborateurs: Collaborateur[]; onFermer: () => void; onEnregistre: () => void }) {
  const existant = client === "nouveau" ? null : client;
  const [equipe, setEquipe] = useState<string[]>(existant?.profil_ids ?? []);
  const [forfait, setForfait] = useState(!!existant?.forfait_mensuel_dzd);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  async function envoyer(corps: Record<string, unknown>) {
    setErreur("");
    setOccupe(true);
    try {
      if (existant) await api(`clients/${existant.id}`, { methode: "PATCH", corps });
      else await api("clients", { corps });
      onEnregistre();
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
    }
  }

  function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    void envoyer({
      nom: f.nom,
      ...(forfait ? { forfaitMensuelDzd: f.forfait, joursForfait: f.joursForfait } : { tjmDzd: f.tjm, forfaitMensuelDzd: null }),
      raisonSociale: f.raisonSociale,
      adresse: f.adresse,
      numeroContrat: f.numeroContrat,
      mission: f.mission,
      raisonSocialeFacture: f.raisonSocialeFacture,
      rc: f.rc,
      nif: f.nif,
      profilIds: equipe,
    });
  }

  return (
    <Modale
      titre={existant ? existant.nom : "Nouveau client"}
      ouverte
      onFermer={onFermer}
      pied={
        <>
          {existant?.actif && (
            <Bouton variante="danger" className="mr-auto" disabled={occupe} onClick={() => void envoyer({ actif: false })}>
              Archiver
            </Bouton>
          )}
          <Bouton variante="discret" onClick={onFermer}>
            Annuler
          </Bouton>
          <Bouton type="submit" form="form-client" disabled={occupe}>
            {existant ? "Enregistrer" : "Créer le client"}
          </Bouton>
        </>
      }
    >
      <form id="form-client" onSubmit={soumettre} className="grid gap-5">
        <Champ libelle="Nom du client" name="nom" required maxLength={120} defaultValue={existant?.nom} autoFocus />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ck-titre">Tarif</legend>
          <div className="mb-3 flex gap-2">
            {[
              [false, "TJM"],
              [true, "Forfait mensuel"],
            ].map(([valeur, libelle]) => (
              <label key={String(valeur)} className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-ck-bordure px-3 py-2 text-sm has-[:checked]:border-ck-plein has-[:checked]:font-semibold">
                <input type="radio" name="mode-tarif" checked={forfait === valeur} onChange={() => setForfait(valeur as boolean)} className="accent-[#071538]" />
                {libelle}
              </label>
            ))}
          </div>
          {forfait ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ libelle="Forfait mensuel (DZD HT)" name="forfait" required inputMode="numeric" pattern="[0-9 ]+" defaultValue={existant?.forfait_mensuel_dzd ?? ""} />
              <Champ libelle="Jours de référence" name="joursForfait" required inputMode="numeric" pattern="[0-9]+" defaultValue={existant?.jours_forfait ?? 22} aide="Tarif journalier = forfait ÷ ces jours." />
            </div>
          ) : (
            <Champ libelle="TJM (DZD par jour)" name="tjm" required inputMode="numeric" pattern="[0-9 ]+" defaultValue={existant?.tjm_dzd ?? ""} aide="Montant hors taxes facturé pour une journée." />
          )}
        </fieldset>
        <fieldset className="grid gap-4">
          <legend className="mb-1 text-sm font-semibold text-ck-titre">
            Timesheet et facture <span className="font-normal text-ck-texte-2">(facultatif, modifiable à tout moment)</span>
          </legend>
          <Champ libelle="Raison sociale" name="raisonSociale" maxLength={200} defaultValue={existant?.raison_sociale ?? ""} placeholder={existant?.nom ?? "Nom légal du client"} aide="Nom affiché sur le timesheet. Vide : le nom du client." />
          <ZoneTexte libelle="Adresse" name="adresse" rows={2} maxLength={300} defaultValue={existant?.adresse ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ libelle="Contrat N°" name="numeroContrat" maxLength={80} defaultValue={existant?.numero_contrat ?? ""} placeholder="N°2025-09-XXXX" />
            <Champ libelle="Projet / mission" name="mission" maxLength={200} defaultValue={existant?.mission ?? ""} aide="Facultatif." />
          </div>
          <Champ libelle="Raison sociale sur la facture" name="raisonSocialeFacture" maxLength={200} defaultValue={existant?.raison_sociale_facture ?? ""} placeholder="SARL …" aide="Vide : la raison sociale ci-dessus." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ libelle="RC" name="rc" maxLength={60} defaultValue={existant?.rc ?? ""} placeholder="16/00-0000000 B 00" />
            <Champ libelle="NIF" name="nif" maxLength={60} defaultValue={existant?.nif ?? ""} inputMode="numeric" />
          </div>
        </fieldset>
        <Cases legende="Collaborateurs assignés" options={collaborateurs.filter((c) => c.actif)} choisis={equipe} onChange={setEquipe} vide="Aucun collaborateur pour l'instant." />
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modale>
  );
}

/** Attestation ou certificat de travail d'un collaborateur, avec son poste et sa date de sortie. */
function FenetreDocuments({ collaborateur: c, onFermer, onEnregistre }: { collaborateur: Collaborateur; onFermer: () => void; onEnregistre: () => void }) {
  const [type, setType] = useState<TypeDocumentRh>(c.actif ? "attestation" : "certificat");
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  async function generer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setErreur("");
    setOccupe(true);
    try {
      const r = await api<{ donnees: DonneesDocumentRh }>(`documents/${type}`, { corps: { profilId: c.id, fonction: f.fonction, ...(type === "certificat" ? { dateSortie: f.dateSortie } : {}) } });
      await telechargerDocumentRh(r.donnees);
      onEnregistre();
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
    }
  }

  return (
    <Modale
      titre={`Documents de ${c.nom}`}
      ouverte
      onFermer={onFermer}
      pied={
        <>
          <Bouton variante="discret" onClick={onFermer}>
            Fermer
          </Bouton>
          <Bouton type="submit" form="form-documents" variante="orange" disabled={occupe}>
            <Icone nom="document" taille={16} /> {occupe ? "Génération…" : type === "attestation" ? "Générer l'attestation" : "Générer le certificat"}
          </Bouton>
        </>
      }
    >
      <form id="form-documents" onSubmit={generer} className="grid gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ck-titre">Document</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["attestation", "Attestation de travail", "Employé à ce jour, depuis sa date d'entrée."],
                ["certificat", "Certificat de travail", "Fin de contrat : de la date d'entrée à la date de sortie."],
              ] as const
            ).map(([cle, titre, detail]) => (
              <label key={cle} className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${type === cle ? "border-ck-orange bg-orange-50/40" : "border-ck-bordure"}`}>
                <input type="radio" name="type" value={cle} checked={type === cle} onChange={() => setType(cle)} className="mt-1 accent-[#dc5a2e]" />
                <span>
                  <span className="block text-sm font-bold text-ck-titre">{titre}</span>
                  <span className="block text-xs text-ck-texte-2">{detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ libelle="Poste" name="fonction" required maxLength={120} defaultValue={c.fonction ?? ""} placeholder="Ingénieur QA" />
          <Champ libelle="Date d'entrée" name="dateEntree" type="date" value={c.date_entree ?? ""} readOnly aide={`Matricule ${c.matricule}.`} />
          {type === "certificat" && <Champ libelle="Date de sortie" name="dateSortie" type="date" required min={c.date_entree ?? undefined} defaultValue={c.date_sortie ?? aujourdhui()} />}
        </div>
        <p className="text-xs text-ck-texte-2">La date et le lieu de naissance viennent de « Mon profil » du collaborateur. Le poste et la date de sortie sont enregistrés sur sa fiche.</p>
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modale>
  );
}

const confirmationSuppression = (nom: string) =>
  `Supprimer définitivement ${nom} ?\n\nSon compte, ses affectations et tous ses temps saisis seront effacés. Les factures déjà émises ne changent pas. Cette action est irréversible : pour simplement couper l'accès, archivez-le.`;

function FenetreCollaborateur({
  collaborateur,
  clients,
  moi,
  onFermer,
  onEnregistre,
}: {
  collaborateur: Collaborateur | "nouveau";
  clients: ClientAdmin[];
  moi: Moi;
  onFermer: () => void;
  onEnregistre: (invitation?: Invitation) => void;
}) {
  const existant = collaborateur === "nouveau" ? null : collaborateur;
  const [role, setRole] = useState<Role>(existant?.role ?? "collaborateur");
  const [choisis, setChoisis] = useState<string[]>(existant?.client_ids ?? []);
  // Onglets : ceux de la personne ; tant qu'on n'y touche pas, ils suivent le type choisi.
  const [onglets, setOnglets] = useState<Onglet[]>(existant?.onglets ?? ongletsParDefaut("collaborateur"));
  const [ongletsTouches, setOngletsTouches] = useState(false);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const soiMeme = existant?.id === moi.id;
  const founder = existant?.role === "founder";
  // Type, onglets, archivage et e-mail d'un autre : Founder, Co-Founder et QA Manager uniquement.
  const gestion = moi.gereAcces && !founder;
  const rolesProposes = moi.gereAcces ? ROLES_ATTRIBUABLES : (["collaborateur", "assistant"] as Role[]);

  function choisirRole(r: Role) {
    setRole(r);
    if (!ongletsTouches) setOnglets(ongletsParDefaut(r));
  }

  function basculerOnglet(o: Onglet, actif: boolean) {
    setOngletsTouches(true);
    setOnglets((liste) => ONGLETS.filter((x) => (x === o ? actif : liste.includes(x))));
  }

  async function envoyer(corps: Record<string, unknown>) {
    setErreur("");
    setOccupe(true);
    try {
      if (existant) {
        await api(`collaborateurs/${existant.id}`, { methode: "PATCH", corps });
        onEnregistre();
      } else {
        const r = await api<{ invitation: Invitation }>("collaborateurs", { corps });
        onEnregistre(r.invitation);
      }
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
    }
  }

  async function supprimer() {
    if (!existant || !window.confirm(confirmationSuppression(existant.nom))) return;
    setErreur("");
    setOccupe(true);
    try {
      await api(`collaborateurs/${existant.id}`, { methode: "DELETE" });
      onEnregistre();
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
    }
  }

  function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    void envoyer({
      nom: f.nom,
      ...(founder || (!soiMeme && existant && !moi.gereAcces) ? {} : { email: f.email }),
      ...(founder || (existant && !moi.gereAcces) ? {} : { role }),
      ...(gestion && ongletsTouches ? { onglets } : {}),
      fonction: f.fonction ?? "",
      clientIds: choisis,
    });
  }

  return (
    <Modale
      titre={existant ? existant.nom : "Inviter un collaborateur"}
      ouverte
      onFermer={onFermer}
      pied={
        <>
          {existant && !soiMeme && gestion && (
            <span className="mr-auto flex gap-2">
              {existant.actif && (
                <Bouton variante="danger" disabled={occupe} onClick={() => void envoyer({ actif: false })}>
                  Archiver
                </Bouton>
              )}
              <Bouton variante="discret" className="!text-red-700" disabled={occupe} onClick={() => void supprimer()}>
                Supprimer
              </Bouton>
            </span>
          )}
          <Bouton variante="discret" onClick={onFermer}>
            Annuler
          </Bouton>
          <Bouton type="submit" form="form-collaborateur" disabled={occupe}>
            {existant ? "Enregistrer" : "Envoyer l'invitation"}
          </Bouton>
        </>
      }
    >
      <form id="form-collaborateur" onSubmit={soumettre} className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ libelle="Prénom et nom" name="nom" required maxLength={120} defaultValue={existant?.nom} autoComplete="off" autoFocus />
          <Champ libelle="Poste" name="fonction" maxLength={120} defaultValue={existant?.fonction ?? ""} placeholder="Ingénieur QA" autoComplete="off" aide="Repris sur le bulletin de paie, l'attestation et le certificat de travail." />
        </div>
        <Champ
          libelle="Adresse e-mail"
          name="email"
          type="email"
          required
          defaultValue={existant?.email}
          autoComplete="off"
          readOnly={founder || (!!existant && !soiMeme && !moi.gereAcces)}
          aide={founder ? "L'adresse du compte Founder ne peut pas être modifiée." : existant ? undefined : "Le collaborateur y recevra le lien pour définir son mot de passe."}
        />
        {founder ? (
          <Info>Compte Founder : il a toujours accès à tous les onglets et ne peut être ni archivé ni changé de type.</Info>
        ) : (
          <fieldset disabled={!!existant && !moi.gereAcces}>
            <legend className="mb-2 text-sm font-semibold text-ck-titre">Type</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {rolesProposes.map((r) => {
                const bloque = soiMeme && !gereLesAcces({ role: r, actif: true });
                return (
                  <label
                    key={r}
                    className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-ck-orange ${
                      role === r ? "border-ck-plein bg-ck-surface-2" : "border-ck-bordure hover:bg-ck-surface-2"
                    } ${bloque ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <input type="radio" name="role" value={r} checked={role === r} disabled={bloque} onChange={() => choisirRole(r)} className="sr-only" />
                    <span className="flex items-center gap-2 font-bold text-ck-titre">
                      <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COULEUR_ROLE[r] }} />
                      {ROLE_LABEL[r]}
                    </span>
                    <span className="text-xs text-ck-texte-2">{ROLE_DESCRIPTION[r]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {gestion && (
          <fieldset>
            <legend className="mb-1 text-sm font-semibold text-ck-titre">Onglets visibles</legend>
            <p className="mb-2 text-xs text-ck-texte-2">Pages de Cockpit auxquelles cette personne a accès. Par défaut, celles de son type.</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {ONGLETS.map((o) => {
                const bloque = soiMeme && o === "collaborateurs";
                return (
                  <label
                    key={o}
                    className={`flex items-center gap-2.5 rounded-[10px] border border-ck-bordure px-3 py-2 text-sm has-[:checked]:border-ck-plein ${bloque ? "opacity-60" : "cursor-pointer hover:bg-ck-surface-2"}`}
                  >
                    <input type="checkbox" checked={onglets.includes(o)} disabled={bloque} onChange={(e) => basculerOnglet(o, e.target.checked)} className="h-4 w-4 accent-[color:var(--ck-orange)]" />
                    {ONGLET_LABEL[o]}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        <Cases legende="Clients assignés" options={clients.filter((c) => c.actif)} choisis={choisis} onChange={setChoisis} vide="Aucun client pour l'instant : créez-en un pour pouvoir l'assigner." />
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modale>
  );
}

/** Deux pages distinctes : « Clients » (/reglages/clients) et « Collaborateurs » (/reglages/collaborateurs). */
export default function Equipe({ moi, vue }: { moi: Moi; vue: "clients" | "collaborateurs" }) {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState<{ texte: string; lien?: string } | null>(null);
  const [fenetreClient, setFenetreClient] = useState<ClientAdmin | "nouveau" | null>(null);
  const [fenetreCollab, setFenetreCollab] = useState<Collaborateur | "nouveau" | null>(null);
  const [fenetreDocs, setFenetreDocs] = useState<Collaborateur | null>(null);

  const charger = useCallback(() => {
    Promise.all([api<{ clients: ClientAdmin[] }>("clients"), api<{ collaborateurs: Collaborateur[] }>("collaborateurs")])
      .then(([a, b]) => setDonnees({ clients: a.clients, collaborateurs: b.collaborateurs }))
      .catch((e: Error) => setErreur(e.message));
  }, []);

  useEffect(charger, [charger]);

  function annoncerInvitation(nom: string, inv?: Invitation) {
    if (!inv) return;
    if (inv.avertissement) setMessage({ texte: `Compte de ${nom} créé, mais : ${inv.avertissement}` });
    else setMessage({ texte: `Invitation envoyée à ${nom}.`, lien: inv.lien });
  }

  async function renvoyer(c: Collaborateur) {
    setMessage(null);
    try {
      const r = await api<{ invitation: Invitation }>(`collaborateurs/${c.id}/invitation`, {
        methode: "POST",
      });
      annoncerInvitation(c.nom, r.invitation);
      charger();
    } catch (e) {
      setMessage({ texte: (e as Error).message });
    }
  }

  async function reactiver(chemin: string) {
    setMessage(null);
    try {
      await api(chemin, { methode: "PATCH", corps: { actif: true } });
      charger();
    } catch (e) {
      setMessage({ texte: (e as Error).message });
    }
  }

  async function supprimerArchive(id: string, nom: string) {
    if (!window.confirm(confirmationSuppression(nom))) return;
    setMessage(null);
    try {
      await api(`collaborateurs/${id}`, { methode: "DELETE" });
      charger();
    } catch (e) {
      setMessage({ texte: (e as Error).message });
    }
  }

  if (erreur) return <Erreur>{erreur}</Erreur>;
  if (!donnees) return <Chargement />;

  const { clients, collaborateurs } = donnees;
  const clientsActifs = clients.filter((c) => c.actif);
  const collabsActifs = collaborateurs.filter((c) => c.actif);
  const nomClient = new Map(clients.map((c) => [c.id, c.nom]));
  const nomCollab = new Map(collaborateurs.map((c) => [c.id, c.nom]));
  const joursMois = collaborateurs.reduce((s, c) => s + c.jours_mois, 0);
  const archives =
    vue === "clients"
      ? clients.filter((c) => !c.actif).map((c) => ({ type: "client" as const, ...c }))
      : collaborateurs.filter((c) => !c.actif).map((c) => ({ type: "collaborateur" as const, ...c }));
  const assignes = new Set(clientsActifs.flatMap((c) => c.profil_ids)).size;
  const invitations = collabsActifs.filter((c) => c.statut === "invitation").length;

  return (
    <>
      {vue === "clients" ? (
        <EnTete
          titre="Nos"
          accent="clients."
          sousTitre="Gérez et suivez vos clients en un coup d'œil."
          actions={
            <Bouton onClick={() => setFenetreClient("nouveau")}>
              <Icone nom="plus" taille={18} /> Nouveau client
            </Bouton>
          }
        />
      ) : (
        <EnTete
          titre="L'équipe"
          accent="CTA."
          actions={
            <Bouton onClick={() => setFenetreCollab("nouveau")}>
              <Icone nom="plus" taille={18} /> Inviter un collaborateur
            </Bouton>
          }
        />
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {vue === "clients" ? (
          <>
            <Chiffre icone="batiment" valeur={clientsActifs.length} libelle={clientsActifs.length > 1 ? "clients" : "client"} />
            <Chiffre icone="equipe" valeur={assignes} libelle={assignes > 1 ? "personnes assignées" : "personne assignée"} vers="/reglages/collaborateurs" />
            <Chiffre icone="calendrier" valeur={jours(joursMois)} libelle="saisis ce mois" vers="/recap" />
          </>
        ) : (
          <>
            <Chiffre valeur={collabsActifs.length} libelle={collabsActifs.length > 1 ? "collaborateurs" : "collaborateur"} />
            <Chiffre valeur={invitations} libelle={invitations > 1 ? "invitations en attente" : "invitation en attente"} />
            <Chiffre valeur={jours(joursMois)} libelle="saisis ce mois" />
          </>
        )}
      </div>

      {message && (
        <div className="mb-6">
          <Info>
            <p>{message.texte}</p>
            {message.lien && (
              <p className="mt-2 break-all text-xs text-ck-texte-2">
                E-mail non configuré (RESEND_API_KEY absent en local) : lien à transmettre{" "}
                <a href={message.lien} className="font-semibold text-ck-orange-texte underline">
                  {message.lien}
                </a>
              </p>
            )}
          </Info>
        </div>
      )}

      {vue === "clients" && (
        <section aria-label="Clients actifs">
          {clientsActifs.length === 0 ? (
            <Carte className="text-sm text-ck-texte-2">Aucun client. Créez votre premier client avec « Nouveau client ».</Carte>
          ) : (
            <ul className="grid gap-5 lg:grid-cols-2">
              {clientsActifs.map((c) => {
                const actif = c.profil_ids.length > 0;
                return (
                  <li key={c.id}>
                    <Carte className="ck-halo h-full !p-6">
                      <div className="relative z-10 flex items-start gap-4">
                        <Avatar nom={c.nom} couleur="#071538" taille={64} />
                        <div className="min-w-0 flex-1">
                          <p className="ck-titre truncate text-xl">{c.nom}</p>
                          <p className="mt-0.5 text-ck-texte-2">
                            {c.forfait_mensuel_dzd ? (
                              <>
                                <span className="font-semibold text-ck-titre">{formatDzd(c.forfait_mensuel_dzd)}</span> / mois ({c.jours_forfait} j)
                              </>
                            ) : (
                              <>
                                <span className="font-semibold text-ck-titre">{formatDzd(c.tjm_dzd)}</span> / jour
                              </>
                            )}{" "}
                            · {jours(c.jours_mois)} ce mois
                          </p>
                          {(c.raison_sociale || c.numero_contrat) && (
                            <p className="mt-0.5 truncate text-xs text-ck-texte-2">{[c.raison_sociale, c.numero_contrat].filter(Boolean).join(" · ")}</p>
                          )}
                        </div>
                        <span
                          title={actif ? "Au moins une personne est assignée à ce client." : "Aucune personne assignée à ce client."}
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${actif ? "bg-emerald-50 text-emerald-700" : "bg-[var(--ck-champ)] text-ck-texte-2"}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${actif ? "bg-emerald-500" : "bg-ck-texte-2"}`} />
                          {actif ? "Actif" : "Inactif"}
                        </span>
                      </div>
                      <div className="relative z-10 mt-5 flex items-start gap-2.5 border-t border-ck-bordure pt-4 text-ck-texte">
                        <Icone nom="profil" taille={20} className="mt-0.5 shrink-0 text-ck-texte-2" />
                        <span className="min-w-0">{actif ? c.profil_ids.map((id) => nomCollab.get(id)).filter(Boolean).join(", ") : <span className="text-ck-texte-2">Aucune personne assignée</span>}</span>
                      </div>
                      <div className="relative z-10 mt-5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setFenetreClient(c)}
                          className="inline-flex items-center gap-2 rounded-full border-2 border-[#2f5bd3]/70 px-4 py-2 text-sm font-bold text-[#1f3f9c] transition hover:bg-[#eef2fb]"
                        >
                          <Icone nom="graphique" taille={18} /> Gérer l'équipe
                        </button>
                        <button
                          type="button"
                          onClick={() => setFenetreClient(c)}
                          aria-label={`Ouvrir la fiche de ${c.nom}`}
                          className="grid h-10 w-10 place-items-center rounded-full bg-ck-surface text-[#2f5bd3] shadow-[var(--ck-ombre)] transition hover:bg-[#eef2fb]"
                        >
                          <Icone nom="droite" taille={18} />
                        </button>
                      </div>
                    </Carte>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {vue === "collaborateurs" && (
        <section aria-label="Collaborateurs actifs">
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {collabsActifs.map((c) => (
                <li key={c.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                  <Avatar nom={c.nom} couleur={COULEUR_ROLE[c.role]} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ck-titre">{c.nom}</p>
                      <span className="rounded-md bg-[var(--ck-champ)] px-1.5 py-0.5 text-xs font-semibold tabular-nums text-ck-texte-2" title={c.date_entree ? `Entré le ${c.date_entree.split("-").reverse().join("/")}` : undefined}>
                        N° {c.matricule}
                      </span>
                      <BadgeRole role={c.role} />
                      <BadgeAcces statut={c.statut} />
                    </div>
                    {c.fonction && <p className="text-sm font-semibold text-ck-texte">{c.fonction}</p>}
                    <p className="truncate text-sm text-ck-texte-2">{[c.email, c.telephone].filter(Boolean).join(" · ")}</p>
                    {(c.adresse || c.ville || c.wilaya) && <p className="truncate text-sm text-ck-texte-2">{[c.adresse, c.ville, c.wilaya].filter(Boolean).join(", ")}</p>}
                    {c.statut === "actif" && coordonneesManquantes({ ...c, nin: c.nin_renseigne ? "oui" : null, numero_ss: c.ss_renseigne ? "oui" : null, numero_compte: c.compte_renseigne ? "oui" : null }).length > 0 && (
                      <p className="mt-1 text-xs font-semibold text-ck-orange-texte" title={`Manque : ${coordonneesManquantes({ ...c, nin: c.nin_renseigne ? "oui" : null, numero_ss: c.ss_renseigne ? "oui" : null, numero_compte: c.compte_renseigne ? "oui" : null }).join(", ")}`}>
                        Coordonnées incomplètes ({coordonneesManquantes({ ...c, nin: c.nin_renseigne ? "oui" : null, numero_ss: c.ss_renseigne ? "oui" : null, numero_compte: c.compte_renseigne ? "oui" : null }).length} {coordonneesManquantes({ ...c, nin: c.nin_renseigne ? "oui" : null, numero_ss: c.ss_renseigne ? "oui" : null, numero_compte: c.compte_renseigne ? "oui" : null }).length > 1 ? "champs manquants" : "champ manquant"})
                      </p>
                    )}
                    <p className="mt-1 text-sm text-ck-texte-2">
                      {c.client_ids.length ? c.client_ids.map((id) => nomClient.get(id)).join(", ") : "Aucun client"} · {jours(c.jours_mois)} ce mois
                    </p>
                    {c.onglets_personnalises && <p className="mt-1 text-xs text-ck-texte-2">Onglets : {c.onglets.length ? c.onglets.map((o) => ONGLET_LABEL[o]).join(", ") : "aucun"}</p>}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {c.statut === "invitation" && (
                      <Bouton variante="discret" className="!px-3 !py-2" onClick={() => void renvoyer(c)}>
                        Renvoyer l'invitation
                      </Bouton>
                    )}
                    <Bouton variante="discret" className="!px-3 !py-2" onClick={() => setFenetreDocs(c)}>
                      <Icone nom="document" taille={16} /> Documents
                    </Bouton>
                    <Bouton variante="contour" className="!px-3 !py-2" onClick={() => setFenetreCollab(c)}>
                      Modifier
                    </Bouton>
                  </div>
                </li>
              ))}
            </ul>
          </Carte>
        </section>
      )}

      {archives.length > 0 && (
        <section aria-labelledby="titre-archives" className="mt-10">
          <h2 id="titre-archives" className="ck-titre mb-4 text-lg text-ck-texte-2">
            Archivés
          </h2>
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {archives.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3 text-ck-texte-2">
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-semibold">{a.nom}</span> · {a.type === "client" ? "Client" : ROLE_LABEL[a.role]}
                  </span>
                  {(a.type === "client" || moi.gereAcces) && (
                    <Bouton variante="discret" className="!px-3 !py-1.5" onClick={() => void reactiver(`${a.type === "client" ? "clients" : "collaborateurs"}/${a.id}`)}>
                      Réactiver
                    </Bouton>
                  )}
                  {a.type === "collaborateur" && (
                    <Bouton variante="discret" className="!px-3 !py-1.5" onClick={() => setFenetreDocs(a)}>
                      Documents
                    </Bouton>
                  )}
                  {a.type === "collaborateur" && moi.gereAcces && (
                    <Bouton variante="discret" className="!px-3 !py-1.5 !text-red-700" onClick={() => void supprimerArchive(a.id, a.nom)}>
                      Supprimer
                    </Bouton>
                  )}
                </li>
              ))}
            </ul>
          </Carte>
        </section>
      )}

      {fenetreDocs && <FenetreDocuments collaborateur={fenetreDocs} onFermer={() => setFenetreDocs(null)} onEnregistre={() => (setFenetreDocs(null), charger())} />}
      {fenetreClient && (
        <FenetreClient
          client={fenetreClient}
          collaborateurs={collaborateurs}
          onFermer={() => setFenetreClient(null)}
          onEnregistre={() => {
            setFenetreClient(null);
            charger();
          }}
        />
      )}
      {fenetreCollab && (
        <FenetreCollaborateur
          collaborateur={fenetreCollab}
          clients={clients}
          moi={moi}
          onFermer={() => setFenetreCollab(null)}
          onEnregistre={(inv) => {
            const nom = fenetreCollab === "nouveau" ? "le collaborateur" : fenetreCollab.nom;
            setFenetreCollab(null);
            setMessage(null);
            annoncerInvitation(nom, inv);
            charger();
          }}
        />
      )}
    </>
  );
}
