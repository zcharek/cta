import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { api, type Moi } from "./api";
import { Layout, ongletDuChemin, premierChemin } from "./Layout";
import Aujourdhui from "./pages/Aujourdhui";
import Bientot from "./pages/Bientot";
import Cabinets from "./pages/Cabinets";
import Connexion from "./pages/Connexion";
import DefinirMotDePasse from "./pages/DefinirMotDePasse";
import Equipe from "./pages/Equipe";
import EspaceClient from "./pages/EspaceClient";
import MonProfil from "./pages/MonProfil";
import Documents from "./pages/Documents";
import DossierClient from "./pages/DossierClient";
import Factures from "./pages/Factures";
import Paie from "./pages/Paie";
import RecapMensuel from "./pages/Recap";
import Saisie from "./pages/Saisie";
import Validation from "./pages/Validation";
import { naviguer, useChemin } from "./routeur";
import { Chargement } from "./ui";

const PUBLIQUES = ["/connexion", "/definir-mot-de-passe"];

/** Page d'arrivée : le premier onglet activé (Aujourd'hui, sinon Cabinets…, la saisie pour un Collaborateur). */
export const accueilDe = (moi: Moi) => premierChemin(moi.onglets) ?? "/aucun-acces";

/** La personne a-t-elle accès à cette page ? Les pages inconnues restent accessibles (elles affichent « introuvable »). */
const autorise = (moi: Moi, chemin: string) => {
  const onglet = ongletDuChemin(chemin.split("?")[0]!);
  return chemin === "/aucun-acces" || !onglet || moi.onglets.includes(onglet);
};

/** Après connexion : la page demandée avant (?suite=), si la personne y a accès. */
function destinationApresConnexion(moi: Moi) {
  const suite = new URLSearchParams(window.location.search).get("suite");
  return suite?.startsWith("/") && !suite.startsWith("//") && autorise(moi, suite) ? suite : accueilDe(moi);
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

  // Garde des routes : non connecté → /connexion ; page d'un onglet désactivé → page d'arrivée.
  // Ce n'est qu'un confort d'affichage : chaque appel à l'API vérifie lui-même les droits.
  useEffect(() => {
    if (moi === undefined) return;
    if (!moi && !publique) {
      const suite = chemin === "/" ? "" : `?suite=${encodeURIComponent(chemin)}`;
      naviguer(`/connexion${suite}`, { remplacer: true });
    } else if (moi && chemin === "/connexion") naviguer(destinationApresConnexion(moi), { remplacer: true });
    else if (moi && !publique && !autorise(moi, chemin)) naviguer(accueilDe(moi), { remplacer: true });
  }, [moi, chemin, publique]);

  // Ancienne adresse de la page commune Clients et collaborateurs
  useEffect(() => {
    if (chemin === "/reglages/equipe") naviguer("/reglages/collaborateurs", { remplacer: true });
    // Le message WhatsApp se configure maintenant dans une fenêtre de la page Cabinets
    if (chemin === "/reglages/whatsapp") naviguer("/cabinets?whatsapp=1", { remplacer: true });
  }, [chemin]);

  useEffect(() => {
    const titres: Record<string, string> = {
      "/": "Aujourd'hui",
      "/connexion": "Connexion",
      "/definir-mot-de-passe": "Mot de passe",
      "/saisie": "Saisie des temps",
      "/reglages/clients": "Clients",
      "/reglages/collaborateurs": "Collaborateurs",
      "/profil": "Mon profil",
      "/factures": "Factures",
      "/paie": "Bulletins de paie",
      "/documents": "Documents",
      "/validation": "Validation",
      "/recap": "Récap mensuel",
      "/cabinets": "Cabinets",
    };
    const t = titres[chemin] ?? (chemin.startsWith("/espace-client") ? "Espace client" : chemin.startsWith("/reglages/clients/") ? "Dossier client" : undefined);
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
  if (!autorise(moi, chemin)) return <Chargement />;

  let page;
  if (chemin === "/") page = <Aujourdhui moi={moi} />;
  else if (chemin === "/saisie") page = <Saisie moi={moi} />;
  else if (chemin === "/reglages/clients") page = <Equipe key="clients" moi={moi} vue="clients" />;
  else if (/^\/reglages\/clients\/[0-9a-f-]{36}$/.test(chemin)) page = <DossierClient key={chemin} id={chemin.split("/").pop()!} />;
  else if (chemin === "/reglages/collaborateurs") page = <Equipe key="collaborateurs" moi={moi} vue="collaborateurs" />;
  else if (chemin === "/paie") page = <Paie />;
  else if (chemin === "/documents") page = <Documents />;
  else if (chemin === "/factures") page = <Factures moi={moi} />;
  else if (chemin === "/profil") page = <MonProfil moi={moi} onMisAJour={recharger} />;
  else if (chemin === "/validation") page = <Validation />;
  else if (chemin === "/recap") page = <RecapMensuel moi={moi} />;
  else if (chemin === "/cabinets") page = <Cabinets moi={moi} />;
  else if (chemin === "/espace-client" || chemin.startsWith("/espace-client/")) page = <EspaceClient key={chemin} chemin={chemin} />;
  else if (chemin === "/aucun-acces") page = <Bientot titre="Aucun onglet activé" description="Votre compte n'a accès à aucune page de Cockpit pour l'instant. Demandez au Founder, à un Co-Founder ou à un QA Manager d'activer vos onglets." />;
  else page = <Bientot titre="Page introuvable" description="Cette adresse ne correspond à aucune page de Cockpit." />;

  return (
    <Layout moi={moi} chemin={chemin} onDeconnexion={deconnexion}>
      {page}
    </Layout>
  );
}
