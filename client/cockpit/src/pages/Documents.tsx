import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { aujourdhui } from "../../../../shared/cockpit";
import { CATEGORIES, CATEGORIES_CLIENT, CATEGORIE_LABEL, detecter, normaliser, type Categorie, type ClientConnu, type Soi, type TypeDocument } from "../../../../shared/detection";
import { api } from "../api";
import { ACCEPT, envoyerFichier, lireTexte, ouvrirFichier } from "../coffre";
import { Bouton, Carte, Chargement, ChiffreCle, EnTete, Erreur, Icone, Info, Modale, classeChamp } from "../ui";

type Doc = {
  id: string;
  categorie: Categorie;
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
type Coffre = { documents: Doc[]; clients: Client[]; facturesExistantes: string[]; soi: Soi; peutImporterFactures: boolean; peutSupprimer: boolean };

type Etat = "lecture" | "pret" | "envoi" | "ok" | "erreur";
type Ligne = {
  cle: string;
  fichier: File;
  etat: Etat;
  message: string;
  texte: boolean;
  type: TypeDocument;
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

const dateFr = (iso: string | null) => (iso ? iso.slice(0, 10).split("-").reverse().join("/") : "");
const taille = (o: number) => (o < 1024 * 1024 ? `${Math.max(1, Math.round(o / 1024))} Ko` : `${(o / 1024 / 1024).toFixed(1).replace(".", ",")} Mo`);
const montant = (n: number | null) => (n === null ? "" : String(n));
const TYPE_LABEL = (t: TypeDocument) => (t === "facture" ? "Facture (avant Cockpit)" : CATEGORIE_LABEL[t]);
const lieAuClient = (t: TypeDocument) => t === "facture" || CATEGORIES_CLIENT.includes(t as Categorie);

function expiration(d: { expire_le: string | null }) {
  if (!d.expire_le) return null;
  const jours = Math.round((new Date(`${d.expire_le}T12:00:00Z`).getTime() - new Date(`${aujourdhui()}T12:00:00Z`).getTime()) / 86400000);
  if (jours < 0) return { libelle: `Expiré le ${dateFr(d.expire_le)}`, style: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300", urgent: true };
  if (jours <= 30) return { libelle: `Expire le ${dateFr(d.expire_le)}`, style: "bg-orange-50 text-ck-orange-texte", urgent: true };
  return { libelle: `Valide jusqu'au ${dateFr(d.expire_le)}`, style: "bg-ck-surface-2 text-ck-texte-2", urgent: false };
}

// ——— Lignes à vérifier avant l'enregistrement ———

function ligneDepuis(f: File, lignes: string[], c: Coffre, remplace: Doc | null): Ligne {
  const d = detecter(lignes, f.name, c.clients, c.soi);
  const type: TypeDocument = remplace ? remplace.categorie : d.type;
  const fa = d.facture;
  const client = remplace ? (remplace.client_id ?? "") : d.client && "id" in d.client ? d.client.id : d.client ? "nouveau" : "";
  const nouveau = d.client && "nouveau" in d.client ? d.client.nouveau : null;
  return {
    cle: crypto.randomUUID(),
    fichier: f,
    etat: "pret",
    message: "",
    texte: d.texte,
    type,
    titre: remplace ? remplace.titre : d.titre,
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
  if (l.type === "facture" && !l.client) return "Client à choisir.";
  if (l.client === "nouveau" && !l.nouveau.nom.trim()) return "Nom du nouveau client à renseigner.";
  return null;
}

function ChampLigne({ libelle, children, large = false }: { libelle: string; children: React.ReactNode; large?: boolean }) {
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
  return (
    <li className={`rounded-xl border p-4 ${l.etat === "ok" ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : l.etat === "erreur" ? "border-red-300" : "border-ck-bordure"}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Icone nom={l.type === "facture" ? "facture" : "document"} taille={18} className="text-ck-texte-2" />
        <p className="min-w-0 flex-1 truncate font-semibold text-ck-titre" title={l.fichier.name}>
          {l.fichier.name} <span className="font-normal text-ck-texte-2">· {taille(l.fichier.size)}</span>
        </p>
        {l.etat === "lecture" && <span className="text-xs text-ck-texte-2">Lecture…</span>}
        {l.etat === "envoi" && <span className="text-xs font-semibold text-[#2f5bd3]">{l.message || "Envoi…"}</span>}
        {l.etat === "ok" && <span className="text-xs font-semibold text-emerald-700">✓ {l.message}</span>}
        {l.etat === "pret" && !l.texte && <span className="rounded-full bg-ck-surface-2 px-2 py-0.5 text-xs text-ck-texte-2">Pas de texte lisible : à compléter</span>}
        {l.etat === "pret" && l.texte && <span className="rounded-full bg-[#eef2fb] px-2 py-0.5 text-xs font-semibold text-[#2f5bd3]">Détecté automatiquement</span>}
        {!fige && (
          <button type="button" onClick={onRetirer} aria-label={`Retirer ${l.fichier.name}`} className="grid h-7 w-7 place-items-center rounded-full text-ck-texte-2 hover:bg-ck-surface-2">
            <Icone nom="fermer" taille={16} />
          </button>
        )}
      </div>
      {l.etat !== "lecture" && (
        <fieldset disabled={fige} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ChampLigne libelle="Type">
            <select value={l.type} disabled={!!l.remplace} onChange={(e) => onChange({ type: e.target.value as TypeDocument })} className={champ}>
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
            <ChampLigne libelle="Expire le (facultatif)">
              <input type="date" value={l.expireLe} onChange={(e) => onChange({ expireLe: e.target.value })} className={champ} />
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

// ——— Page ———

export default function Documents() {
  const [c, setC] = useState<Coffre | null>(null);
  const [erreur, setErreur] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [survol, setSurvol] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [filtre, setFiltre] = useState<"" | Categorie | "client" | "entreprise" | "expiration">(() => (new URLSearchParams(window.location.search).get("expiration") ? "expiration" : ""));
  const [client, setClient] = useState("");
  const [recherche, setRecherche] = useState("");
  const [historique, setHistorique] = useState<Doc | null>(null);
  const entree = useRef<HTMLInputElement>(null);
  const entreeVersion = useRef<HTMLInputElement>(null);
  const [aRemplacer, setARemplacer] = useState<Doc | null>(null);

  const charger = useCallback(() => {
    api<Coffre>("coffre")
      .then(setC)
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  const modifier = (cle: string, p: Partial<Ligne>) => setLignes((ls) => ls.map((l) => (l.cle === cle ? { ...l, ...p } : l)));

  async function ajouter(fichiers: FileList | File[], remplace: Doc | null = null) {
    if (!c) return;
    const liste = [...fichiers];
    const nouvelles = liste.map((f) => ({ ...ligneDepuis(f, [], c, remplace), etat: "lecture" as Etat }));
    setLignes((ls) => [...ls, ...nouvelles]);
    for (const [i, f] of liste.entries()) {
      const texte = await lireTexte(f);
      const l = ligneDepuis(f, texte, c, remplace);
      setLignes((ls) => ls.map((x) => (x.cle === nouvelles[i]!.cle ? { ...l, cle: x.cle } : x)));
    }
  }

  async function enregistrer() {
    if (!c) return;
    setEnCours(true);
    // Une à une : un client créé par une ligne est réutilisé par les suivantes
    for (const l of lignes) {
      if ((l.etat !== "pret" && l.etat !== "erreur") || bloquant(l, c)) continue;
      modifier(l.cle, { etat: "envoi", message: "Envoi…" });
      try {
        const facture = l.type === "facture";
        const fichier = await envoyerFichier(facture ? "factures" : "documents", l.fichier, (p) => modifier(l.cle, { message: `Envoi… ${Math.round(p)} %` }));
        const clientCorps = !lieAuClient(l.type) || !l.client ? {} : l.client === "nouveau" ? { nouveauClient: { nom: l.nouveau.nom, rc: l.nouveau.rc, nif: l.nouveau.nif, adresse: l.nouveau.adresse, actif: l.nouveau.actif } } : { clientId: l.client };
        const r = facture
          ? await api<{ numero?: string; clientCree: boolean }>("coffre/factures", {
              corps: { fichier, numero: l.numero.trim(), dateEmission: l.date, mois: l.mois, ht: l.ht, tva: l.tva, ttc: l.ttc, payeeLe: l.payeeLe || null, ...clientCorps },
            })
          : await api<{ numero?: string; clientCree: boolean }>("coffre/documents", {
              corps: { fichier, nomFichier: l.fichier.name, categorie: l.type, titre: l.titre, dateDocument: l.date || null, expireLe: l.expireLe || null, precedentId: l.remplace, ...clientCorps },
            });
        modifier(l.cle, { etat: "ok", message: `${facture ? `Facture ${r.numero} importée` : l.remplace ? "Nouvelle version enregistrée" : "Enregistré"}${r.clientCree ? ", client créé" : ""}` });
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
    charger();
  }

  const documents = useMemo(() => {
    if (!c) return [];
    const q = normaliser(recherche);
    return c.documents.filter((d) => {
      if (filtre === "client" && !CATEGORIES_CLIENT.includes(d.categorie)) return false;
      if (filtre === "entreprise" && CATEGORIES_CLIENT.includes(d.categorie)) return false;
      if (filtre === "expiration" && !expiration(d)?.urgent) return false;
      if (filtre && !["client", "entreprise", "expiration"].includes(filtre) && d.categorie !== filtre) return false;
      if (client && d.client_id !== client) return false;
      return !q || normaliser(`${d.titre} ${d.nom_fichier} ${d.client ?? ""} ${CATEGORIE_LABEL[d.categorie]}`).includes(q);
    });
  }, [c, filtre, client, recherche]);

  if (!c) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const aExpiration = c.documents.filter((d) => expiration(d)?.urgent).length;
  const clientsLies = new Set(c.documents.map((d) => d.client_id).filter(Boolean)).size;
  const prets = lignes.filter((l) => (l.etat === "pret" || l.etat === "erreur") && !bloquant(l, c)).length;
  const peutSupprimer = c.peutSupprimer;

  function deposer(e: DragEvent) {
    e.preventDefault();
    setSurvol(false);
    if (e.dataTransfer.files.length) void ajouter(e.dataTransfer.files);
  }

  async function supprimer(d: Doc) {
    if (!window.confirm(`Supprimer « ${d.titre} » (${d.nom_fichier}) ?${d.versions_precedentes ? " La version précédente redeviendra la version actuelle." : ""} Le fichier est effacé définitivement.`)) return;
    try {
      await api(`coffre/documents/${d.id}`, { methode: "DELETE" });
      charger();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  return (
    <>
      <EnTete
        titre="Les documents"
        accent="CTA."
        sousTitre="Contrats, NDA, factures d'avant Cockpit et documents légaux, stockés de façon privée."
        actions={
          <Bouton onClick={() => entree.current?.click()}>
            <Icone nom="plus" taille={18} /> Ajouter des documents
          </Bouton>
        }
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ChiffreCle icone="document" teinte="bg-[#eef2fb] text-ck-titre" valeur={c.documents.length} libelle={c.documents.length > 1 ? "documents" : "document"} />
        <ChiffreCle icone="batiment" teinte="bg-[#eef2fb] text-[#2f5bd3]" valeur={clientsLies} libelle={clientsLies > 1 ? "clients avec documents" : "client avec documents"} />
        <ChiffreCle icone="horloge" teinte="bg-orange-50 text-ck-orange" valeur={aExpiration} libelle="à renouveler sous 30 jours" />
        <ChiffreCle icone="facture" teinte="bg-emerald-50 text-emerald-700" valeur={c.facturesExistantes.length} libelle="factures enregistrées" />
      </div>
      {erreur && (
        <div className="mb-6">
          <Erreur>{erreur}</Erreur>
        </div>
      )}

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

      <Carte className="!p-6">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setSurvol(true);
          }}
          onDragLeave={() => setSurvol(false)}
          onDrop={deposer}
          className={`grid place-items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${survol ? "border-ck-orange bg-orange-50/50" : "border-ck-bordure"}`}
        >
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2fb] text-ck-titre">
            <Icone nom="document" taille={22} />
          </span>
          <p className="font-bold text-ck-titre">Déposez vos fichiers ici</p>
          <p className="mx-auto mt-1 max-w-xl text-sm text-ck-texte-2">
            Factures, contrats, NDA, statuts, attestations… Le type, le client, le numéro et les montants des factures sont lus automatiquement dans les PDF ; un client absent est créé. Vérifiez puis enregistrez.
          </p>
          <Bouton variante="contour" className="mt-4" onClick={() => entree.current?.click()}>
            Choisir des fichiers
          </Bouton>
          <p className="mt-3 text-xs text-ck-texte-2">PDF, images, Word ou Excel · 25 Mo au maximum par fichier · les scans ne sont pas lus</p>
        </div>

        {lignes.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-ck-titre">
                À vérifier ({lignes.filter((l) => l.etat !== "ok").length})
              </h2>
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
          </div>
        )}
      </Carte>

      <section aria-labelledby="titre-documents" className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="titre-documents" className="ck-titre text-xl">
            Documents enregistrés
          </h2>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <select aria-label="Filtrer par type" value={filtre} onChange={(e) => setFiltre(e.target.value as typeof filtre)} className={`${classeChamp} !w-auto !py-1.5`}>
              <option value="">Tous les types</option>
              <option value="client">Documents clients</option>
              <option value="entreprise">Documents de CTA</option>
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
                .filter((x) => c.documents.some((d) => d.client_id === x.id))
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.nom}
                  </option>
                ))}
            </select>
            <input type="search" aria-label="Rechercher un document" placeholder="Rechercher…" value={recherche} onChange={(e) => setRecherche(e.target.value)} className={`${classeChamp} !w-48 !py-1.5`} />
          </div>
        </div>
        <Info>Les factures importées apparaissent dans la page Factures, avec leur PDF d'origine.</Info>
        <Carte className="mt-4 overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead className="text-ck-texte-2">
              <tr className="border-b border-ck-bordure">
                {["Document", "Type", "Client", "Date", "Validité", "Ajouté", ""].map((t, i) => (
                  <th key={i} scope="col" className="px-4 py-3 text-left font-semibold">
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-ck-texte-2">
                    {c.documents.length ? "Aucun document pour ces filtres." : "Aucun document pour l'instant : déposez vos premiers fichiers ci-dessus."}
                  </td>
                </tr>
              ) : (
                documents.map((d) => {
                  const ex = expiration(d);
                  return (
                    <tr key={d.id} className="border-b border-ck-bordure last:border-0">
                      <th scope="row" className="max-w-[18rem] px-4 py-3 text-left">
                        <span className="block truncate font-bold text-ck-titre">{d.titre}</span>
                        <span className="block truncate text-xs font-normal text-ck-texte-2">
                          {d.nom_fichier} · {taille(d.taille)}
                          {d.versions_precedentes > 0 && ` · ${d.versions_precedentes + 1} versions`}
                        </span>
                      </th>
                      <td className="px-4 py-3">{CATEGORIE_LABEL[d.categorie]}</td>
                      <td className="px-4 py-3">{d.client ?? <span className="text-ck-texte-2">CTA</span>}</td>
                      <td className="whitespace-nowrap px-4 py-3">{dateFr(d.date_document)}</td>
                      <td className="px-4 py-3">{ex && <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ${ex.style}`}>{ex.libelle}</span>}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-ck-texte-2">
                        {dateFr(d.ajoute_le)}
                        {d.ajoute_par ? <span className="block">{d.ajoute_par}</span> : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button type="button" onClick={() => void ouvrirFichier(`coffre/documents/${d.id}/lien`).catch((e: Error) => setErreur(e.message))} className="font-bold text-ck-orange-texte hover:underline">
                          Ouvrir
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setARemplacer(d);
                            entreeVersion.current?.click();
                          }}
                          className="ml-4 font-semibold text-[#2f5bd3] hover:underline"
                        >
                          Nouvelle version
                        </button>
                        <button type="button" onClick={() => setHistorique(d)} className="ml-4 text-ck-texte-2 hover:text-ck-titre hover:underline">
                          Historique
                        </button>
                        {peutSupprimer && (
                          <button type="button" onClick={() => void supprimer(d)} className="ml-4 text-ck-texte-2 hover:text-red-700 hover:underline">
                            Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </Carte>
      </section>
      {historique && <FenetreHistorique doc={historique} onFermer={() => setHistorique(null)} />}
    </>
  );
}
