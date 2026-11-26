import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { aujourdhui, formatDzd, type Moi } from "../../../../shared/cockpit";
import { CATEGORIES, CATEGORIES_CLIENT, CATEGORIE_LABEL, PIECE, PIECES, detecter, normaliser, type Categorie, type ClientConnu, type DefinitionPiece, type Piece, type Soi, type TypeDocument } from "../../../../shared/detection";
import { api } from "../api";
import { ACCEPT, envoyerFichier, lireTexte, ouvrirFichier } from "../coffre";
import { surClicLien } from "../routeur";
import { Bouton, Carte, Chargement, EnTete, Erreur, Extension, Icone, Info, Modale, classeChamp } from "../ui";
import { creerZip } from "../zip";

type Doc = {
  id: string;
  categorie: Categorie;
  piece: Piece | null;
  titre: string;
  client_id: string | null;
  client: string | null;
  date_document: string | null;
  expire_le: string | null;
  nom_fichier: string;
  type_mime: string;
  taille: number;
  ajoute_par: string | null;
  ajoute_le: string;
  versions_precedentes: number;
};
type Client = ClientConnu & { actif: boolean };
type Identite = { raison_sociale: string; siege: string; rc: string; nif: string; nis: string; ai: string; rib: string; banque: string };
type FactureImportee = { id: string; numero_affiche: string; date_emission: string; montant_ttc: number; payee_le: string | null; client: string };
type Coffre = {
  documents: Doc[];
  clients: Client[];
  facturesExistantes: string[];
  soi: Soi;
  identite: Identite | null;
  facturesImportees: FactureImportee[] | null; // null : pas l'onglet Factures
  peutImporterFactures: boolean;
  peutSupprimer: boolean;
};

type Etat = "lecture" | "pret" | "envoi" | "ok" | "erreur";
type Ligne = {
  cle: string;
  fichier: File;
  etat: Etat;
  message: string;
  texte: boolean;
  type: TypeDocument;
  piece: Piece | null;
  titre: string;
  client: string; // "" | id | "nouveau"
  nouveau: { nom: string; rc: string; nif: string; adresse: string; actif: boolean };
  date: string;
  expireLe: string;
  numero: string;
  mois: string;
  ht: string;
  tva: string;
  ttc: string;
  payeeLe: string;
  remplace: string | null; // nouvelle version d'un document
};
type Onglet = "legal" | "clients" | "factures";

const dateFr = (iso: string | null) => (iso ? iso.slice(0, 10).split("-").reverse().join("/") : "");
const taille = (o: number) => (o < 1024 * 1024 ? `${Math.max(1, Math.round(o / 1024))} Ko` : `${(o / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`);
const montant = (n: number | null) => (n === null ? "" : String(n));
const TYPE_LABEL = (t: TypeDocument) => (t === "facture" ? "Facture (avant Cockpit)" : CATEGORIE_LABEL[t]);
const lieAuClient = (t: TypeDocument) => t === "facture" || CATEGORIES_CLIENT.includes(t as Categorie);
const pluriel = (n: number, un: string, plusieurs: string) => `${n} ${n > 1 ? plusieurs : un}`;

function expiration(d: { expire_le: string | null }) {
  if (!d.expire_le) return null;
  const jours = Math.round((new Date(`${d.expire_le}T12:00:00Z`).getTime() - new Date(`${aujourdhui()}T12:00:00Z`).getTime()) / 86400000);
  if (jours < 0) return { libelle: `Expiré le ${dateFr(d.expire_le)}`, court: "Expirée", style: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300", urgent: true, expire: true };
  if (jours <= 30) return { libelle: `Expire le ${dateFr(d.expire_le)}`, court: "À renouveler", style: "bg-orange-50 text-ck-orange-texte", urgent: true, expire: false };
  return { libelle: `Valide jusqu'au ${dateFr(d.expire_le)}`, court: "À jour", style: "bg-ck-surface-2 text-ck-texte-2", urgent: false, expire: false };
}

// ——— Lignes à vérifier avant l'enregistrement ———

function ligneDepuis(f: File, lignes: string[], c: Coffre, remplace: Doc | null, pieceImposee: Piece | null): Ligne {
  const d = detecter(lignes, f.name, c.clients, c.soi);
  const piece = remplace ? remplace.piece : (pieceImposee ?? d.piece);
  const type: TypeDocument = remplace ? remplace.categorie : piece ? PIECE[piece].categorie : d.type;
  const fa = d.facture;
  const client = remplace ? (remplace.client_id ?? "") : piece ? "" : d.client && "id" in d.client ? d.client.id : d.client ? "nouveau" : "";
  const nouveau = d.client && "nouveau" in d.client ? d.client.nouveau : null;
  return {
    cle: crypto.randomUUID(),
    fichier: f,
    etat: "pret",
    message: "",
    texte: d.texte,
    type,
    piece,
    titre: remplace ? remplace.titre : piece ? PIECE[piece].titre : d.titre,
    client,
    nouveau: { nom: nouveau?.nom ?? "", rc: nouveau?.rc ?? "", nif: nouveau?.nif ?? "", adresse: nouveau?.adresse ?? "", actif: false },
    date: d.date ?? "",
    expireLe: "",
    numero: fa?.numero && fa.annee ? `${String(fa.numero).padStart(3, "0")}-${String(fa.annee).slice(2)}` : "",
    mois: fa?.mois ?? "",
    ht: montant(fa?.ht ?? null),
    tva: montant(fa?.tva ?? null),
    ttc: montant(fa?.ttc ?? null),
    payeeLe: "",
    remplace: remplace?.id ?? null,
  };
}

/** Ce qui empêche d'enregistrer la ligne (null : prête). */
function bloquant(l: Ligne, c: Coffre): string | null {
  if (l.type === "facture") {
    if (!c.peutImporterFactures) return "Importer une facture demande l'onglet Factures.";
    if (!/^\d{1,4}-(\d{2}|\d{4})$/.test(l.numero.trim())) return "N° de facture à renseigner (ex. 014-26).";
    const [n, a] = l.numero.trim().split("-");
    const numero = `${n!.padStart(3, "0")}-${a!.slice(-2)}`;
    if (c.facturesExistantes.includes(numero)) return `La facture ${numero} existe déjà.`;
    if (!l.date) return "Date d'émission à renseigner.";
    if ([l.ht, l.tva, l.ttc].some((v) => v.trim() === "" || Number.isNaN(Number(v.replace(/\s/g, "").replace(",", "."))))) return "Montants HT, TVA et TTC à renseigner.";
    const [ht, tva, ttc] = [l.ht, l.tva, l.ttc].map((v) => Number(v.replace(/\s/g, "").replace(",", ".")));
    if (Math.abs(ht! + tva! - ttc!) > 1) return "HT + TVA ne donne pas le TTC : vérifiez les montants.";
  }
  if (!l.titre.trim()) return "Titre à renseigner.";
  if (l.piece && PIECE[l.piece].renouveler && !l.expireLe) return "Date de validité à renseigner.";
  if (l.type === "facture" && !l.client) return "Client à choisir.";
  if (l.client === "nouveau" && !l.nouveau.nom.trim()) return "Nom du nouveau client à renseigner.";
  return null;
}

function ChampLigne({ libelle, children, large = false }: { libelle: string; children: ReactNode; large?: boolean }) {
  return (
    <label className={`grid gap-1 text-xs font-semibold text-ck-texte-2 ${large ? "sm:col-span-2" : ""}`}>
      {libelle}
      {children}
    </label>
  );
}

function CarteLigne({ l, c, onChange, onRetirer }: { l: Ligne; c: Coffre; onChange: (p: Partial<Ligne>) => void; onRetirer: () => void }) {
  const fige = l.etat === "envoi" || l.etat === "ok";
  const probleme = l.etat === "pret" || l.etat === "erreur" ? bloquant(l, c) : null;
  const champ = `${classeChamp} !py-1.5 text-sm`;
  const actifs = c.clients.filter((x) => x.actif);
  const anciens = c.clients.filter((x) => !x.actif);
  const piece = l.piece ? PIECE[l.piece] : null;
  return (
    <li className={`rounded-xl border p-4 ${l.etat === "ok" ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : l.etat === "erreur" ? "border-red-300" : "border-ck-bordure"}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Icone nom={l.type === "facture" ? "facture" : "document"} taille={18} className="text-ck-texte-2" />
        <p className="min-w-0 flex-1 truncate font-semibold text-ck-titre" title={l.fichier.name}>
          {l.fichier.name} <span className="font-normal text-ck-texte-2">· {taille(l.fichier.size)}</span>
        </p>
        {piece && <span className="rounded-full bg-ck-plein px-2 py-0.5 text-xs font-semibold text-ck-plein-texte">Dossier légal : {piece.titre}</span>}
        {l.etat === "lecture" && <span className="text-xs text-ck-texte-2">Lecture…</span>}
        {l.etat === "envoi" && <span className="text-xs font-semibold text-[#2f5bd3]">{l.message || "Envoi…"}</span>}
        {l.etat === "ok" && <span className="text-xs font-semibold text-emerald-700">✓ {l.message}</span>}
        {l.etat === "pret" && !l.texte && !piece && <span className="rounded-full bg-ck-surface-2 px-2 py-0.5 text-xs text-ck-texte-2">Pas de texte lisible : à compléter</span>}
        {l.etat === "pret" && l.texte && !piece && <span className="rounded-full bg-[#eef2fb] px-2 py-0.5 text-xs font-semibold text-[#2f5bd3]">Détecté automatiquement</span>}
        {!fige && (
          <button type="button" onClick={onRetirer} aria-label={`Retirer ${l.fichier.name}`} className="grid h-7 w-7 place-items-center rounded-full text-ck-texte-2 hover:bg-ck-surface-2">
            <Icone nom="fermer" taille={16} />
          </button>
        )}
      </div>
      {l.etat !== "lecture" && (
        <fieldset disabled={fige} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ChampLigne libelle="Type">
            <select value={l.type} disabled={!!l.remplace || !!piece} onChange={(e) => onChange({ type: e.target.value as TypeDocument })} className={champ}>
              <option value="facture">{TYPE_LABEL("facture")}</option>
              {CATEGORIES.map((k) => (
                <option key={k} value={k}>
                  {CATEGORIE_LABEL[k]}
                </option>
              ))}
            </select>
          </ChampLigne>
          {l.type === "facture" ? (
            <>
              <ChampLigne libelle="N° de facture">
                <input value={l.numero} onChange={(e) => onChange({ numero: e.target.value, titre: `Facture ${e.target.value}` })} placeholder="014-26" className={champ} />
              </ChampLigne>
              <ChampLigne libelle="Émise le">
                <input type="date" value={l.date} onChange={(e) => onChange({ date: e.target.value })} className={champ} />
              </ChampLigne>
              <ChampLigne libelle="Mois facturé">
                <input type="month" value={l.mois} onChange={(e) => onChange({ mois: e.target.value })} className={champ} />
              </ChampLigne>
            </>
          ) : (
            <>
              <ChampLigne libelle="Titre" large>
                <input value={l.titre} onChange={(e) => onChange({ titre: e.target.value })} maxLength={200} className={champ} />
              </ChampLigne>
              <ChampLigne libelle="Date du document">
                <input type="date" value={l.date} onChange={(e) => onChange({ date: e.target.value })} className={champ} />
              </ChampLigne>
            </>
          )}
          {!lieAuClient(l.type) && !l.remplace && (
            <ChampLigne libelle="Pièce du dossier légal" large>
              <select
                value={l.piece ?? ""}
                onChange={(e) => {
                  const p = (e.target.value || null) as Piece | null;
                  onChange(p ? { piece: p, type: PIECE[p].categorie, titre: PIECE[p].titre, client: "" } : { piece: null });
                }}
                className={champ}
              >
                <option value="">Aucune (autre document de CTA)</option>
                {PIECES.map((p) => (
                  <option key={p.cle} value={p.cle}>
                    {p.titre}
                  </option>
                ))}
              </select>
            </ChampLigne>
          )}
          {lieAuClient(l.type) && (
            <ChampLigne libelle={l.type === "facture" ? "Client" : "Client (facultatif)"} large>
              <select value={l.client} onChange={(e) => onChange({ client: e.target.value })} className={champ}>
                <option value="">{l.type === "facture" ? "Choisir…" : "Aucun"}</option>
                <option value="nouveau">+ Nouveau client{l.nouveau.nom ? ` : ${l.nouveau.nom}` : ""}</option>
                {actifs.length > 0 && (
                  <optgroup label="Clients actifs">
                    {actifs.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.nom}
                      </option>
                    ))}
                  </optgroup>
                )}
                {anciens.length > 0 && (
                  <optgroup label="Anciens clients">
                    {anciens.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.nom}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </ChampLigne>
          )}
          {lieAuClient(l.type) && l.client === "nouveau" && (
            <div className="grid gap-3 rounded-lg bg-ck-surface-2 p-3 sm:col-span-2 lg:col-span-4 sm:grid-cols-2 lg:grid-cols-4">
              <ChampLigne libelle="Nom du nouveau client" large>
                <input value={l.nouveau.nom} onChange={(e) => onChange({ nouveau: { ...l.nouveau, nom: e.target.value } })} maxLength={200} className={champ} />
              </ChampLigne>
              <ChampLigne libelle="RC">
                <input value={l.nouveau.rc} onChange={(e) => onChange({ nouveau: { ...l.nouveau, rc: e.target.value } })} maxLength={60} className={champ} />
              </ChampLigne>
              <ChampLigne libelle="NIF">
                <input value={l.nouveau.nif} onChange={(e) => onChange({ nouveau: { ...l.nouveau, nif: e.target.value } })} maxLength={60} className={champ} />
              </ChampLigne>
              <label className="flex items-center gap-2 text-sm text-ck-texte sm:col-span-2 lg:col-span-4">
                <input type="checkbox" checked={l.nouveau.actif} onChange={(e) => onChange({ nouveau: { ...l.nouveau, actif: e.target.checked } })} className="h-4 w-4 accent-[#071538]" />
                Client toujours en activité (sinon, il est créé comme ancien client, archivé)
              </label>
            </div>
          )}
          {l.type === "facture" ? (
            <>
              <ChampLigne libelle="Total HT (DZD)">
                <input inputMode="decimal" value={l.ht} onChange={(e) => onChange({ ht: e.target.value })} className={`${champ} tabular-nums`} />
              </ChampLigne>
              <ChampLigne libelle="TVA (DZD)">
                <input inputMode="decimal" value={l.tva} onChange={(e) => onChange({ tva: e.target.value })} className={`${champ} tabular-nums`} />
              </ChampLigne>
              <ChampLigne libelle="Total TTC (DZD)">
                <input inputMode="decimal" value={l.ttc} onChange={(e) => onChange({ ttc: e.target.value })} className={`${champ} tabular-nums`} />
              </ChampLigne>
              <ChampLigne libelle="Payée le (si payée)">
                <input type="date" value={l.payeeLe} max={aujourdhui()} onChange={(e) => onChange({ payeeLe: e.target.value })} className={champ} />
              </ChampLigne>
            </>
          ) : (
            <ChampLigne libelle={piece?.renouveler ? "Valide jusqu'au" : "Expire le (facultatif)"}>
              <input type="date" value={l.expireLe} required={!!piece?.renouveler} onChange={(e) => onChange({ expireLe: e.target.value })} className={champ} />
            </ChampLigne>
          )}
        </fieldset>
      )}
      {probleme && <p className="mt-3 text-xs font-semibold text-ck-orange-texte">{probleme}</p>}
      {l.etat === "erreur" && l.message && <p className="mt-3 text-xs font-semibold text-red-700">{l.message}</p>}
    </li>
  );
}

// ——— Historique d'un document ———

function FenetreHistorique({ doc, onFermer }: { doc: Doc; onFermer: () => void }) {
  const [h, setH] = useState<{ versions: { id: string; titre: string; nom_fichier: string; ajoute_le: string; ajoute_par: string | null }[]; consultations: { le: string; nom: string }[] } | null>(null);
  const [erreur, setErreur] = useState("");
  useEffect(() => {
    api<NonNullable<typeof h>>(`coffre/documents/${doc.id}/historique`)
      .then(setH)
      .catch((e: Error) => setErreur(e.message));
  }, [doc.id]);
  return (
    <Modale titre={`Historique : ${doc.titre}`} ouverte onFermer={onFermer}>
      {erreur ? (
        <Erreur>{erreur}</Erreur>
      ) : !h ? (
        <Chargement />
      ) : (
        <div className="grid gap-6">
          <section>
            <h3 className="mb-2 text-sm font-bold text-ck-titre">Versions</h3>
            <ul className="divide-y divide-[color:var(--ck-bordure)] rounded-xl border border-ck-bordure">
              {h.versions.map((v, i) => (
                <li key={v.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ck-titre">
                      {v.nom_fichier} {i === 0 && <span className="ml-1 rounded bg-emerald-50 px-1.5 text-xs text-emerald-700">actuelle</span>}
                    </span>
                    <span className="text-xs text-ck-texte-2">
                      Ajoutée le {dateFr(v.ajoute_le)}
                      {v.ajoute_par ? ` par ${v.ajoute_par}` : ""}
                    </span>
                  </span>
                  <button type="button" onClick={() => void ouvrirFichier(`coffre/documents/${v.id}/lien`).catch((e: Error) => setErreur(e.message))} className="font-bold text-ck-orange-texte hover:underline">
                    Ouvrir
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-bold text-ck-titre">Dernières ouvertures</h3>
            {h.consultations.length === 0 ? (
              <p className="text-sm text-ck-texte-2">Jamais ouvert.</p>
            ) : (
              <ul className="grid gap-1 text-sm text-ck-texte">
                {h.consultations.map((c, i) => (
                  <li key={i}>
                    {c.nom} · {new Date(c.le).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Modale>
  );
}

// ——— Dossier légal ———

/** Valeur légale de CTA affichée sous le titre d'une pièce (RC 16/00-…, NIF …). */
function sousTitrePiece(p: DefinitionPiece, identite: Identite | null) {
  if (p.detail) return p.detail;
  const v = p.identite && identite ? identite[p.identite as keyof Identite] : null;
  if (!v) return "Numéro à renseigner dans l'identité de CTA";
  return `${p.prefixe} ${v}${p.cle === "rib" && identite?.banque ? `, ${identite.banque}` : ""}`;
}

function etatPiece(doc: Doc | undefined) {
  if (!doc) return { libelle: "Fichier manquant", style: "bg-ck-surface-2 text-ck-texte-2", point: null, ok: false };
  const ex = expiration(doc);
  if (ex?.expire) return { libelle: "Expirée", style: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300", point: "bg-red-500", ok: false };
  if (ex?.urgent) return { libelle: "À renouveler", style: "bg-orange-50 text-ck-orange-texte", point: "bg-ck-orange", ok: true };
  return { libelle: "À jour", style: "bg-emerald-50 text-emerald-700", point: "bg-emerald-500", ok: true };
}

function CartePiece({
  p,
  doc,
  identite,
  peutSupprimer,
  onAjouter,
  onOuvrir,
  onHistorique,
  onSupprimer,
}: {
  p: DefinitionPiece;
  doc: Doc | undefined;
  identite: Identite | null;
  peutSupprimer: boolean;
  onAjouter: () => void;
  onOuvrir: () => void;
  onHistorique: () => void;
  onSupprimer: () => void;
}) {
  const e = etatPiece(doc);
  const lien = "font-semibold text-[#2f5bd3] hover:underline";
  return (
    <li
      className={`flex h-full flex-col rounded-2xl border p-4 transition ${
        !doc ? "border-ck-bordure bg-ck-surface-2/40" : e.ok && e.libelle === "À jour" ? "border-emerald-200 bg-ck-surface dark:border-emerald-900" : e.ok ? "border-orange-200 bg-ck-surface" : "border-red-200 bg-ck-surface"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span aria-hidden="true" className={`grid h-9 w-9 place-items-center rounded-xl ${p.renouveler ? "bg-orange-50 text-ck-orange" : doc ? "bg-emerald-50 text-emerald-700" : "bg-[#eef2fb] text-[#2f5bd3]"}`}>
          <Icone nom={p.icone} taille={17} />
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${e.style}`}>
          {e.point && <span className={`h-1.5 w-1.5 rounded-full ${e.point}`} />}
          {e.libelle}
        </span>
      </div>
      <h4 className="mt-3 font-bold leading-snug text-ck-titre">{p.titre}</h4>
      <p className="mt-0.5 break-words text-xs text-ck-texte-2">{sousTitrePiece(p, identite)}</p>
      {doc ? (
        <div className="mt-auto pt-3">
          <p className="flex items-start gap-1.5 text-xs text-ck-texte">
            <Icone nom="document" taille={14} className="mt-0.5 shrink-0 text-ck-texte-2" />
            <span className="min-w-0">
              <span className="block truncate font-semibold" title={doc.nom_fichier}>
                {doc.nom_fichier}, {taille(doc.taille)}
              </span>
              <span className="block text-ck-texte-2">
                {doc.expire_le ? `Valide jusqu'au ${dateFr(doc.expire_le)}` : `Ajouté le ${dateFr(doc.ajoute_le)}${doc.ajoute_par ? ` par ${doc.ajoute_par}` : ""}`}
              </span>
            </span>
          </p>
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
            <button type="button" onClick={onOuvrir} className={lien}>
              Ouvrir
            </button>
            <button type="button" onClick={onAjouter} className={lien}>
              {p.renouveler ? "Renouveler" : "Remplacer"}
            </button>
            {doc.versions_precedentes > 0 && (
              <button type="button" onClick={onHistorique} className="font-semibold text-ck-texte-2 hover:text-ck-titre hover:underline">
                Historique
              </button>
            )}
            {peutSupprimer && (
              <button type="button" onClick={onSupprimer} className="font-semibold text-ck-texte-2 hover:text-red-700 hover:underline">
                Supprimer
              </button>
            )}
          </p>
        </div>
      ) : (
        <div className="mt-auto pt-4">
          <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={onAjouter}>
            {p.renouveler ? "Ajouter avec sa date de validité" : "Ajouter le fichier"}
          </Bouton>
        </div>
      )}
    </li>
  );
}

// ——— Page ———

export default function Documents({ moi }: { moi: Moi }) {
  const [c, setC] = useState<Coffre | null>(null);
  const [erreur, setErreur] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [survol, setSurvol] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [zip, setZip] = useState(false);
  const parExpiration = !!new URLSearchParams(window.location.search).get("expiration");
  const [onglet, setOnglet] = useState<Onglet>("legal");
  const [filtre, setFiltre] = useState<"" | Categorie | "expiration">(parExpiration ? "expiration" : "");
  const [client, setClient] = useState("");
  const [recherche, setRecherche] = useState("");
  const [historique, setHistorique] = useState<Doc | null>(null);
  const entree = useRef<HTMLInputElement>(null);
  const entreeVersion = useRef<HTMLInputElement>(null);
  const entreePiece = useRef<HTMLInputElement>(null);
  const aVerifier = useRef<HTMLDivElement>(null);
  const [aRemplacer, setARemplacer] = useState<Doc | null>(null);
  const [pieceVisee, setPieceVisee] = useState<Piece | null>(null);

  const charger = useCallback(() => {
    api<Coffre>("coffre")
      .then(setC)
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  // Arrivée depuis « À renouveler » (Aujourd'hui) : le dossier légal s'il a une pièce concernée, sinon les documents clients
  const ongletChoisi = useRef(false);
  useEffect(() => {
    if (!c || ongletChoisi.current) return;
    ongletChoisi.current = true;
    if (parExpiration && !c.documents.some((d) => d.piece && expiration(d)?.urgent)) setOnglet("clients");
  }, [c, parExpiration]);

  const modifier = (cle: string, p: Partial<Ligne>) => setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, ...p } : l)));

  async function ajouter(fichiers: FileList | File[], remplace: Doc | null = null, piece: Piece | null = null) {
    if (!c) return;
    const liste = [...fichiers];
    const nouvelles = liste.map((f) => ({ ...ligneDepuis(f, [], c, remplace, piece), etat: "lecture" as Etat }));
    setLignes((ls) => [...ls, ...nouvelles]);
    requestAnimationFrame(() => aVerifier.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    for (const [i, f] of liste.entries()) {
      const texte = await lireTexte(f);
      const l = ligneDepuis(f, texte, c, remplace, piece);
      setLignes((ls) => ls.map((x) => (x.cle === nouvelles[i]!.cle ? { ...l, cle: x.cle } : x)));
    }
  }

  async function enregistrer() {
    if (!c) return;
    setEnCours(true);
    let horsDossierLegal = false;
    // Une à une : un client créé par une ligne est réutilisé par les suivantes
    for (const l of lignes) {
      if ((l.etat !== "pret" && l.etat !== "erreur") || bloquant(l, c)) continue;
      modifier(l.cle, { etat: "envoi", message: "Envoi…" });
      try {
        const facture = l.type === "facture";
        const fichier = await envoyerFichier(facture ? "factures" : "documents", l.fichier, (p) => modifier(l.cle, { message: `Envoi… ${Math.round(p)} %` }));
        const clientCorps =
          l.piece || !lieAuClient(l.type) || !l.client
            ? {}
            : l.client === "nouveau"
              ? { nouveauClient: { nom: l.nouveau.nom, rc: l.nouveau.rc, nif: l.nouveau.nif, adresse: l.nouveau.adresse, actif: l.nouveau.actif } }
              : { clientId: l.client };
        const r = facture
          ? await api<{ numero?: string; clientCree: boolean }>("coffre/factures", {
              corps: { fichier, numero: l.numero.trim(), dateEmission: l.date, mois: l.mois, ht: l.ht, tva: l.tva, ttc: l.ttc, payeeLe: l.payeeLe || null, ...clientCorps },
            })
          : await api<{ numero?: string; clientCree: boolean }>("coffre/documents", {
              corps: { fichier, nomFichier: l.fichier.name, categorie: l.type, piece: l.piece, titre: l.titre, dateDocument: l.date || null, expireLe: l.expireLe || null, precedentId: l.remplace, ...clientCorps },
            });
        if (!facture && !l.piece) horsDossierLegal = true;
        modifier(l.cle, {
          etat: "ok",
          message: `${facture ? `Facture ${r.numero} importée` : l.piece ? "Ajouté au dossier légal" : l.remplace ? "Nouvelle version enregistrée" : "Enregistré"}${r.clientCree ? ", client créé" : ""}`,
        });
        // Les clients créés doivent être connus des lignes suivantes
        if (r.clientCree) {
          const frais = await api<Coffre>("coffre");
          setC(frais);
          const nouveau = frais.clients.find((x) => normaliser(x.nom) === normaliser(l.nouveau.nom));
          if (nouveau) setLignes((ls) => ls.map((x) => (x.etat === "pret" && x.client === "nouveau" && normaliser(x.nouveau.nom) === normaliser(l.nouveau.nom) ? { ...x, client: nouveau.id } : x)));
        }
      } catch (e) {
        modifier(l.cle, { etat: "erreur", message: (e as Error).message });
      }
    }
    setEnCours(false);
    if (horsDossierLegal) setOnglet("clients");
    charger();
  }

  const autres = useMemo(() => c?.documents.filter((d) => !d.piece) ?? [], [c]);

  const groupes = useMemo(() => {
    if (!c) return [];
    const q = normaliser(recherche);
    const visibles = autres.filter((d) => {
      if (filtre === "expiration" && !expiration(d)?.urgent) return false;
      if (filtre && filtre !== "expiration" && d.categorie !== filtre) return false;
      if (client && (client === "aucun" ? d.client_id : d.client_id !== client)) return false;
      return !q || normaliser(`${d.titre} ${d.nom_fichier} ${d.client ?? ""} ${CATEGORIE_LABEL[d.categorie]}`).includes(q);
    });
    const parClient = new Map<string, { id: string | null; nom: string; docs: Doc[] }>();
    for (const d of visibles) {
      const cle = d.client_id ?? "";
      const g = parClient.get(cle) ?? { id: d.client_id, nom: d.client ?? "Documents de CTA, sans client", docs: [] };
      g.docs.push(d);
      parClient.set(cle, g);
    }
    // Clients par ordre alphabétique, documents sans client à la fin
    return [...parClient.values()].sort((a, b) => (a.id ? 0 : 1) - (b.id ? 0 : 1) || a.nom.localeCompare(b.nom, "fr"));
  }, [c, autres, filtre, client, recherche]);

  if (!c) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const actuelle = (p: Piece) => c.documents.find((d) => d.piece === p);
  const aJour = PIECES.filter((p) => etatPiece(actuelle(p.cle)).ok).length;
  const fournies = PIECES.filter((p) => actuelle(p.cle));
  const prets = lignes.filter((l) => (l.etat === "pret" || l.etat === "erreur") && !bloquant(l, c)).length;
  const importees = c.facturesImportees;
  const voitClients = moi.onglets.includes("clients");

  function deposer(e: DragEvent) {
    e.preventDefault();
    setSurvol(false);
    if (e.dataTransfer.files.length) void ajouter(e.dataTransfer.files);
  }

  async function action(f: () => Promise<unknown>) {
    setErreur("");
    try {
      await f();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  async function supprimer(d: Doc) {
    if (!window.confirm(`Supprimer « ${d.titre} » (${d.nom_fichier}) ?${d.versions_precedentes ? " La version précédente redeviendra la version actuelle." : ""} Le fichier est effacé définitivement.`)) return;
    await action(async () => {
      await api(`coffre/documents/${d.id}`, { methode: "DELETE" });
      charger();
    });
  }

  const ouvrir = (d: Doc) => void action(() => ouvrirFichier(`coffre/documents/${d.id}/lien`));

  function nouvelleVersion(d: Doc) {
    setARemplacer(d);
    entreeVersion.current?.click();
  }

  function ajouterPiece(p: Piece) {
    setPieceVisee(p);
    entreePiece.current?.click();
  }

  /** Toutes les pièces fournies dans une archive ZIP, numérotées dans l'ordre du dossier. */
  async function telechargerDossier() {
    setZip(true);
    await action(async () => {
      const fichiers = [];
      for (const [i, p] of PIECES.entries()) {
        const d = actuelle(p.cle);
        if (!d) continue;
        const { lien } = await api<{ lien: string }>(`coffre/documents/${d.id}/lien`);
        const r = await fetch(new URL(lien, window.location.origin).href);
        if (!r.ok) throw new Error(`${p.titre} : fichier illisible, réessayez.`);
        const ext = d.nom_fichier.includes(".") ? d.nom_fichier.split(".").pop() : "pdf";
        fichiers.push({ nom: `${String(i + 1).padStart(2, "0")} - ${p.titre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9' -]/g, "")}.${ext}`, octets: new Uint8Array(await r.arrayBuffer()) });
      }
      const url = URL.createObjectURL(creerZip(fichiers));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Dossier legal CTA - ${aujourdhui()}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    }).catch(() => undefined);
    setZip(false);
  }

  const onglets: { cle: Onglet; libelle: string; nombre?: number }[] = [
    { cle: "legal", libelle: "Dossier légal CTA" },
    { cle: "clients", libelle: "Documents clients et partenaires", nombre: autres.length },
    ...(importees ? [{ cle: "factures" as const, libelle: "Factures importées", nombre: importees.length }] : []),
  ];

  const identite = PIECES.filter((p) => !("renouveler" in p));
  const attestations = PIECES.filter((p) => "renouveler" in p);
  const cartePiece = (p: DefinitionPiece) => {
    const d = actuelle(p.cle);
    return (
      <CartePiece
        key={p.cle}
        p={p}
        doc={d}
        identite={c.identite}
        peutSupprimer={c.peutSupprimer}
        onAjouter={() => ajouterPiece(p.cle)}
        onOuvrir={() => d && ouvrir(d)}
        onHistorique={() => d && setHistorique(d)}
        onSupprimer={() => d && void supprimer(d)}
      />
    );
  };

  return (
    <>
      <EnTete
        titre="Les"
        accent="documents."
        sousTitre="Le dossier légal de CTA d'un côté, les documents de vos clients et partenaires de l'autre."
        actions={
          <Bouton onClick={() => entree.current?.click()}>
            <Icone nom="plus" taille={18} /> Ajouter des documents
          </Bouton>
        }
      />

      <input
        ref={entree}
        type="file"
        multiple
        accept={ACCEPT}
        className="sr-only"
        aria-label="Choisir des documents"
        onChange={(e) => {
          if (e.target.files?.length) void ajouter(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={entreeVersion}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label="Choisir la nouvelle version"
        onChange={(e) => {
          if (e.target.files?.length && aRemplacer) void ajouter(e.target.files, aRemplacer);
          e.target.value = "";
          setARemplacer(null);
        }}
      />
      <input
        ref={entreePiece}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        aria-label="Choisir le fichier de la pièce"
        onChange={(e) => {
          if (e.target.files?.length && pieceVisee) void ajouter(e.target.files, null, pieceVisee);
          e.target.value = "";
          setPieceVisee(null);
        }}
      />

      <div role="tablist" aria-label="Rubriques" className="mb-5 flex flex-wrap gap-2">
        {onglets.map((o) => (
          <button
            key={o.cle}
            type="button"
            role="tab"
            aria-selected={onglet === o.cle}
            onClick={() => setOnglet(o.cle)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              onglet === o.cle ? "bg-ck-plein text-ck-plein-texte shadow-sm" : "bg-ck-surface text-ck-titre ring-1 ring-ck-bordure hover:bg-ck-surface-2"
            }`}
          >
            {o.libelle}
            {o.nombre !== undefined && <span className={`rounded-md px-1.5 text-xs tabular-nums ${onglet === o.cle ? "bg-white/15" : "bg-ck-surface-2 text-ck-texte-2"}`}>{o.nombre}</span>}
          </button>
        ))}
      </div>

      {erreur && (
        <div className="mb-5">
          <Erreur>{erreur}</Erreur>
        </div>
      )}

      {lignes.length > 0 && (
        <div ref={aVerifier} className="mb-6 scroll-mt-6">
          <Carte className="!p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-ck-titre">À vérifier ({lignes.filter((l) => l.etat !== "ok").length})</h2>
              <div className="flex gap-2">
                <Bouton variante="discret" disabled={enCours} onClick={() => setLignes((ls) => ls.filter((l) => l.etat === "envoi" || l.etat === "lecture"))}>
                  Vider
                </Bouton>
                <Bouton variante="orange" disabled={enCours || prets === 0} onClick={() => void enregistrer()}>
                  {enCours ? "Enregistrement…" : `Enregistrer ${prets > 1 ? `les ${prets} documents` : prets === 1 ? "le document" : ""}`}
                </Bouton>
              </div>
            </div>
            <ul className="grid gap-3">
              {lignes.map((l) => (
                <CarteLigne key={l.cle} l={l} c={c} onChange={(p) => modifier(l.cle, p)} onRetirer={() => setLignes((ls) => ls.filter((x) => x.cle !== l.cle))} />
              ))}
            </ul>
          </Carte>
        </div>
      )}

      {/* ——— Dossier légal de CTA ——— */}
      {onglet === "legal" && (
        <section aria-labelledby="titre-legal" className="ck-carte overflow-hidden">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,#071538_0%,#13235a_100%)] px-6 py-6 text-white sm:px-8">
            <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(220,90,46,0.3),transparent)]" />
            <div className="relative flex flex-wrap items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white p-2">
                <img src="/images/logo-cta-icone.png" alt="" className="h-full w-full object-contain" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="titre-legal" className="ck-titre text-2xl !text-white">
                  Dossier légal de CTA
                </h2>
                <p className="mt-0.5 text-sm text-white/70">{c.identite ? [c.identite.raison_sociale, c.identite.siege].filter(Boolean).join(", ") : "Pièces officielles de l'entreprise"}</p>
              </div>
            </div>
            <div className="relative mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="w-full max-w-xs">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-white/70">Dossier complet à {Math.round((aJour / PIECES.length) * 100)} %</span>
                  <span className="font-bold">{pluriel(aJour, "pièce", "pièces")} sur {PIECES.length}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15" role="progressbar" aria-label="Pièces à jour" aria-valuemin={0} aria-valuemax={PIECES.length} aria-valuenow={aJour}>
                  <div className="h-full rounded-full bg-ck-orange transition-all" style={{ width: `${(aJour / PIECES.length) * 100}%` }} />
                </div>
              </div>
              <button
                type="button"
                disabled={fournies.length === 0 || zip}
                onClick={() => void telechargerDossier()}
                title={fournies.length === 0 ? "Aucune pièce à télécharger pour l'instant." : `Les ${fournies.length} pièces fournies, dans une archive ZIP.`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#071538] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icone nom="telecharger" taille={16} /> {zip ? "Préparation…" : "Télécharger le dossier"}
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <h3 className="mb-3 font-bold text-ck-titre">Identité légale</h3>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{identite.map(cartePiece)}</ul>
            <h3 className="mb-3 mt-7 flex flex-wrap items-baseline gap-x-2 font-bold text-ck-titre">
              Attestations à renouveler <span className="text-xs font-normal text-ck-texte-2">Cockpit vous prévient 30 jours avant l'échéance.</span>
            </h3>
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{attestations.map(cartePiece)}</ul>
          </div>
        </section>
      )}

      {/* ——— Documents clients et partenaires ——— */}
      {onglet === "clients" && (
        <section aria-labelledby="titre-documents">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="titre-documents" className="ck-titre text-xl">
                Documents clients et partenaires
              </h2>
              <p className="mt-1 text-sm text-ck-texte-2">Contrats, NDA, bons de commande et pièces échangées avec vos clients.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <select aria-label="Filtrer par type" value={filtre} onChange={(e) => setFiltre(e.target.value as typeof filtre)} className={`${classeChamp} !w-auto !py-1.5`}>
                <option value="">Tous les types</option>
                <option value="expiration">À renouveler</option>
                {CATEGORIES.map((k) => (
                  <option key={k} value={k}>
                    {CATEGORIE_LABEL[k]}
                  </option>
                ))}
              </select>
              <select aria-label="Filtrer par client" value={client} onChange={(e) => setClient(e.target.value)} className={`${classeChamp} !w-auto !py-1.5`}>
                <option value="">Tous les clients</option>
                {c.clients
                  .filter((x) => autres.some((d) => d.client_id === x.id))
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.nom}
                    </option>
                  ))}
                {autres.some((d) => !d.client_id) && <option value="aucun">Sans client</option>}
              </select>
              <input type="search" aria-label="Rechercher un document" placeholder="Rechercher…" value={recherche} onChange={(e) => setRecherche(e.target.value)} className={`${classeChamp} !w-48 !py-1.5`} />
            </div>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setSurvol(true);
            }}
            onDragLeave={() => setSurvol(false)}
            onDrop={deposer}
            className={`flex flex-wrap items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-4 transition ${survol ? "border-ck-orange bg-orange-50/50" : "border-ck-bordure bg-ck-surface"}`}
          >
            <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eef2fb] text-ck-titre">
              <Icone nom="televerser" taille={20} />
            </span>
            <span className="min-w-0 flex-1 basis-52">
              <span className="block font-bold text-ck-titre">Glissez vos fichiers ici</span>
              <span className="block text-xs text-ck-texte-2">Le type, le client et les montants des factures sont lus dans les PDF ; vous vérifiez avant d'enregistrer. PDF, images, Word ou Excel, 25 Mo maximum.</span>
            </span>
            <Bouton variante="contour" onClick={() => entree.current?.click()}>
              Choisir des fichiers
            </Bouton>
          </div>

          {groupes.length === 0 ? (
            <Carte className="mt-4 text-center text-sm text-ck-texte-2">{autres.length ? "Aucun document pour ces filtres." : "Aucun document client pour l'instant : déposez vos contrats et NDA ci-dessus."}</Carte>
          ) : (
            groupes.map((g) => (
              <Carte key={g.id ?? "sans-client"} className="mt-4 !p-0">
                <div className="flex items-center gap-3 border-b border-ck-bordure px-5 py-3.5">
                  <span aria-hidden="true" className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-extrabold ${g.id ? "bg-[#071538] text-white" : "bg-ck-surface-2 text-ck-texte-2"}`}>
                    {g.id ? g.nom.trim().charAt(0).toUpperCase() : <Icone nom="dossier" taille={16} />}
                  </span>
                  {g.id && voitClients ? (
                    <a href={`/cockpit/reglages/clients/${g.id}`} onClick={(e) => surClicLien(e, `/reglages/clients/${g.id}`)} className="font-bold text-ck-titre hover:underline" title="Ouvrir le dossier du client">
                      {g.nom}
                    </a>
                  ) : (
                    <span className="font-bold text-ck-titre">{g.nom}</span>
                  )}
                  <span className="text-xs text-ck-texte-2">{pluriel(g.docs.length, "document", "documents")}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-ck-texte-2">
                      <tr className="border-b border-ck-bordure">
                        {["Document", "Type", "Validité", "Ajouté", ""].map((t, i) => (
                          <th key={i} scope="col" className="px-5 py-2.5 text-left font-semibold">
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.docs.map((d) => {
                        const ex = expiration(d);
                        return (
                          <tr key={d.id} className="border-b border-ck-bordure last:border-0">
                            <th scope="row" className="px-5 py-3 text-left font-normal">
                              <span className="flex items-center gap-3">
                                <Extension nom={d.nom_fichier} />
                                <span className="min-w-0 max-w-[22rem]">
                                  <span className="block truncate font-bold text-ck-titre">{d.titre}</span>
                                  <span className="block truncate text-xs text-ck-texte-2">
                                    {d.nom_fichier}
                                    {d.versions_precedentes > 0 && ` · ${d.versions_precedentes + 1} versions`}
                                  </span>
                                </span>
                              </span>
                            </th>
                            <td className="px-5 py-3">
                              <span className="whitespace-nowrap rounded-full bg-[#efeafd] px-2.5 py-0.5 text-xs font-semibold text-[#5b3fc4] dark:bg-[#2a2350] dark:text-[#c9bbff]">{CATEGORIE_LABEL[d.categorie]}</span>
                            </td>
                            <td className="whitespace-nowrap px-5 py-3 text-xs">{ex ? <span className={`rounded-full px-2.5 py-0.5 font-semibold ${ex.style}`}>{ex.libelle}</span> : <span className="text-ck-texte-2">Sans échéance</span>}</td>
                            <td className="whitespace-nowrap px-5 py-3 text-xs text-ck-texte-2">
                              <span className="block text-ck-texte">{dateFr(d.ajoute_le)}</span>
                              {d.ajoute_par}
                            </td>
                            <td className="whitespace-nowrap px-5 py-3 text-right">
                              <span className="inline-flex items-center gap-1">
                                <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={() => ouvrir(d)}>
                                  Ouvrir
                                </Bouton>
                                <details className="relative">
                                  <summary aria-label={`Plus d'actions pour ${d.titre}`} title="Plus d'actions" className="grid h-8 w-8 cursor-pointer list-none place-items-center rounded-full text-ck-texte-2 transition hover:bg-ck-surface-2 hover:text-ck-titre [&::-webkit-details-marker]:hidden">
                                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                                      <circle cx="5" cy="12" r="1.8" />
                                      <circle cx="12" cy="12" r="1.8" />
                                      <circle cx="19" cy="12" r="1.8" />
                                    </svg>
                                  </summary>
                                  <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-ck-bordure bg-ck-surface p-1 text-left shadow-[var(--ck-ombre)]">
                                    {(
                                      [
                                        { libelle: "Nouvelle version", action: () => nouvelleVersion(d) },
                                        { libelle: "Historique", action: () => setHistorique(d) },
                                        c.peutSupprimer && { libelle: "Supprimer", action: () => void supprimer(d), danger: true },
                                      ] as (false | { libelle: string; action: () => void; danger?: boolean })[]
                                    )
                                      .filter((a): a is { libelle: string; action: () => void; danger?: boolean } => !!a)
                                      .map((a) => (
                                        <button
                                          key={a.libelle}
                                          type="button"
                                          onClick={(e) => {
                                            (e.currentTarget.closest("details") as HTMLDetailsElement).open = false;
                                            a.action();
                                          }}
                                          className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold hover:bg-ck-surface-2 ${a.danger ? "text-red-700" : "text-ck-titre"}`}
                                        >
                                          {a.libelle}
                                        </button>
                                      ))}
                                  </div>
                                </details>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Carte>
            ))
          )}

          {importees && importees.length > 0 && (
            <Carte className="mt-4 !py-4">
              <div className="flex flex-wrap items-center gap-4">
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icone nom="facture" taille={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ck-titre">{pluriel(importees.length, "facture importée", "factures importées")}</span>
                  <span className="block text-xs text-ck-texte-2">Elles sont rangées dans la page Factures, avec leur PDF d'origine.</span>
                </span>
                <button type="button" onClick={() => setOnglet("factures")} className="text-sm font-bold text-[#2f5bd3] hover:underline">
                  Voir les factures →
                </button>
              </div>
            </Carte>
          )}
        </section>
      )}

      {/* ——— Factures importées ——— */}
      {onglet === "factures" && importees && (
        <section aria-labelledby="titre-factures">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="titre-factures" className="ck-titre text-xl">
                Factures importées
              </h2>
              <p className="mt-1 text-sm text-ck-texte-2">Les factures émises avant Cockpit, avec leur PDF d'origine. Déposez-en d'autres avec « Ajouter des documents ».</p>
            </div>
            <a href="/cockpit/factures" onClick={(e) => surClicLien(e, "/factures")} className="text-sm font-bold text-[#2f5bd3] hover:underline">
              Ouvrir la page Factures →
            </a>
          </div>
          <Carte className="overflow-x-auto !p-0">
            {importees.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-ck-texte-2">Aucune facture importée.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-ck-texte-2">
                  <tr className="border-b border-ck-bordure">
                    {["N°", "Client", "Émise le", "Montant TTC", "Paiement", ""].map((t, i) => (
                      <th key={i} scope="col" className={`px-5 py-3 font-semibold ${i === 3 ? "text-right" : "text-left"}`}>
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {importees.map((f) => (
                    <tr key={f.id} className="border-b border-ck-bordure last:border-0">
                      <th scope="row" className="px-5 py-3 text-left font-bold tabular-nums text-ck-titre">
                        {f.numero_affiche}
                      </th>
                      <td className="px-5 py-3">{f.client}</td>
                      <td className="whitespace-nowrap px-5 py-3">{dateFr(f.date_emission)}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-semibold tabular-nums text-ck-titre">{formatDzd(f.montant_ttc)}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${f.payee_le ? "bg-emerald-50 text-emerald-700" : "bg-ck-surface-2 text-ck-texte-2"}`}>
                          {f.payee_le ? `Payée le ${dateFr(f.payee_le)}` : "Non payée"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button type="button" onClick={() => void action(() => ouvrirFichier(`factures/${f.id}`))} className="font-bold text-ck-orange-texte hover:underline">
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Carte>
          <div className="mt-4">
            <Info>Le suivi des paiements et la suppression d'une facture importée se font dans la page Factures.</Info>
          </div>
        </section>
      )}

      {historique && <FenetreHistorique doc={historique} onFermer={() => setHistorique(null)} />}
    </>
  );
}
