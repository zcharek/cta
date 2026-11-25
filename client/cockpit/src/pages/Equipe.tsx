import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ROLES, ROLE_DESCRIPTION, ROLE_LABEL, formatDzd, type Role } from "../../../../shared/cockpit";
import { api, type ClientAdmin, type Collaborateur, type Invitation, type Moi } from "../api";
import { Avatar, BadgeAcces, BadgeRole, Bouton, COULEUR_ROLE, Carte, Champ, Chargement, EnTete, Erreur, Icone, Info, Modale, Pastille } from "../ui";

type Donnees = { clients: ClientAdmin[]; collaborateurs: Collaborateur[] };

const jours = (n: number) => `${n.toLocaleString("fr-FR")} j`;

function Chiffre({ valeur, libelle }: { valeur: string | number; libelle: string }) {
  return (
    <Carte className="!py-4">
      <p className="ck-titre text-3xl">{valeur}</p>
      <p className="text-sm text-ck-texte-2">{libelle}</p>
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
    void envoyer({ nom: f.nom, tjmDzd: f.tjm, profilIds: equipe });
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
        <Champ libelle="TJM (DZD par jour)" name="tjm" required inputMode="numeric" pattern="[0-9 ]+" defaultValue={existant?.tjm_dzd ?? ""} aide="Montant hors taxes facturé pour une journée." />
        <Cases
          legende="Collaborateurs assignés"
          options={collaborateurs.filter((c) => c.actif)}
          choisis={equipe}
          onChange={setEquipe}
          vide="Aucun collaborateur pour l'instant."
        />
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modale>
  );
}

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
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const soiMeme = existant?.id === moi.id;

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

  function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    void envoyer({ nom: f.nom, email: f.email, role, clientIds: choisis });
  }

  return (
    <Modale
      titre={existant ? existant.nom : "Inviter un collaborateur"}
      ouverte
      onFermer={onFermer}
      pied={
        <>
          {existant?.actif && !soiMeme && (
            <Bouton variante="danger" className="mr-auto" disabled={occupe} onClick={() => void envoyer({ actif: false })}>
              Archiver
            </Bouton>
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
        <Champ libelle="Prénom et nom" name="nom" required maxLength={120} defaultValue={existant?.nom} autoComplete="off" autoFocus />
        <Champ libelle="Adresse e-mail" name="email" type="email" required defaultValue={existant?.email} autoComplete="off" aide={existant ? undefined : "Le collaborateur y recevra le lien pour définir son mot de passe."} />
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ck-titre">Type</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => {
              const bloque = soiMeme && r === "collaborateur";
              return (
                <label
                  key={r}
                  className={`relative flex cursor-pointer flex-col gap-1 rounded-xl border-2 p-3 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-ck-orange ${
                    role === r ? "border-ck-plein bg-ck-surface-2" : "border-ck-bordure hover:bg-ck-surface-2"
                  } ${bloque ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <input type="radio" name="role" value={r} checked={role === r} disabled={bloque} onChange={() => setRole(r)} className="sr-only" />
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
        <Cases
          legende="Clients assignés"
          options={clients.filter((c) => c.actif)}
          choisis={choisis}
          onChange={setChoisis}
          vide="Aucun client pour l'instant : créez-en un pour pouvoir l'assigner."
        />
        {erreur && <Erreur>{erreur}</Erreur>}
      </form>
    </Modale>
  );
}

export default function Equipe({ moi }: { moi: Moi }) {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState<{ texte: string; lien?: string } | null>(null);
  const [fenetreClient, setFenetreClient] = useState<ClientAdmin | "nouveau" | null>(null);
  const [fenetreCollab, setFenetreCollab] = useState<Collaborateur | "nouveau" | null>(null);

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
      const r = await api<{ invitation: Invitation }>(`collaborateurs/${c.id}/invitation`, { methode: "POST" });
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

  if (erreur) return <Erreur>{erreur}</Erreur>;
  if (!donnees) return <Chargement />;

  const { clients, collaborateurs } = donnees;
  const clientsActifs = clients.filter((c) => c.actif);
  const collabsActifs = collaborateurs.filter((c) => c.actif);
  const nomClient = new Map(clients.map((c) => [c.id, c.nom]));
  const nomCollab = new Map(collaborateurs.map((c) => [c.id, c.nom]));
  const joursMois = collaborateurs.reduce((s, c) => s + c.jours_mois, 0);
  const archives = [...clients.filter((c) => !c.actif).map((c) => ({ type: "client" as const, ...c })), ...collaborateurs.filter((c) => !c.actif).map((c) => ({ type: "collaborateur" as const, ...c }))];

  return (
    <>
      <EnTete
        titre="Clients et"
        accent="collaborateurs."
        actions={
          <>
            <Bouton variante="contour" onClick={() => setFenetreClient("nouveau")}>
              <Icone nom="plus" taille={18} /> Nouveau client
            </Bouton>
            <Bouton onClick={() => setFenetreCollab("nouveau")}>
              <Icone nom="plus" taille={18} /> Inviter un collaborateur
            </Bouton>
          </>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Chiffre valeur={clientsActifs.length} libelle={clientsActifs.length > 1 ? "clients" : "client"} />
        <Chiffre valeur={collabsActifs.length} libelle={collabsActifs.length > 1 ? "collaborateurs" : "collaborateur"} />
        <Chiffre valeur={jours(joursMois)} libelle="saisis ce mois" />
      </div>

      {message && (
        <div className="mb-6">
          <Info>
            <p>{message.texte}</p>
            {message.lien && (
              <p className="mt-2 break-all text-xs text-ck-texte-2">
                E-mail non configuré (RESEND_API_KEY absent en local) : lien à transmettre <a href={message.lien} className="font-semibold text-ck-orange-texte underline">{message.lien}</a>
              </p>
            )}
          </Info>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section aria-labelledby="titre-clients">
          <h2 id="titre-clients" className="ck-titre mb-4 text-xl">
            Clients
          </h2>
          {clientsActifs.length === 0 ? (
            <Carte className="text-sm text-ck-texte-2">Aucun client. Créez votre premier client avec « Nouveau client ».</Carte>
          ) : (
            <ul className="grid gap-4">
              {clientsActifs.map((c) => (
                <li key={c.id}>
                  <Carte className="!p-5">
                    <div className="flex items-start gap-3">
                      <Avatar nom={c.nom} couleur="#071538" taille={42} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold text-ck-titre">{c.nom}</p>
                        <p className="text-sm text-ck-texte-2">
                          <span className="font-semibold text-ck-texte">{formatDzd(c.tjm_dzd)}</span> / jour · {jours(c.jours_mois)} ce mois
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.profil_ids.length === 0 ? (
                        <span className="text-xs text-ck-texte-2">Aucune personne assignée</span>
                      ) : (
                        c.profil_ids.map((id) => (
                          <Pastille key={id} className="bg-ck-surface-2 text-ck-texte">
                            {nomCollab.get(id)}
                          </Pastille>
                        ))
                      )}
                    </div>
                    <button type="button" onClick={() => setFenetreClient(c)} className="mt-3 text-sm font-bold text-ck-orange-texte hover:underline">
                      Gérer l'équipe
                    </button>
                  </Carte>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="titre-collabs">
          <h2 id="titre-collabs" className="ck-titre mb-4 text-xl">
            Collaborateurs
          </h2>
          <Carte className="!p-0">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              {collabsActifs.map((c) => (
                <li key={c.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start">
                  <Avatar nom={c.nom} couleur={COULEUR_ROLE[c.role]} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ck-titre">{c.nom}</p>
                      <BadgeRole role={c.role} />
                      <BadgeAcces statut={c.statut} />
                    </div>
                    <p className="truncate text-sm text-ck-texte-2">{c.email}</p>
                    <p className="mt-1 text-sm text-ck-texte-2">
                      {c.client_ids.length ? c.client_ids.map((id) => nomClient.get(id)).join(", ") : "Aucun client"} · {jours(c.jours_mois)} ce mois
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {c.statut === "invitation" && (
                      <Bouton variante="discret" className="!px-3 !py-2" onClick={() => void renvoyer(c)}>
                        Renvoyer l'invitation
                      </Bouton>
                    )}
                    <Bouton variante="contour" className="!px-3 !py-2" onClick={() => setFenetreCollab(c)}>
                      Modifier
                    </Bouton>
                  </div>
                </li>
              ))}
            </ul>
          </Carte>
        </section>
      </div>

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
                  <Bouton variante="discret" className="!px-3 !py-1.5" onClick={() => void reactiver(`${a.type === "client" ? "clients" : "collaborateurs"}/${a.id}`)}>
                    Réactiver
                  </Bouton>
                </li>
              ))}
            </ul>
          </Carte>
        </section>
      )}

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
