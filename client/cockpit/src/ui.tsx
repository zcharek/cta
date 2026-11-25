import { useEffect, useId, useRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { ROLE_LABEL, STATUT_ACCES_LABEL, type Role, type StatutAcces } from "../../../shared/cockpit";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Variante = "plein" | "contour" | "discret" | "danger" | "orange";

const VARIANTES: Record<Variante, string> = {
  plein: "bg-ck-plein text-ck-plein-texte hover:opacity-90",
  orange: "bg-ck-orange text-white shadow-[0_8px_20px_-8px_rgba(220,90,46,0.7)] hover:brightness-105",
  contour: "border-2 border-ck-plein text-ck-titre hover:bg-ck-surface-2",
  discret: "text-ck-texte-2 hover:bg-ck-surface-2 hover:text-ck-titre",
  danger: "border-2 border-red-600 text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950",
};

export function Bouton({ variante = "plein", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return (
    <button
      type="button"
      {...p}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTES[variante],
        className,
      )}
    />
  );
}

export function Carte({ className, children, ...p }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section {...p} className={cx("ck-carte p-5 sm:p-6", className)}>
      {children}
    </section>
  );
}

export const classeChamp =
  "w-full rounded-xl border border-transparent bg-[var(--ck-champ)] px-3.5 py-2.5 text-ck-texte placeholder:text-[#9aa3b8] transition focus:border-ck-orange focus:bg-ck-surface focus:outline-none focus:ring-2 focus:ring-[#dc5a2e]/20 read-only:text-ck-texte-2";

export function Champ({ libelle, aide, className, icone, ...p }: InputHTMLAttributes<HTMLInputElement> & { libelle: string; aide?: string; icone?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ck-titre">
        {libelle}
      </label>
      <div className="relative">
        {icone && <Icone nom={icone} taille={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ck-texte-2" />}
        <input id={id} {...p} aria-describedby={aide ? `${id}-aide` : undefined} className={cx(classeChamp, icone && "pl-11")} />
      </div>
      {aide && (
        <p id={`${id}-aide`} className="mt-1 text-xs text-ck-texte-2">
          {aide}
        </p>
      )}
    </div>
  );
}

/** En-tête de carte : icône, titre, sous-titre et action facultative. */
export function EnteteSection({ icone, titre, sousTitre, action, id, sombre = false }: { icone: string; titre: string; sousTitre?: string; action?: ReactNode; id?: string; sombre?: boolean }) {
  return (
    <div className="mb-5 flex items-start gap-3.5">
      <span className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", sombre ? "bg-white/10 text-ck-orange" : "bg-[#eef2fb] text-ck-titre")}>
        <Icone nom={icone} taille={20} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 id={id} className={cx("ck-titre text-lg leading-tight", sombre && "!text-white")}>
          {titre}
        </h2>
        {sousTitre && <p className={cx("mt-0.5 text-sm", sombre ? "text-white/70" : "text-ck-texte-2")}>{sousTitre}</p>}
      </div>
      {action}
    </div>
  );
}

export function Erreur({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
      {children}
    </p>
  );
}

export function Info({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="rounded-[10px] border border-ck-bordure bg-ck-surface-2 px-4 py-3 text-sm text-ck-texte">
      {children}
    </div>
  );
}

export function Chargement() {
  return (
    <p role="status" className="py-16 text-center text-ck-texte-2">
      Chargement…
    </p>
  );
}

export function Pastille({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <span style={style} className={cx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", className)}>
      {children}
    </span>
  );
}

/** Couleur propre à chaque type d'utilisateur. */
export const COULEUR_ROLE: Record<Role, string> = {
  collaborateur: "#2F5BD3",
  comptable: "#0E7C86",
  assistant: "#1E8A5A",
  qa_manager: "#7A5BC7",
  cofounder: "#DC5A2E",
  founder: "#B7791F",
};

export function BadgeRole({ role }: { role: Role }) {
  const c = COULEUR_ROLE[role];
  return (
    <Pastille style={{ color: c, backgroundColor: `${c}1F`, boxShadow: `inset 0 0 0 1px ${c}40` }} className="dark:brightness-150">
      {ROLE_LABEL[role]}
    </Pastille>
  );
}

const STYLE_ACCES: Record<StatutAcces, string> = {
  invitation: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  actif: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  archive: "bg-ck-surface-2 text-ck-texte-2",
};

export function BadgeAcces({ statut }: { statut: StatutAcces }) {
  return <Pastille className={STYLE_ACCES[statut]}>{STATUT_ACCES_LABEL[statut]}</Pastille>;
}

export function initiales(nom: string) {
  const mots = nom.trim().split(/\s+/);
  return ((mots[0]?.[0] ?? "") + (mots.length > 1 ? mots[mots.length - 1]![0] : "")).toUpperCase();
}

export function Avatar({ nom, couleur = "#071538", taille = 40 }: { nom: string; couleur?: string; taille?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-1 ring-black/5 dark:ring-white/25"
      style={{ width: taille, height: taille, backgroundColor: couleur, fontSize: taille * 0.38 }}
    >
      {initiales(nom)}
    </span>
  );
}

/** Fenêtre modale sur <dialog> : piège du focus, Échap et fond gérés par le navigateur. */
export function Modale({ titre, ouverte, onFermer, children, pied, large = false }: { titre: string; ouverte: boolean; onFermer: () => void; children: ReactNode; pied?: ReactNode; large?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouverte && !d.open) d.showModal();
    if (!ouverte && d.open) d.close();
  }, [ouverte]);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={onFermer}
      onClick={(e) => e.target === ref.current && onFermer()}
      className={`m-auto w-[calc(100%-2rem)] ${large ? "max-w-4xl" : "max-w-lg"} rounded-2xl bg-ck-surface p-0 text-ck-texte shadow-2xl backdrop:bg-[#071538]/50 backdrop:backdrop-blur-sm`}
    >
      {ouverte && (
        <div className="flex max-h-[85vh] flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-ck-bordure px-6 py-4">
            <h2 id={id} className="ck-titre text-lg">
              {titre}
            </h2>
            <button type="button" onClick={onFermer} aria-label="Fermer" className="rounded-lg p-1.5 text-ck-texte-2 hover:bg-ck-surface-2">
              <Icone nom="fermer" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
          {pied && <div className="flex flex-wrap items-center justify-end gap-3 border-t border-ck-bordure px-6 py-4">{pied}</div>}
        </div>
      )}
    </dialog>
  );
}

const ICONES: Record<string, ReactNode> = {
  soleil: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  kanban: (
    <>
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10" y="4" width="5" height="11" rx="1.5" />
      <rect x="17" y="4" width="4" height="7" rx="1.5" />
    </>
  ),
  horloge: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  valider: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </>
  ),
  graphique: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  equipe: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </>
  ),
  message: <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12Z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  fermer: <path d="M6 6l12 12M18 6 6 18" />,
  sortie: <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  profil: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  facture: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </>
  ),
  lieu: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  telephone: <path d="M5 3h3.5l1.7 4.3-2.2 1.5a11 11 0 0 0 6.2 6.2l1.5-2.2L20 14.5V18a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  cadenas: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  bouclier: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  crayon: <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" />,
  coche: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.4" />
    </>
  ),
  identite: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2.2" />
      <path d="M5.8 16a3.4 3.4 0 0 1 6.4 0M14.5 10h4M14.5 13.5h3" />
    </>
  ),
  banque: <path d="M3 9.5 12 4l9 5.5M5 10v7M9.5 10v7M14.5 10v7M19 10v7M3 20h18" />,
  calendrier: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17M8 14h2M14 14h2M8 17.5h2" />
    </>
  ),
  envoyer: <path d="M21 3 10 14M21 3l-7 18-4-7-7-4Z" />,
  gauche: <path d="m15 5-7 7 7 7" />,
  droite: <path d="m9 5 7 7-7 7" />,
  recharger: <path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7" />,
  plusRond: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  batiment: <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4" />,
};

export function Icone({ nom, taille = 20, className }: { nom: keyof typeof ICONES | string; taille?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICONES[nom]}
    </svg>
  );
}

/** Titre de page : pastille facultative au-dessus, partie en orange facultative. */
export function EnTete({ titre, accent, pastille, sousTitre, actions, icone }: { titre: string; accent?: string; pastille?: string; sousTitre?: string; actions?: ReactNode; icone?: string }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-center gap-5">
        {icone && (
          <span aria-hidden="true" className="hidden h-[72px] w-[72px] shrink-0 place-items-center rounded-full bg-[#fbe3d9] text-ck-orange sm:grid">
            <Icone nom={icone} taille={34} />
          </span>
        )}
        <div>
        {pastille && <Pastille className="mb-3 bg-ck-surface text-ck-titre shadow-sm ring-1 ring-ck-bordure">{pastille}</Pastille>}
        <h1 className="ck-titre text-3xl sm:text-4xl">
          {titre}
          {accent && <span className="text-ck-orange"> {accent}</span>}
        </h1>
        {sousTitre && <p className="mt-2 text-ck-texte-2">{sousTitre}</p>}
        <span aria-hidden="true" className="mt-3 block h-[3px] w-16 rounded-full bg-ck-orange" />
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

/** Panneau latéral (fiche) sur <dialog> : focus piégé, Échap pour fermer. */
export function PanneauLateral({ titre, sousTitre, onFermer, children, pied }: { titre: string; sousTitre?: ReactNode; onFermer: () => void; children: ReactNode; pied?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={onFermer}
      onClick={(e) => e.target === ref.current && onFermer()}
      className="fixed inset-y-0 left-auto right-0 m-0 h-full max-h-none w-full max-w-xl bg-ck-surface p-0 text-ck-texte shadow-2xl backdrop:bg-[#071538]/50"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-ck-bordure px-6 py-5">
          <div className="min-w-0">
            <h2 id={id} className="ck-titre text-xl">
              {titre}
            </h2>
            {sousTitre && <div className="mt-1 text-sm text-ck-texte-2">{sousTitre}</div>}
          </div>
          <button type="button" onClick={onFermer} aria-label="Fermer la fiche" className="rounded-lg p-1.5 text-ck-texte-2 hover:bg-ck-surface-2">
            <Icone nom="fermer" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {pied && <div className="flex flex-wrap items-center gap-3 border-t border-ck-bordure px-6 py-4">{pied}</div>}
      </div>
    </dialog>
  );
}

export function ZoneTexte({ libelle, aide, className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { libelle: string; aide?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ck-titre">
        {libelle}
      </label>
      <textarea id={id} {...p} aria-describedby={aide ? `${id}-aide` : undefined} className={`${classeChamp} min-h-[6rem]`} />
      {aide && (
        <p id={`${id}-aide`} className="mt-1 text-xs text-ck-texte-2">
          {aide}
        </p>
      )}
    </div>
  );
}

export function IconeWhatsApp({ taille = 18 }: { taille?: number }) {
  return (
    <svg aria-hidden="true" width={taille} height={taille} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

// ——— Pages à étapes (Factures, Paie) ———

export function ChiffreCle({ icone, teinte, valeur, libelle }: { icone: string; teinte: string; valeur: string | number; libelle: string }) {
  return (
    <Carte className="!p-5">
      <div className="flex items-center gap-4">
        <span aria-hidden="true" className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${teinte}`}>
          <Icone nom={icone} taille={20} />
        </span>
        <div className="min-w-0">
          <p className="ck-titre truncate text-2xl leading-tight">{valeur}</p>
          <p className="text-xs text-ck-texte-2">{libelle}</p>
        </div>
      </div>
    </Carte>
  );
}

export function Etape({ numero, titre, children }: { numero: number; titre: string; children: ReactNode }) {
  return (
    <section className="border-t border-ck-bordure pt-5 first:border-0 first:pt-0">
      <h3 className="mb-3 flex items-center gap-2.5 font-bold text-ck-titre">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-ck-plein text-xs text-white">{numero}</span>
        {titre}
      </h3>
      {children}
    </section>
  );
}

export function Verification({ ok, titre, detail, action }: { ok: boolean; titre: string; detail: string; action?: ReactNode }) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <span aria-hidden="true" className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${ok ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-ck-orange"}`}>
        <Icone nom={ok ? "coche" : "info"} taille={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ck-titre">
          <span className="sr-only">{ok ? "Vérifié : " : "À faire : "}</span>
          {titre}
        </p>
        <p className="text-xs text-ck-texte-2">{detail}</p>
      </div>
      {action}
    </li>
  );
}
