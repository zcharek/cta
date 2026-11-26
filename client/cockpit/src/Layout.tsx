import { useEffect, useRef, useState, type ReactNode } from "react";
import { ROLE_LABEL, type Onglet } from "../../../shared/cockpit";
import type { Moi } from "./api";
import { surClicLien } from "./routeur";
import { Avatar, Icone } from "./ui";

type Lien = { chemin: string; libelle: string; icone: string; onglet: Onglet };
type Groupe = { titre?: string; liens: Lien[] };

const NAVIGATION: Groupe[] = [
  { liens: [{ chemin: "/", libelle: "Aujourd'hui", icone: "soleil", onglet: "aujourdhui" }] },
  { titre: "Prospection VetCare", liens: [{ chemin: "/cabinets", libelle: "Cabinets", icone: "kanban", onglet: "cabinets" }] },
  {
    titre: "Suivi des temps",
    liens: [
      { chemin: "/saisie", libelle: "Saisie des temps", icone: "horloge", onglet: "saisie" },
      { chemin: "/validation", libelle: "Validation", icone: "valider", onglet: "validation" },
      { chemin: "/recap", libelle: "Récap mensuel", icone: "graphique", onglet: "recap" },
    ],
  },
  {
    titre: "Facturation et documents",
    liens: [
      { chemin: "/factures", libelle: "Factures", icone: "facture", onglet: "factures" },
      { chemin: "/paie", libelle: "Bulletins de paie", icone: "document", onglet: "paie" },
      { chemin: "/documents", libelle: "Documents", icone: "dossier", onglet: "documents" },
    ],
  },
  {
    titre: "Réglages",
    liens: [
      { chemin: "/reglages/clients", libelle: "Clients", icone: "batiment", onglet: "clients" },
      { chemin: "/reglages/collaborateurs", libelle: "Collaborateurs", icone: "equipe", onglet: "collaborateurs" },
    ],
  },
];

/** Onglet dont dépend une page (null pour une page sans onglet). */
export function ongletDuChemin(chemin: string): Onglet | null {
  for (const g of NAVIGATION)
    for (const l of g.liens) if (l.chemin === "/" ? chemin === "/" : chemin === l.chemin || chemin.startsWith(`${l.chemin}/`)) return l.onglet;
  return null;
}

/** Première page accessible : sert de page d'arrivée. */
export function premierChemin(onglets: readonly Onglet[]): string | null {
  for (const g of NAVIGATION) for (const l of g.liens) if (onglets.includes(l.onglet)) return l.chemin;
  return null;
}

export function PiedDePage() {
  return (
    <footer className="mt-16 flex flex-col items-center gap-2 pb-8 text-xs text-ck-texte-2">
      <picture>
        <img src="/images/logo-dark-horizontal.svg" alt="Central Test Agency" className="h-8 w-auto" />
      </picture>
      <p>
        Designed by <span className="font-semibold text-ck-titre">Central Test Agency</span>
      </p>
    </footer>
  );
}

function Navigation({ moi, chemin, onNaviguer }: { moi: Moi; chemin: string; onNaviguer: () => void }) {
  // Seuls les onglets activés pour la personne. Sans Validation, la saisie est la sienne : « Ma saisie ».
  const groupes = NAVIGATION.map((g) => ({
    ...g,
    liens: g.liens
      .filter((l) => moi.onglets.includes(l.onglet))
      .map((l) => (l.onglet === "saisie" && !moi.onglets.includes("validation") ? { ...l, libelle: "Ma saisie" } : l)),
  })).filter((g) => g.liens.length > 0);
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

function Sidebar({ moi, chemin, onNaviguer }: { moi: Moi; chemin: string; onNaviguer: () => void }) {
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
    </div>
  );
}

/** Menu du compte, en haut à droite : Mon profil et déconnexion. */
function MenuCompte({ moi, chemin, onDeconnexion, sombre = false }: { moi: Moi; chemin: string; onDeconnexion: () => void; sombre?: boolean }) {
  const [ouvert, setOuvert] = useState(false);
  const zone = useRef<HTMLDivElement>(null);

  useEffect(() => setOuvert(false), [chemin]);
  useEffect(() => {
    if (!ouvert) return;
    const clic = (e: MouseEvent) => zone.current && !zone.current.contains(e.target as Node) && setOuvert(false);
    const touche = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(false);
    document.addEventListener("mousedown", clic);
    document.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("mousedown", clic);
      document.removeEventListener("keydown", touche);
    };
  }, [ouvert]);

  const element = "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ck-titre hover:bg-ck-surface-2";
  return (
    <div ref={zone} className="relative">
      <button
        type="button"
        onClick={() => setOuvert((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={ouvert}
        aria-label={`Mon compte : ${moi.nom}`}
        className={`flex items-center gap-3 rounded-full py-1 pl-1 pr-3 transition ${sombre ? "text-white hover:bg-white/10" : "text-ck-titre hover:bg-ck-surface"}`}
      >
        <Avatar nom={moi.nom} couleur="#DC5A2E" taille={sombre ? 32 : 40} />
        <span className={`min-w-0 text-left ${sombre ? "hidden sm:block" : ""}`}>
          <span className="block max-w-[200px] truncate text-sm font-bold">{moi.nom}</span>
          <span className={`block truncate text-xs ${sombre ? "text-white/60" : "text-ck-texte-2"}`}>{ROLE_LABEL[moi.role]}</span>
        </span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-4 w-4 transition ${ouvert ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {ouvert && (
        <div role="menu" aria-label="Mon compte" className="ck-carte absolute right-0 top-full z-50 mt-2 w-56 p-1.5">
          <a role="menuitem" href="/cockpit/profil" onClick={(e) => surClicLien(e, "/profil")} className={element}>
            <Icone nom="profil" taille={18} className="text-ck-texte-2" />
            Mon profil
          </a>
          <button role="menuitem" type="button" onClick={onDeconnexion} className={element}>
            <Icone nom="sortie" taille={18} className="text-ck-texte-2" />
            Se déconnecter
          </button>
        </div>
      )}
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
        <Sidebar moi={moi} chemin={chemin} onNaviguer={() => {}} />
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
        <div className="ml-auto">
          <MenuCompte moi={moi} chemin={chemin} onDeconnexion={onDeconnexion} sombre />
        </div>
      </div>
      {tiroir && (
        <div className="fixed inset-0 z-40 lg:hidden" id="tiroir-navigation" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Fermer le menu" className="absolute inset-0 bg-[#071538]/60" onClick={() => setTiroir(false)} />
          <div className="relative h-full w-[272px] max-w-[85vw] shadow-2xl">
            <Sidebar moi={moi} chemin={chemin} onNaviguer={() => setTiroir(false)} />
          </div>
        </div>
      )}

      {/* En-tête : compte en haut à droite (grand écran) */}
      <header className="mx-auto hidden w-full max-w-6xl justify-end px-8 pt-5 lg:flex">
        <MenuCompte moi={moi} chemin={chemin} onDeconnexion={onDeconnexion} />
      </header>

      <main id="contenu" className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-8 sm:pt-12 lg:pt-4">
        {children}
      </main>
      <PiedDePage />
    </div>
  );
}
