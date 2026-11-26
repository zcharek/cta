import { DndContext, DragOverlay, PointerSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { STATUT_CABINET_LABEL, type StatutCabinet } from "../../../../shared/cockpit";
import {
  COLONNES_KANBAN,
  COULEUR_STATUT,
  correspond,
  estARelancer,
  lienAppelCabinet,
  lienWhatsApp,
  neufDerniersChiffres,
  trierCartes,
  trierSemaines,
} from "../../../../shared/prospection";
import { api, type CabinetCarte } from "../api";
import type { Moi } from "../api";
import Fiche from "../prospection/Fiche";
import ImportCabinets from "../prospection/Import";
import { Avatar, Bouton, Chargement, EnTete, Erreur, IconeWhatsApp, Icone, Info, Pastille, classeChamp } from "../ui";
import FenetreMessageWhatsApp from "./MessageWhatsApp";

const PAR_PAGE = 25;
/** Fréquence du contrôle des changements faits par les autres (onglet visible uniquement). */
const INTERVALLE_SYNCHRO = 4000;

type Membre = { id: string; nom: string };
type Donnees = { cabinets: CabinetCarte[]; modele: string; equipe: Membre[]; version: string; aujourdhui: string };

export const dateCourte = (iso: string | null) =>
  iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }) : "";

type Actions = {
  ouvrir: (id: string) => void;
  deplacer: (c: CabinetCarte, statut: StatutCabinet) => void;
  whatsapp: (c: CabinetCarte) => void;
  assigner: (c: CabinetCarte, profilId: string | null) => void;
};

const ORANGE = "#dc5a2e";

/** Pastille de suivi : « M'assigner » si personne ne suit le cabinet, sinon l'avatar de la personne. */
function Suivi({ c, suivi, moiId, actions }: { c: CabinetCarte; suivi: Membre | null; moiId: string; actions?: Actions }) {
  const stop = (e: React.PointerEvent) => e.stopPropagation(); // pas de glisser-déposer depuis le bouton
  if (!suivi)
    return (
      <button
        type="button"
        onPointerDown={stop}
        onClick={() => actions?.assigner(c, moiId)}
        aria-label={`M'assigner ${c.nom}`}
        title="M'assigner ce cabinet"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-dashed border-ck-bordure text-ck-texte-2 transition hover:border-ck-orange hover:text-ck-orange-texte"
      >
        <Icone nom="plus" taille={14} />
      </button>
    );
  const soi = suivi.id === moiId;
  return (
    <button
      type="button"
      onPointerDown={stop}
      onClick={() => {
        if (soi) actions?.assigner(c, null);
        else if (window.confirm(`${suivi.nom} suit ${c.nom}. Le reprendre à votre nom ?`)) actions?.assigner(c, moiId);
      }}
      aria-label={soi ? `Vous suivez ${c.nom} : vous retirer` : `Suivi par ${suivi.nom} : le reprendre`}
      title={soi ? "Suivi par vous · cliquer pour vous retirer" : `Suivi par ${suivi.nom} · cliquer pour le reprendre`}
      className="shrink-0 rounded-full transition hover:opacity-80"
    >
      <Avatar nom={suivi.nom} couleur={soi ? ORANGE : "#071538"} taille={28} />
    </button>
  );
}

function ContenuCarte({
  c,
  du,
  doublon,
  modele,
  actions,
  apercu,
  suivi,
  moiId,
  recent,
}: {
  c: CabinetCarte;
  du: boolean;
  doublon: boolean;
  modele: string;
  actions?: Actions;
  apercu?: boolean;
  suivi: Membre | null;
  moiId: string;
  recent?: boolean;
}) {
  const wa = lienWhatsApp(c, modele);
  const appel = wa ? null : lienAppelCabinet(c);
  return (
    <div
      className={`rounded-xl border border-ck-bordure bg-ck-surface p-3.5 shadow-sm transition-shadow duration-700 ${du ? "border-l-4 !border-l-ck-orange" : ""} ${apercu ? "rotate-2 shadow-xl" : ""} ${
        recent ? "ring-2 ring-[#2f5bd3]/60" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <button type="button" onClick={() => actions?.ouvrir(c.id)} className="block min-w-0 flex-1 text-left">
          <span className="block font-bold leading-snug text-ck-titre hover:underline">{c.nom}</span>
          {c.veterinaire && <span className="mt-0.5 block truncate text-sm text-ck-texte-2">{c.veterinaire}</span>}
        </button>
        <Suivi c={c} suivi={suivi} moiId={moiId} actions={actions} />
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {c.commune && <Pastille className="bg-ck-surface-2 text-ck-texte">{c.commune}</Pastille>}
        {c.segment && <Pastille className="bg-ck-surface-2 text-ck-texte">{c.segment}</Pastille>}
        {c.semaine_plan && <Pastille className="bg-ck-surface-2 text-ck-texte">{c.semaine_plan}</Pastille>}
        {c.canal1 && <Pastille className="bg-ck-surface-2 text-ck-texte">{c.canal1}</Pastille>}
        {doublon && <Pastille className="bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">Doublon possible</Pastille>}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className={`min-w-0 truncate text-sm ${du ? "font-bold text-ck-orange-texte" : "text-ck-texte-2"}`}>
          {c.relance_le ? (
            <>
              {du ? "À relancer" : "Relance"} <span className="whitespace-nowrap">{dateCourte(c.relance_le)}</span>
            </>
          ) : (
            c.telephone ?? ""
          )}
        </span>
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => actions?.whatsapp(c)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#1E8A5A] px-2.5 py-1.5 text-xs font-bold text-white hover:opacity-90"
            aria-label={`WhatsApp : ${c.nom}`}
          >
            <IconeWhatsApp taille={15} /> WhatsApp
          </a>
        ) : appel ? (
          <a href={appel} className="shrink-0 rounded-lg border-2 border-ck-plein px-2.5 py-1 text-xs font-bold text-ck-titre" aria-label={`Appeler ${c.nom}`}>
            Appeler
          </a>
        ) : null}
      </div>
      {actions && (
        <select
          aria-label={`Déplacer ${c.nom} vers…`}
          value=""
          onChange={(e) => e.target.value && actions.deplacer(c, e.target.value as StatutCabinet)}
          onPointerDown={(e) => e.stopPropagation()}
          className="mt-2.5 w-full rounded-lg border border-ck-bordure bg-ck-surface px-2 py-1.5 text-xs text-ck-texte-2"
        >
          <option value="">Déplacer vers…</option>
          {[...COLONNES_KANBAN, "hors_cible" as const]
            .filter((s) => s !== c.statut)
            .map((s) => (
              <option key={s} value={s}>
                {STATUT_CABINET_LABEL[s]}
              </option>
            ))}
        </select>
      )}
    </div>
  );
}

const Carte = memo(function Carte(props: { c: CabinetCarte; du: boolean; doublon: boolean; modele: string; actions: Actions; suivi: Membre | null; moiId: string; recent: boolean }) {
  const { setNodeRef, listeners, isDragging } = useDraggable({ id: props.c.id, data: props.c });
  // Pas d'attributs clavier de dnd-kit : au clavier, on déplace avec le menu « Déplacer vers… ».
  return (
    <li ref={setNodeRef} {...listeners} className={`touch-manipulation ${isDragging ? "opacity-30" : ""}`}>
      <ContenuCarte {...props} />
    </li>
  );
});

function Colonne({ statut, cartes, total, limite, onPlus, rendu }: { statut: StatutCabinet; cartes: CabinetCarte[]; total: number; limite: number; onPlus: () => void; rendu: (c: CabinetCarte) => React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: statut });
  return (
    <section
      ref={setNodeRef}
      aria-label={`${STATUT_CABINET_LABEL[statut]} : ${total} cabinet${total > 1 ? "s" : ""}`}
      className={`flex w-[290px] shrink-0 snap-start flex-col rounded-2xl p-2.5 transition ${isOver ? "bg-ck-surface ring-2 ring-ck-orange" : "bg-ck-surface-2/70 ring-1 ring-ck-bordure"}`}
    >
      <h2 className="flex items-center gap-2 px-1.5 pb-2.5 pt-1 text-sm font-bold text-ck-titre">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COULEUR_STATUT[statut] }} />
        <span className="flex-1">{STATUT_CABINET_LABEL[statut]}</span>
        <span className="rounded-full bg-ck-surface px-2 py-0.5 text-xs text-ck-texte-2">{total}</span>
      </h2>
      <ul className="flex min-h-[4rem] flex-col gap-2.5">{cartes.slice(0, limite).map(rendu)}</ul>
      {total > limite && (
        <Bouton variante="discret" className="mt-2 w-full" onClick={onPlus}>
          Afficher {Math.min(PAR_PAGE, total - limite)} de plus
        </Bouton>
      )}
    </section>
  );
}

function Filtre({ id, libelle, valeur, options, onChange }: { id: string; libelle: string; valeur: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {libelle}
      </label>
      <select id={id} value={valeur} onChange={(e) => onChange(e.target.value)} className={`${classeChamp} !py-2 sm:w-44`}>
        <option value="">{libelle} : toutes</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Cabinets({ moi }: { moi: Moi }) {
  const [whatsappOuvert, setWhatsappOuvert] = useState(() => new URLSearchParams(window.location.search).has("whatsapp"));
  const requete = new URLSearchParams(window.location.search);
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [semaine, setSemaine] = useState(requete.get("semaine") ?? "");
  const [segment, setSegment] = useState("");
  const [commune, setCommune] = useState("");
  const [aRelancer, setARelancer] = useState(requete.get("relance") === "1");
  // Suivi : "" (tous), "moi", "aucun" ou l'id d'une personne
  const [suiviPar, setSuiviPar] = useState(requete.get("suivi") === "moi" ? "moi" : "");
  const [limites, setLimites] = useState<Partial<Record<StatutCabinet, number>>>({});
  const [ficheId, setFicheId] = useState<string | null>(null);
  const [importOuvert, setImportOuvert] = useState(false);
  const [glisse, setGlisse] = useState<CabinetCarte | null>(null);
  const [annonce, setAnnonce] = useState("");

  // ——— Synchronisation : chaque écran vérifie régulièrement si un collègue a changé quelque chose ———
  const version = useRef<string | null>(null);
  const enVol = useRef(0); // nos propres enregistrements en cours : on ne recharge pas par-dessus
  const glisseEnCours = useRef(false);
  const [recents, setRecents] = useState<Set<string>>(new Set());

  const charger = useCallback((silencieux = false) => {
    api<Donnees>("cabinets")
      .then((d) => {
        version.current = d.version;
        setDonnees((avant) => {
          if (silencieux && avant) {
            // Cartes changées par quelqu'un d'autre : brièvement mises en évidence
            const anciens = new Map(avant.cabinets.map((c) => [c.id, c]));
            const changes = d.cabinets.filter((c) => {
              const a = anciens.get(c.id);
              return !a || a.statut !== c.statut || a.assigne_a !== c.assigne_a || a.relance_le !== c.relance_le || a.nom !== c.nom;
            });
            if (changes.length && changes.length < 30) {
              setRecents(new Set(changes.map((c) => c.id)));
              setTimeout(() => setRecents(new Set()), 2500);
            }
          }
          return d;
        });
      })
      .catch((e: Error) => !silencieux && setErreur(e.message));
  }, []);
  useEffect(() => charger(), [charger]);

  useEffect(() => {
    let actif = true;
    const verifier = async () => {
      if (document.visibilityState !== "visible" || glisseEnCours.current || enVol.current > 0 || !version.current) return;
      try {
        const r = await api<{ version: string }>("cabinets/version");
        if (actif && r.version !== version.current && !glisseEnCours.current && enVol.current === 0) charger(true);
      } catch {
        // Réseau coupé : on réessaiera au prochain tour
      }
    };
    const minuterie = window.setInterval(() => void verifier(), INTERVALLE_SYNCHRO);
    const auRetour = () => void verifier();
    document.addEventListener("visibilitychange", auRetour);
    window.addEventListener("focus", auRetour);
    return () => {
      actif = false;
      window.clearInterval(minuterie);
      document.removeEventListener("visibilitychange", auRetour);
      window.removeEventListener("focus", auRetour);
    };
  }, [charger]);

  // Filtres dans l'adresse : liens depuis « Aujourd'hui » et partage
  useEffect(() => {
    const q = new URLSearchParams();
    if (semaine) q.set("semaine", semaine);
    if (aRelancer) q.set("relance", "1");
    if (suiviPar === "moi") q.set("suivi", "moi");
    window.history.replaceState(null, "", `/cockpit/cabinets${q.toString() ? `?${q}` : ""}`);
  }, [semaine, aRelancer, suiviPar]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }));

  const majLocale = useCallback((id: string, changements: Partial<CabinetCarte>) => {
    setDonnees((d) => d && { ...d, cabinets: d.cabinets.map((c) => (c.id === id ? { ...c, ...changements } : c)) });
  }, []);

  const actions: Actions = useMemo(
    () => ({
      ouvrir: setFicheId,
      deplacer: async (c, statut) => {
        const avant = { statut: c.statut, relance_le: c.relance_le, premier_contact: c.premier_contact };
        majLocale(c.id, { statut });
        setAnnonce(`${c.nom} déplacé vers ${STATUT_CABINET_LABEL[statut]}.`);
        enVol.current++;
        try {
          const r = await api<{ cabinet: Partial<CabinetCarte> }>(`cabinets/${c.id}/statut`, { corps: { statut } });
          majLocale(c.id, r.cabinet);
        } catch (e) {
          majLocale(c.id, avant);
          setErreur((e as Error).message);
        } finally {
          enVol.current--;
        }
      },
      whatsapp: async (c) => {
        enVol.current++;
        try {
          const r = await api<{ cabinet: Partial<CabinetCarte> }>(`cabinets/${c.id}/whatsapp`, { methode: "POST" });
          majLocale(c.id, r.cabinet);
        } catch (e) {
          setErreur((e as Error).message);
        } finally {
          enVol.current--;
        }
      },
      assigner: async (c, profilId) => {
        const avant = c.assigne_a;
        majLocale(c.id, { assigne_a: profilId });
        setAnnonce(profilId ? `${c.nom} vous est assigné.` : `Vous ne suivez plus ${c.nom}.`);
        enVol.current++;
        try {
          await api(`cabinets/${c.id}/assignation`, { corps: { profilId } });
        } catch (e) {
          majLocale(c.id, { assigne_a: avant });
          setErreur((e as Error).message);
        } finally {
          enVol.current--;
        }
      },
    }),
    [majLocale],
  );

  const vue = useMemo(() => {
    if (!donnees) return null;
    const { cabinets, aujourdhui } = donnees;
    const telephones = new Map<string, number>();
    for (const c of cabinets) {
      const t = neufDerniersChiffres(c.telephone);
      if (t) telephones.set(t, (telephones.get(t) ?? 0) + 1);
    }
    const filtres = cabinets.filter(
      (c) =>
        (!semaine || c.semaine_plan === semaine) &&
        (!segment || c.segment === segment) &&
        (!commune || c.commune === commune) &&
        (!aRelancer || estARelancer(c, aujourdhui)) &&
        (!suiviPar || (suiviPar === "moi" ? c.assigne_a === moi.id : suiviPar === "aucun" ? !c.assigne_a : c.assigne_a === suiviPar)) &&
        correspond(c, recherche),
    );
    const colonnes = Object.fromEntries(COLONNES_KANBAN.map((s) => [s, trierCartes(filtres.filter((c) => c.statut === s), aujourdhui)])) as Record<StatutCabinet, CabinetCarte[]>;
    return {
      colonnes,
      nombre: filtres.length,
      dues: cabinets.filter((c) => estARelancer(c, aujourdhui)).length,
      miens: cabinets.filter((c) => c.assigne_a === moi.id).length,
      membres: new Map(donnees.equipe.map((m) => [m.id, m])),
      estDoublon: (c: CabinetCarte) => {
        const t = neufDerniersChiffres(c.telephone);
        return !!t && (telephones.get(t) ?? 0) > 1;
      },
      semaines: trierSemaines(cabinets.map((c) => c.semaine_plan)),
      segments: trierSemaines(cabinets.map((c) => c.segment)),
      communes: trierSemaines(cabinets.map((c) => c.commune)),
    };
  }, [donnees, semaine, segment, commune, aRelancer, suiviPar, recherche, moi.id]);

  function finGlisser(e: DragEndEvent) {
    setGlisse(null);
    glisseEnCours.current = false;
    const c = e.active.data.current as CabinetCarte | undefined;
    const vers = e.over?.id as StatutCabinet | undefined;
    if (c && vers && vers !== c.statut) void actions.deplacer(c, vers);
  }

  if (!donnees || !vue) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const filtresActifs = !!(recherche || semaine || segment || commune || aRelancer || suiviPar);
  const suiviDe = (c: CabinetCarte) => (c.assigne_a ? (vue.membres.get(c.assigne_a) ?? { id: c.assigne_a, nom: "Compte retiré" }) : null);
  const rendu = (c: CabinetCarte) => (
    <Carte
      key={c.id}
      c={c}
      du={estARelancer(c, donnees.aujourdhui)}
      doublon={vue.estDoublon(c)}
      modele={donnees.modele}
      actions={actions}
      suivi={suiviDe(c)}
      moiId={moi.id}
      recent={recents.has(c.id)}
    />
  );

  return (
    <>
      <EnTete
        titre="Cabinets"
        accent="VetCare."
        sousTitre={`${donnees.cabinets.length} cabinets en prospection${vue.dues ? ` · ${vue.dues} relance${vue.dues > 1 ? "s" : ""} due${vue.dues > 1 ? "s" : ""}` : ""}`}
        actions={
          <>
            {moi.onglets.includes("whatsapp") && (
              <Bouton variante="contour" onClick={() => setWhatsappOuvert(true)}>
                <IconeWhatsApp /> Message WhatsApp
              </Bouton>
            )}
            <Bouton variante="contour" onClick={() => setImportOuvert(true)}>
              <Icone nom="plus" taille={18} /> Importer un fichier
            </Bouton>
          </>
        }
      />
      {whatsappOuvert && (
        <FenetreMessageWhatsApp
          onFermer={() => setWhatsappOuvert(false)}
          onEnregistre={(modele) => setDonnees((d) => d && { ...d, modele })}
        />
      )}

      <div role="search" className="mb-5 flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-72">
          <label htmlFor="recherche-cabinets" className="sr-only">
            Rechercher un cabinet
          </label>
          <input
            id="recherche-cabinets"
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Nom, vétérinaire, téléphone…"
            className={`${classeChamp} !py-2`}
          />
        </div>
        <Filtre id="f-semaine" libelle="Semaine" valeur={semaine} options={vue.semaines} onChange={setSemaine} />
        <Filtre id="f-segment" libelle="Segment" valeur={segment} options={vue.segments} onChange={setSegment} />
        <Filtre id="f-commune" libelle="Commune" valeur={commune} options={vue.communes} onChange={setCommune} />
        <div>
          <label htmlFor="f-suivi" className="sr-only">
            Suivi par
          </label>
          <select id="f-suivi" value={suiviPar} onChange={(e) => setSuiviPar(e.target.value)} className={`${classeChamp} !py-2 sm:w-44`}>
            <option value="">Suivi par : tous</option>
            <option value="moi">Mes cabinets ({vue.miens})</option>
            <option value="aucun">Personne</option>
            {donnees.equipe
              .filter((m) => m.id !== moi.id)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
          </select>
        </div>
        <button
          type="button"
          aria-pressed={aRelancer}
          onClick={() => setARelancer(!aRelancer)}
          className={`rounded-[10px] border-2 px-3.5 py-1.5 text-sm font-bold transition ${aRelancer ? "border-ck-orange bg-ck-orange text-white" : "border-ck-orange text-ck-orange-texte hover:bg-ck-surface"}`}
        >
          À relancer{vue.dues ? ` (${vue.dues})` : ""}
        </button>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-ck-texte-2" title="Les changements faits par vos collègues apparaissent automatiquement, en quelques secondes.">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />
          En direct
        </span>
        {filtresActifs && (
          <Bouton
            variante="discret"
            className="!py-1.5"
            onClick={() => {
              setRecherche("");
              setSemaine("");
              setSegment("");
              setCommune("");
              setARelancer(false);
              setSuiviPar("");
            }}
          >
            Effacer les filtres ({vue.nombre})
          </Bouton>
        )}
      </div>

      {erreur && (
        <div className="mb-4">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {annonce}
      </p>

      {donnees.cabinets.length === 0 ? (
        <Info>Aucun cabinet pour l'instant. Importez le fichier Excel des vétérinaires avec « Importer un fichier ».</Info>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={(e: DragStartEvent) => {
            glisseEnCours.current = true;
            setGlisse(e.active.data.current as CabinetCarte);
          }}
          onDragEnd={finGlisser}
          onDragCancel={() => {
            glisseEnCours.current = false;
            setGlisse(null);
          }}
        >
                    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8">
            {COLONNES_KANBAN.map((s) => (
              <Colonne
                key={s}
                statut={s}
                cartes={vue.colonnes[s]}
                total={vue.colonnes[s].length}
                limite={limites[s] ?? PAR_PAGE}
                onPlus={() => setLimites((l) => ({ ...l, [s]: (l[s] ?? PAR_PAGE) + PAR_PAGE }))}
                rendu={rendu}
              />
            ))}
          </div>
          <DragOverlay>
            {glisse && <ContenuCarte c={glisse} du={estARelancer(glisse, donnees.aujourdhui)} doublon={vue.estDoublon(glisse)} modele={donnees.modele} suivi={suiviDe(glisse)} moiId={moi.id} apercu />}
          </DragOverlay>
        </DndContext>
      )}

      {ficheId && (
        <Fiche
          id={ficheId}
          equipe={donnees.equipe}
          moiId={moi.id}
          onFermer={() => setFicheId(null)}
          onChange={(c) => (c ? majLocale(c.id, c) : charger(true))}
          onSupprime={(id) => {
            setFicheId(null);
            setDonnees((d) => d && { ...d, cabinets: d.cabinets.filter((c) => c.id !== id) });
          }}
        />
      )}
      {importOuvert && (
        <ImportCabinets
          onFermer={(importe) => {
            setImportOuvert(false);
            if (importe) charger();
          }}
        />
      )}
    </>
  );
}
