import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Legal from "@/pages/Legal";

// Une seule route secondaire : #/legal. Tout le reste (#services, #contact, anciens liens) affiche l'accueil.
export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => {
      const next = window.location.hash;
      if (next === "#/legal" || hash === "#/legal") window.scrollTo(0, 0);
      setHash(next);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, [hash]);

  return hash === "#/legal" ? <Legal /> : <Home />;
}
