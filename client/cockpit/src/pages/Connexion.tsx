import { useState, type FormEvent } from "react";
import { api, type Moi } from "../api";
import { PiedDePage } from "../Layout";
import { Bouton, Champ, Erreur, Info } from "../ui";

/** Cadre commun aux pages sans sidebar (connexion, mot de passe). */
export function CadreAuth({ titre, accent, children }: { titre: string; accent?: string; children: React.ReactNode }) {
  return (
    <>
    <main className="flex flex-col items-center px-4 pt-14 sm:pt-24">
      <div className="mb-8 flex items-center gap-3">
        <span className="ck-sidebar flex h-12 w-12 items-center justify-center rounded-2xl">
          <img src="/images/logo-light-icon.svg" alt="" className="h-8 w-8" />
        </span>
        <div>
          <p className="ck-titre text-2xl leading-none text-ck-titre">Cockpit</p>
          <p className="mt-1 text-sm text-ck-texte-2">Central Test Agency</p>
        </div>
      </div>
      <div className="ck-carte w-full max-w-md p-6 sm:p-8">
        <h1 className="ck-titre mb-6 text-2xl">
          {titre}
          {accent && <span className="text-ck-orange"> {accent}</span>}
        </h1>
        {children}
      </div>
    </main>
    <PiedDePage />
    </>
  );
}

export default function Connexion({ onConnecte }: { onConnecte: (m: Moi) => void }) {
  const [mode, setMode] = useState<"connexion" | "oubli">("connexion");
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [occupe, setOccupe] = useState(false);

  async function soumettre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");
    setOccupe(true);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      if (mode === "connexion") {
        const { moi } = await api<{ moi: Moi }>("auth/connexion", { corps: { email: f.email, motDePasse: f.motDePasse } });
        onConnecte(moi);
      } else {
        await api("auth/mot-de-passe-oublie", { corps: { email: f.email } });
        setEnvoye(true);
      }
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  function changerMode(m: typeof mode) {
    setMode(m);
    setErreur("");
    setEnvoye(false);
  }

  if (mode === "oubli")
    return (
      <CadreAuth titre="Mot de passe" accent="oublié ?">
        {envoye ? (
          <div className="grid gap-5">
            <Info>Si un compte actif correspond à cette adresse, un e-mail avec un lien de réinitialisation vient d'être envoyé. Le lien est valable 1 heure.</Info>
            <Bouton variante="contour" onClick={() => changerMode("connexion")}>
              Retour à la connexion
            </Bouton>
          </div>
        ) : (
          <form onSubmit={soumettre} className="grid gap-5">
            <p className="text-sm text-ck-texte-2">Indiquez votre adresse e-mail : nous vous enverrons un lien pour choisir un nouveau mot de passe.</p>
            <Champ libelle="Adresse e-mail" name="email" type="email" required autoComplete="email" autoFocus />
            {erreur && <Erreur>{erreur}</Erreur>}
            <Bouton type="submit" disabled={occupe}>
              {occupe ? "Envoi…" : "Envoyer le lien"}
            </Bouton>
            <button type="button" onClick={() => changerMode("connexion")} className="text-sm font-semibold text-ck-texte-2 hover:text-ck-titre">
              Retour à la connexion
            </button>
          </form>
        )}
      </CadreAuth>
    );

  return (
    <CadreAuth titre="Bon retour" accent="parmi nous.">
      <form onSubmit={soumettre} className="grid gap-5">
        <Champ libelle="Adresse e-mail" name="email" type="email" required autoComplete="email" autoFocus />
        <Champ libelle="Mot de passe" name="motDePasse" type="password" required autoComplete="current-password" />
        {erreur && <Erreur>{erreur}</Erreur>}
        <Bouton type="submit" disabled={occupe}>
          {occupe ? "Connexion…" : "Se connecter"}
        </Bouton>
        <button type="button" onClick={() => changerMode("oubli")} className="text-sm font-semibold text-ck-orange-texte hover:underline">
          Mot de passe oublié ?
        </button>
      </form>
    </CadreAuth>
  );
}
