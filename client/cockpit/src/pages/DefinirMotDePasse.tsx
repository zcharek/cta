import { useEffect, useState, type FormEvent } from "react";
import { MOT_DE_PASSE_MIN, prenom } from "../../../../shared/cockpit";
import { api, type Moi } from "../api";
import { naviguer } from "../routeur";
import { Bouton, Champ, Chargement, Erreur } from "../ui";
import { CadreAuth } from "./Connexion";

type Info = { nom: string; email: string; type: "invitation" | "reinitialisation" };

export default function DefinirMotDePasse({ onConnecte }: { onConnecte: (m: Moi) => void }) {
  const [jeton] = useState(() => new URLSearchParams(window.location.search).get("jeton") ?? "");
  const [info, setInfo] = useState<Info | null | undefined>(undefined);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    // Retire le jeton de la barre d'adresse (historique, captures d'écran).
    window.history.replaceState(null, "", "/cockpit/definir-mot-de-passe");
    if (!jeton) return setInfo(null);
    api<Info>(`auth/jeton?jeton=${encodeURIComponent(jeton)}`)
      .then(setInfo)
      .catch(() => setInfo(null));
  }, [jeton]);

  async function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if ((f.motDePasse ?? "").length < MOT_DE_PASSE_MIN) return setErreur(`Le mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
    if (f.motDePasse !== f.confirmation) return setErreur("Les deux mots de passe ne correspondent pas.");
    setOccupe(true);
    try {
      const { moi } = await api<{ moi: Moi }>("auth/definir-mot-de-passe", { corps: { jeton, motDePasse: f.motDePasse, confirmation: f.confirmation } });
      onConnecte(moi);
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
    }
  }

  if (info === undefined) return <Chargement />;

  if (!info)
    return (
      <CadreAuth titre="Lien" accent="expiré.">
        <div className="grid gap-5">
          <p className="text-ck-texte-2">
            Ce lien n'est plus valable : il a déjà servi ou a expiré. Demandez un nouveau lien depuis « Mot de passe oublié », ou demandez à un responsable de vous renvoyer l'invitation.
          </p>
          <Bouton onClick={() => naviguer("/connexion")}>Aller à la connexion</Bouton>
        </div>
      </CadreAuth>
    );

  const invitation = info.type === "invitation";
  return (
    <CadreAuth titre={invitation ? `Bienvenue, ${prenom(info.nom)}.` : "Nouveau"} accent={invitation ? undefined : "mot de passe."}>
      <form onSubmit={soumettre} className="grid gap-5">
        <p className="text-sm text-ck-texte-2">
          {invitation ? "Choisissez votre mot de passe pour activer votre compte " : "Choisissez un nouveau mot de passe pour le compte "}
          <strong className="text-ck-titre">{info.email}</strong>.
        </p>
        {/* Champ caché : aide les gestionnaires de mots de passe à associer l'identifiant */}
        <input type="email" name="email" value={info.email} autoComplete="username" readOnly hidden />
        <Champ libelle="Mot de passe" name="motDePasse" type="password" required minLength={MOT_DE_PASSE_MIN} autoComplete="new-password" aide={`${MOT_DE_PASSE_MIN} caractères minimum.`} autoFocus />
        <Champ libelle="Confirmation" name="confirmation" type="password" required minLength={MOT_DE_PASSE_MIN} autoComplete="new-password" />
        {erreur && <Erreur>{erreur}</Erreur>}
        <Bouton type="submit" disabled={occupe}>
          {occupe ? "Enregistrement…" : invitation ? "Activer mon compte" : "Changer mon mot de passe"}
        </Bouton>
      </form>
    </CadreAuth>
  );
}
