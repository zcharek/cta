import { useEffect, useState, type ReactNode } from "react";
import { ROLE_LABEL } from "../../../shared/cockpit";
import type { Moi } from "./api";
import { surClicLien } from "./routeur";
import { Avatar, Icone } from "./ui";

type Lien = { chemin: string; libelle: string; icone: string };
type Groupe = { titre?: string; liens: Lien[] };

const NAVIGATION_ADMIN: Groupe[] = [
  { liens: [{ chemin: "/", libelle: "Aujourd'hui", icone: "soleil" }] },
  { titre: "Prospection VetCare", liens: [{ chemin: "/cabinets", libelle: "Cabinets", icone: "kanban" }] },
  {
    titre: "Suivi des temps",
    liens: [
      { chemin: "/saisie", libelle: "Saisie des temps", icone: "horloge" },
      { chemin: "/validation", libelle: "Validation", icone: "valider" },
      { chemin: "/recap", libelle: "Récap mensuel", icone: "graphique" },
    ],
  },
  { titre: "Espace client", liens: [{ chemin: "/espace-client", libelle: "Clients et questionnaires", icone: "document" }] },
  {
    titre: "Réglages",
    liens: [
      { chemin: "/reglages/equipe", libelle: "Clients et collaborateurs", icone: "equipe" },
      { chemin: "/reglages/whatsapp", libelle: "Message WhatsApp", icone: "message" },
    ],
  },
];

const NAVIGATION_COLLABORATEUR: Groupe[] = [{ liens: [{ chemin: "/saisie", libelle: "Ma saisie", icone: "horloge" }] }];

export function PiedDePage() {
  return (
    <footer className="mt-16 flex flex-col items-center gap-2 pb-8 text-xs text-ck-texte-2">
      <picture>
        <source srcSet="/images/logo-light-horizontal.svg" media="(prefers-color-scheme: dark)" />
        <img src="/images/logo-dark-horizontal.svg" alt="Central Test Agency" className="h-8 w-auto" />
      </picture>
      <p>
        Designed by <span className="font-semibold text-ck-titre">Central Test Agency</span>
      </p>
    </footer>
  );
}

function Navigation({ moi, chemin, onNaviguer }: { moi: Moi; chemin: string; onNaviguer: () => void }) {
  const groupes = moi.admin ? NAVIGATION_ADMIN : NAVIGATION_COLLABORATEUR;
  return (
    <nav aria-label="Navigation principale" className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
      {groupes.map((g, i) => (
        <div key={i}>
          {g.titre && <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">{g.titre}</p>}
          <ul className="space-y-1">
            {g.liens.map((l) => {
              const actif = l.chemin === "/" ? chemin === "/" : chemin === l.chemin || chemin.startsWith(`${l.chemin}/`);
              return (
                <li key={l.chemin}>
                  <a
                    href={`/cockpit${l.chemin === "/" ? "/" : l.chemin}`}
                    onClick={(e) => {
                      surClicLien(e, l.chemin);
                      onNaviguer();
                    }}
                    aria-current={actif ? "page" : undefined}
                    className={`relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[15px] font-semibold transition ${
                      actif ? "bg-white/10 text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {actif && <span aria-hidden="true" className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-ck-orange" />}
                    <Icone nom={l.icone} className={actif ? "text-ck-orange" : "text-white/60"} />
                    {l.libelle}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Sidebar({ moi, chemin, onDeconnexion, onNaviguer }: { moi: Moi; chemin: string; onDeconnexion: () => void; onNaviguer: () => void }) {
  return (
    <div className="ck-sidebar flex h-full w-[272px] flex-col text-white">
      <div className="flex items-center gap-3 px-6 pb-6 pt-7">
        <img src="/images/logo-light-icon.svg" alt="" className="h-9 w-9" />
        <div>
          <p className="ck-titre text-xl leading-none !text-white">Cockpit</p>
          <p className="mt-1 text-xs text-white/60">Central Test Agency</p>
        </div>
      </div>
      <Navigation moi={moi} chemin={chemin} onNaviguer={onNaviguer} />
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar nom={moi.nom} couleur="#DC5A2E" taille={38} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{moi.nom}</p>
            <p className="truncate text-xs text-white/60">{ROLE_LABEL[moi.role]}</p>
          </div>
          <button type="button" onClick={onDeconnexion} title="Se déconnecter" aria-label="Se déconnecter" className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <Icone nom="sortie" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Layout({ moi, chemin, onDeconnexion, children }: { moi: Moi; chemin: string; onDeconnexion: () => void; children: ReactNode }) {
  const [tiroir, setTiroir] = useState(false);

  useEffect(() => {
    if (!tiroir) return;
    const surTouche = (e: KeyboardEvent) => e.key === "Escape" && setTiroir(false);
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [tiroir]);

  return (
    <div className="min-h-screen lg:pl-[272px]">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ck-surface focus:px-4 focus:py-2">
        Aller au contenu
      </a>

      {/* Sidebar fixe sur grand écran */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar moi={moi} chemin={chemin} onDeconnexion={onDeconnexion} onNaviguer={() => {}} />
      </aside>

      {/* Barre du haut et tiroir sur mobile */}
      <div className="ck-sidebar sticky top-0 z-30 flex items-center gap-3 px-4 py-3 text-white lg:hidden">
        <button
          type="button"
          onClick={() => setTiroir(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={tiroir}
          aria-controls="tiroir-navigation"
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <Icone nom="menu" />
        </button>
        <img src="/images/logo-light-icon.svg" alt="" className="h-7 w-7" />
        <span className="ck-titre text-lg !text-white">Cockpit</span>
      </div>
      {tiroir && (
        <div className="fixed inset-0 z-40 lg:hidden" id="tiroir-navigation" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-[#071538]/60" onClick={() => setTiroir(false)} />
          <div className="relative h-full w-[272px] max-w-[85vw] shadow-2xl">
            <Sidebar moi={moi} chemin={chemin} onDeconnexion={onDeconnexion} onNaviguer={() => setTiroir(false)} />
          </div>
        </div>
      )}

      <main id="contenu" className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-8 sm:pt-12">
        {children}
      </main>
      <PiedDePage />
    </div>
  );
}
