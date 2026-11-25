import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { api, type Moi } from "./api";
import { Layout } from "./Layout";
import Aujourdhui from "./pages/Aujourdhui";
import Bientot from "./pages/Bientot";
import Cabinets from "./pages/Cabinets";
import Connexion from "./pages/Connexion";
import DefinirMotDePasse from "./pages/DefinirMotDePasse";
import Equipe from "./pages/Equipe";
import MessageWhatsApp from "./pages/MessageWhatsApp";
import RecapMensuel from "./pages/Recap";
import Saisie from "./pages/Saisie";
import Validation from "./pages/Validation";
import { naviguer, useChemin } from "./routeur";
import { Chargement } from "./ui";

const PUBLIQUES = ["/connexion", "/definir-mot-de-passe"];

/** Page d'arrivée selon le type : la saisie pour un Collaborateur, l'accueil pour les autres. */
export const accueilDe = (moi: Moi) => (moi.admin ? "/" : "/saisie");

/** Après connexion : la page demandée avant (?suite=), si ce type d'utilisateur y a accès. */
function destinationApresConnexion(moi: Moi) {
  const suite = new URLSearchParams(window.location.search).get("suite");
  return suite?.startsWith("/") && !suite.startsWith("//") && (moi.admin || suite === "/saisie") ? suite : accueilDe(moi);
}


export default function App() {
  const chemin = useChemin();
  const [moi, setMoi] = useState<Moi | null | undefined>(undefined);

  const recharger = useCallback(() => {
    api<{ moi: Moi | null }>("auth/moi")
      .then((d) => setMoi(d.moi))
      .catch(() => setMoi(null));
  }, []);

  useEffect(recharger, [recharger]);

  // Session expirée ou compte archivé en cours d'utilisation
  useEffect(() => {
    const surDeconnexion = () => setMoi(null);
    window.addEventListener("cockpit:deconnecte", surDeconnexion);
    return () => window.removeEventListener("cockpit:deconnecte", surDeconnexion);
  }, []);

  const publique = PUBLIQUES.includes(chemin);

  // Garde des routes : non connecté → /connexion ; Collaborateur hors de sa saisie → /saisie.
  // Ce n'est qu'un confort d'affichage : chaque appel à l'API vérifie lui-même les droits.
  useEffect(() => {
    if (moi === undefined) return;
    if (!moi && !publique) {
      const suite = chemin === "/" ? "" : `?suite=${encodeURIComponent(chemin)}`;
      naviguer(`/connexion${suite}`, { remplacer: true });
    } else if (moi && chemin === "/connexion") naviguer(destinationApresConnexion(moi), { remplacer: true });
    else if (moi && !moi.admin && !publique && chemin !== "/saisie") naviguer("/saisie", { remplacer: true });
  }, [moi, chemin, publique]);

  useEffect(() => {
    const titres: Record<string, string> = {
      "/": "Aujourd'hui",
      "/connexion": "Connexion",
      "/definir-mot-de-passe": "Mot de passe",
      "/saisie": "Saisie des temps",
      "/reglages/equipe": "Clients et collaborateurs",
      "/validation": "Validation",
      "/recap": "Récap mensuel",
      "/cabinets": "Cabinets",
      "/reglages/whatsapp": "Message WhatsApp",
    };
    const t = titres[chemin];
    document.title = t ? `${t} – Cockpit` : "Cockpit – Central Test Agency";
  }, [chemin]);

  // La garde des routes ci-dessus se charge des redirections après connexion et déconnexion.
  async function deconnexion() {
    await api("auth/deconnexion", { methode: "POST" }).catch(() => {});
    setMoi(null);
  }

  function connecte(m: Moi) {
    // Depuis /definir-mot-de-passe (page publique), la garde ne redirige pas : on le fait ici, une fois l'utilisateur enregistré.
    flushSync(() => setMoi(m));
    if (chemin !== "/connexion") naviguer(accueilDe(m), { remplacer: true });
  }

  if (chemin === "/definir-mot-de-passe") return <DefinirMotDePasse onConnecte={connecte} />;
  if (moi === undefined) return <Chargement />;
  if (!moi) return <Connexion onConnecte={connecte} />;
  if (!moi.admin && chemin !== "/saisie") return <Chargement />;

  let page;
  if (chemin === "/") page = <Aujourdhui moi={moi} />;
  else if (chemin === "/saisie") page = <Saisie moi={moi} />;
  else if (chemin === "/reglages/equipe") page = <Equipe moi={moi} />;
  else if (chemin === "/validation") page = <Validation />;
  else if (chemin === "/recap") page = <RecapMensuel />;
  else if (chemin === "/cabinets") page = <Cabinets />;
  else if (chemin === "/reglages/whatsapp") page = <MessageWhatsApp />;
  else page = <Bientot titre="Page introuvable" description="Cette adresse ne correspond à aucune page de Cockpit." />;

  return (
    <Layout moi={moi} chemin={chemin} onDeconnexion={deconnexion}>
      {page}
    </Layout>
  );
}
