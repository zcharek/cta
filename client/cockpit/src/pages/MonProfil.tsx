import { useEffect, useState, type FormEvent } from "react";
import { MOT_DE_PASSE_MIN, ONGLET_LABEL, ROLE_LABEL, type Role } from "../../../../shared/cockpit";
import { api, type Moi } from "../api";
import { Bouton, Carte, Champ, Chargement, EnTete, Erreur, ZoneTexte } from "../ui";

type Profil = { nom: string; email: string; role: Role; telephone: string | null; adresse: string | null; mot_de_passe_le: string | null };

function Succes({ children }: { children: string }) {
  return (
    <p role="status" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
      {children}
    </p>
  );
}

/** « Mon profil » : ses coordonnées et son mot de passe. Accessible à tous, quels que soient les onglets. */
export default function MonProfil({ moi, onMisAJour }: { moi: Moi; onMisAJour: () => void }) {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    api<{ profil: Profil }>("profil")
      .then((d) => setProfil(d.profil))
      .catch((e: Error) => setErreur(e.message));
  }, []);

  if (!profil) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  return (
    <>
      <EnTete titre="Mon" accent="profil." sousTitre={`${ROLE_LABEL[profil.role]} · ${profil.email}`} />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Coordonnees profil={profil} onEnregistre={(p) => (setProfil(p), onMisAJour())} />
        <div className="grid gap-6 lg:col-span-2">
          <MotDePasse />
          <Carte aria-labelledby="titre-acces">
            <h2 id="titre-acces" className="ck-titre mb-2 text-xl">
              Mes accès
            </h2>
            <p className="text-sm text-ck-texte-2">
              {moi.onglets.length ? moi.onglets.map((o) => ONGLET_LABEL[o]).join(" · ") : "Aucun onglet activé."}
            </p>
            <p className="mt-3 text-xs text-ck-texte-2">Pour changer votre adresse e-mail ou vos accès, adressez-vous au Founder, à un Co-Founder ou à un QA Manager.</p>
          </Carte>
        </div>
      </div>
    </>
  );
}

function Coordonnees({ profil, onEnregistre }: { profil: Profil; onEnregistre: (p: Profil) => void }) {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setOccupe(true);
    setErreur("");
    setOk(false);
    try {
      await api("profil", { methode: "PATCH", corps: { nom: f.nom, telephone: f.telephone, adresse: f.adresse } });
      onEnregistre({ ...profil, nom: f.nom!.trim(), telephone: f.telephone!.trim() || null, adresse: f.adresse!.trim() || null });
      setOk(true);
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <Carte className="lg:col-span-3" aria-labelledby="titre-coordonnees">
      <h2 id="titre-coordonnees" className="ck-titre mb-4 text-xl">
        Mes coordonnées
      </h2>
      <form onSubmit={envoyer} className="grid gap-4">
        <Champ libelle="Prénom et nom" name="nom" required maxLength={120} defaultValue={profil.nom} autoComplete="name" />
        <Champ libelle="Adresse e-mail" name="email" type="email" defaultValue={profil.email} readOnly aide="C'est votre identifiant de connexion." />
        <Champ libelle="Téléphone" name="telephone" type="tel" maxLength={30} defaultValue={profil.telephone ?? ""} autoComplete="tel" placeholder="0550 12 34 56" />
        <ZoneTexte libelle="Adresse postale" name="adresse" rows={3} maxLength={300} defaultValue={profil.adresse ?? ""} autoComplete="street-address" />
        {erreur && <Erreur>{erreur}</Erreur>}
        {ok && <Succes>Coordonnées enregistrées.</Succes>}
        <Bouton type="submit" disabled={occupe} className="justify-self-start">
          {occupe ? "Enregistrement…" : "Enregistrer"}
        </Bouton>
      </form>
    </Carte>
  );
}

function MotDePasse() {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setErreur("");
    setOk(false);
    if (f.nouveau !== f.confirmation) return setErreur("Les deux mots de passe ne correspondent pas.");
    setOccupe(true);
    try {
      await api("profil/mot-de-passe", { corps: { actuel: f.actuel, nouveau: f.nouveau } });
      form.reset();
      setOk(true);
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <Carte aria-labelledby="titre-mdp">
      <h2 id="titre-mdp" className="ck-titre mb-4 text-xl">
        Mot de passe
      </h2>
      <form onSubmit={envoyer} className="grid gap-4">
        <Champ libelle="Mot de passe actuel" name="actuel" type="password" required autoComplete="current-password" />
        <Champ libelle="Nouveau mot de passe" name="nouveau" type="password" required minLength={MOT_DE_PASSE_MIN} autoComplete="new-password" aide={`${MOT_DE_PASSE_MIN} caractères minimum.`} />
        <Champ libelle="Confirmation" name="confirmation" type="password" required minLength={MOT_DE_PASSE_MIN} autoComplete="new-password" />
        {erreur && <Erreur>{erreur}</Erreur>}
        {ok && <Succes>Mot de passe modifié. Vos autres sessions ont été fermées.</Succes>}
        <Bouton type="submit" variante="contour" disabled={occupe} className="justify-self-start">
          {occupe ? "Modification…" : "Changer le mot de passe"}
        </Bouton>
      </form>
    </Carte>
  );
}
