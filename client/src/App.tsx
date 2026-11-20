import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";
import Portal from "@/portal/Portal";

// Routes par hash : #/legal, #/espace…, #/admin…. Tout le reste (#services, #contact, anciens liens) affiche l'accueil.
const isPortal = (h: string) => /^#\/(espace|admin)(\/|$)/.test(h);

export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => {
      const next = window.location.hash;
      if (next.startsWith("#/") || hash.startsWith("#/")) window.scrollTo(0, 0);
      setHash(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, [hash]);

  if (isPortal(hash)) return <Portal route={hash} />;
  return hash === "#/legal" ? <Legal /> : <Home />;
}
