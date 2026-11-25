import { useEffect, useState } from "react";

// Routeur minimal par l'historique du navigateur. Toutes les pages vivent sous /cockpit.
export const BASE = "/cockpit";

/** Chemin courant sans le préfixe /cockpit, par ex. « /saisie » ou « / ». */
export function cheminCourant(): string {
  const p = window.location.pathname.replace(/^\/cockpit/, "").replace(/\/$/, "");
  return p || "/";
}

export function naviguer(chemin: string, options: { remplacer?: boolean } = {}) {
  const url = BASE + (chemin === "/" ? "/" : chemin);
  if (options.remplacer) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
}

export function useChemin(): string {
  const [chemin, setChemin] = useState(cheminCourant);
  useEffect(() => {
    const maj = () => setChemin(cheminCourant());
    window.addEventListener("popstate", maj);
    return () => window.removeEventListener("popstate", maj);
  }, []);
  return chemin;
}

/** Lien interne : navigation sans recharger la page, clic molette et Ctrl+clic conservés. */
export function surClicLien(e: React.MouseEvent<HTMLAnchorElement>, chemin: string) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  naviguer(chemin);
}
