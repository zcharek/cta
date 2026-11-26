import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { aujourdhui, decalerMois, formatDzd, formatJours, libelleMois } from "../../../../shared/cockpit";
import type { DonneesFacture } from "../../../../shared/facture";
import type { DonneesTimesheet } from "../../../../shared/timesheet";
import { api, type ClientAdmin, type Moi } from "../api";
import { ouvrirFichier } from "../coffre";
import { telechargerFacture } from "../documents";
import { naviguer } from "../routeur";
import { Bouton, Carte, Chargement, ChiffreCle, EnTete, Erreur, Etape, Icone, Verification, classeChamp } from "../ui";

type Statut = "envoyee" | "payee" | "en_retard";
type Facture = {
  id: string;
  annee: number;
  numero_affiche: string;
  mois: string;
  date_emission: string;
  jours: number;
  montant_ht: number;
  montant_ttc: number;
  client: string;
  client_id: string;
  derniere: boolean;
  payee_le: string | null;
  statut: Statut;
  importee: boolean;
};
type Liste = { factures: Facture[]; tva: number; derniereHorsCockpit: string | null; prochain: string; clientsEnAttente: number };
type Apercu = {
  numero: string;
  jours: number;
  joursNonValides: number;
  pu: number;
  ht: number;
  tva: number;
  ttc: number;
  tva_taux: number;
  debut: string;
  fin: string;
  dejaFacture: string[];
  entrepriseIncomplete: boolean;
  client: { id: string; raison_sociale: string; rc: string | null; nif: string | null; adresse: string | null; raison_sociale_timesheet: string; numero_contrat: string | null };
  donnees: DonneesFacture | null;
};

const dzd = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, " ")} DZD`;
const dateFr = (iso: string) => iso.split("-").reverse().join("/");
const tarif = (c: ClientAdmin) => (c.forfait_mensuel_dzd ? `${formatDzd(c.forfait_mensuel_dzd)} / mois` : `${formatDzd(c.tjm_dzd)} / jour`);

function telecharger(octets: Uint8Array, nom: string) {
  const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = nom;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Timesheet PDF du client pour le mois (jours validés uniquement). */
async function telechargerTimesheet(clientId: string, mois: string) {
  const [donnees, pdf] = await Promise.all([api<DonneesTimesheet>(`timesheet?client=${clientId}&mois=${mois}`), import("../../../../shared/timesheet")]);
  telecharger(await pdf.genererTimesheet(donnees), pdf.nomFichier(donnees));
}


const STATUT: Record<Statut, { libelle: string; style: string }> = {
  envoyee: { libelle: "Envoyée", style: "bg-[#eef2fb] text-[#1f3f9c]" },
  payee: { libelle: "Payée", style: "bg-emerald-50 text-emerald-700" },
  en_retard: { libelle: "En retard", style: "bg-red-50 text-red-700" },
};

// ——— Aperçu HTML de la facture (miniature fidèle au PDF) ———

function ApercuFacture({ d }: { d: DonneesFacture }) {
  const e = d.entreprise;
  const montant = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-5 text-[10px] leading-snug text-[#111] shadow-[0_4px_24px_rgba(7,21,56,0.12)]" aria-label="Aperçu de la facture">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center text-6xl font-black tracking-widest text-[#071538]/[0.05] [transform:rotate(-24deg)]">
        APERÇU
      </span>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/images/logo-cta-icone.png" alt="" className="h-7 w-7" />
          <span className="text-[11px] font-extrabold">{e.raison_sociale}</span>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-extrabold">FACTURE N° {d.numero.replace(" (aperçu)", "")}</p>
          <p className="text-[#555]">
            {e.ville}, le {dateFr(d.date_emission)}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="text-[#444]">
          {e.siege && <p>{e.siege}</p>}
          {e.rc && <p>RC {e.rc}</p>}
          {e.nif && <p>NIF {e.nif}</p>}
        </div>
        <div className="rounded-md bg-[#f4f5f8] p-2">
          <p className="text-[8px] font-bold uppercase tracking-wide text-[#777]">Facturé à</p>
          <p className="font-bold">{d.client.raison_sociale}</p>
          {d.client.adresse && <p className="text-[#444]">{d.client.adresse}</p>}
          {(d.client.rc || d.client.nif) && <p className="text-[#444]">{[d.client.rc && `RC ${d.client.rc}`, d.client.nif && `NIF ${d.client.nif}`].filter(Boolean).join(" · ")}</p>}
        </div>
      </div>
      <table className="mt-3 w-full border-collapse">
        <thead>
          <tr className="border-b border-[#ccc] text-left font-bold">
            <th className="py-1">Désignation</th>
            <th className="py-1 text-right">Qté</th>
            <th className="py-1 text-right">P.U. HT</th>
            <th className="py-1 text-right">Montant HT</th>
          </tr>
        </thead>
        <tbody>
          <tr className="align-top">
            <td className="py-1.5 pr-2">
              {d.ligne.designation}
              <span className="block text-[#666]">
                {dateFr(d.ligne.debut)} au {dateFr(d.ligne.fin)}
              </span>
            </td>
            <td className="py-1.5 text-right">{String(d.ligne.quantite).replace(".", ",")} j</td>
            <td className="py-1.5 text-right">{montant(d.ligne.pu)}</td>
            <td className="py-1.5 text-right">{montant(d.ligne.montant)}</td>
          </tr>
        </tbody>
      </table>
      <div className="ml-auto mt-2 w-1/2">
        <p className="flex justify-between py-0.5">
          <span>Total HT</span>
          <span>{montant(d.montant_ht)}</span>
        </p>
        <p className="flex justify-between py-0.5">
          <span>TVA {d.tva_taux} %</span>
          <span>{montant(d.montant_tva)}</span>
        </p>
        <p className="mt-1 flex justify-between rounded bg-[#071538] px-2 py-1 font-bold text-white">
          <span>Total TTC</span>
          <span>{montant(d.montant_ttc)} DZD</span>
        </p>
      </div>
      {(e.rib || e.banque) && <p className="mt-3 border-t border-[#ddd] pt-2 text-[8.5px] text-[#666]">{[e.rib && `RIB ${e.rib}`, e.banque, e.nis && `NIS ${e.nis}`, e.ai && `AI ${e.ai}`, e.email].filter(Boolean).join(" · ")}</p>}
    </div>
  );
}

// ——— Émission ———

function Emettre({ clients, onEmise }: { clients: ClientAdmin[]; onEmise: () => void }) {
  const params = new URLSearchParams(window.location.search);
  const [clientId, setClientId] = useState(params.get("client") ?? clients[0]?.id ?? "");
  const [mois, setMois] = useState(params.get("mois") ?? decalerMois(aujourdhui().slice(0, 7), -1));
  const [date, setDate] = useState(aujourdhui());
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [message, setMessage] = useState("");

  const recharger = useCallback(() => {
    if (!clientId || !mois || !date) return;
    setErreur("");
    api<Apercu>(`factures/apercu?client=${clientId}&mois=${mois}&date=${date}`)
      .then(setApercu)
      .catch((e: Error) => setErreur(e.message));
  }, [clientId, mois, date]);
  useEffect(() => {
    setApercu(null);
    recharger();
  }, [recharger]);

  async function emettre(e: FormEvent) {
    e.preventDefault();
    if (!apercu) return;
    if (apercu.dejaFacture.length && !window.confirm(`Ce mois est déjà facturé (${apercu.dejaFacture.join(", ")}). Émettre quand même une nouvelle facture ?`)) return;
    setOccupe(true);
    setErreur("");
    setMessage("");
    try {
      const r = await api<{ donnees: DonneesFacture }>("factures", { corps: { clientId, mois, dateEmission: date, confirmerDoublon: apercu.dejaFacture.length > 0 } });
      await telechargerFacture(r.donnees);
      setMessage(`Facture ${r.donnees.numero} émise et téléchargée.`);
      onEmise();
      recharger();
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const ficheComplete = !!apercu && !!apercu.client.adresse && !!apercu.client.rc && !!apercu.client.nif && !!apercu.client.numero_contrat;
  const manque = apercu ? [!apercu.client.adresse && "adresse", !apercu.client.rc && "RC", !apercu.client.nif && "NIF", !apercu.client.numero_contrat && "n° de contrat"].filter(Boolean) : [];
  const ligne = (libelle: string, valeur: string) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-ck-texte-2">{libelle}</dt>
      <dd className="text-right font-semibold tabular-nums text-ck-titre">{valeur}</dd>
    </div>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <Carte aria-labelledby="titre-emettre" className="sm:!p-7">
        <div className="mb-6 flex items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef2fb] text-ck-titre">
            <Icone nom="facture" taille={20} />
          </span>
          <div>
            <h2 id="titre-emettre" className="ck-titre text-lg leading-tight">
              Émettre une facture
            </h2>
            <p className="mt-0.5 text-sm text-ck-texte-2">Calculée sur les jours validés du mois choisi.</p>
          </div>
        </div>

        <form onSubmit={emettre} className="grid gap-5">
          <Etape numero={1} titre="Client et période">
            <div className="grid gap-4">
              <div>
                <label htmlFor="facture-client" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                  Client
                </label>
                <select id="facture-client" value={clientId} onChange={(e) => setClientId(e.target.value)} className={classeChamp} required>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}, {tarif(c)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="facture-mois" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                    Mois facturé
                  </label>
                  <input id="facture-mois" type="month" value={mois} onChange={(e) => setMois(e.target.value)} required className={classeChamp} />
                </div>
                <div>
                  <label htmlFor="facture-date" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                    Date d'émission
                  </label>
                  <input id="facture-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={classeChamp} />
                </div>
              </div>
            </div>
          </Etape>

          <Etape numero={2} titre="Vérifications">
            {!apercu ? (
              erreur ? null : <Chargement />
            ) : (
              <ul className="divide-y divide-[color:var(--ck-bordure)]">
                <Verification
                  ok={ficheComplete}
                  titre={ficheComplete ? "Fiche client complète" : "Fiche client à compléter"}
                  detail={ficheComplete ? `${apercu.client.raison_sociale}, RC, NIF et contrat ${apercu.client.numero_contrat} renseignés.` : `Il manque : ${manque.join(", ")}.`}
                  action={
                    <button type="button" onClick={() => naviguer("/reglages/clients")} className="shrink-0 text-xs font-bold text-[#2f5bd3] hover:underline">
                      Voir la fiche
                    </button>
                  }
                />
                <Verification ok={apercu.pu > 0} titre={apercu.pu > 0 ? "Prix unitaire défini" : "Prix unitaire manquant"} detail={`${dzd(apercu.pu)} par jour, TVA ${apercu.tva_taux} %.`} />
                <Verification
                  ok={apercu.jours > 0}
                  titre={apercu.jours > 0 ? `${formatJours(apercu.jours)} validé${apercu.jours > 1 ? "s" : ""} en ${libelleMois(mois)}` : `Aucun jour validé en ${libelleMois(mois)}`}
                  detail={
                    apercu.joursNonValides > 0
                      ? `${formatJours(apercu.joursNonValides)} saisi${apercu.joursNonValides > 1 ? "s" : ""} mais pas encore validé${apercu.joursNonValides > 1 ? "s" : ""}.`
                      : apercu.jours > 0
                        ? "Tous les jours saisis sont validés."
                        : "Validez les semaines du mois pour pouvoir émettre la facture."
                  }
                  action={
                    apercu.jours <= 0 || apercu.joursNonValides > 0 ? (
                      <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={() => naviguer("/validation")}>
                        Valider les temps
                      </Bouton>
                    ) : undefined
                  }
                />
                {apercu.dejaFacture.length > 0 && <Verification ok={false} titre="Mois déjà facturé" detail={`Facture ${apercu.dejaFacture.join(", ")} : une nouvelle facture demandera confirmation.`} />}
                {apercu.entrepriseIncomplete && <Verification ok={false} titre="Identité de l'entreprise non configurée" detail="Prévenez l'administrateur technique avant d'émettre." />}
              </ul>
            )}
          </Etape>

          <Etape numero={3} titre="Montants">
            {apercu && (
              <dl className="rounded-2xl bg-[var(--ck-champ)] px-5 py-3">
                {ligne("Jours validés", `${formatJours(apercu.jours)} × ${dzd(apercu.pu)}`)}
                {ligne("Total HT", dzd(apercu.ht))}
                {ligne(`TVA ${apercu.tva_taux} %`, dzd(apercu.tva))}
                <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-ck-bordure pt-3">
                  <dt className="font-bold text-ck-titre">Total TTC</dt>
                  <dd className="ck-titre text-2xl tabular-nums">{dzd(apercu.ttc)}</dd>
                </div>
              </dl>
            )}
          </Etape>

          {erreur && <Erreur>{erreur}</Erreur>}
          {message && (
            <p role="status" className="text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Bouton type="submit" variante="orange" disabled={occupe || !apercu || apercu.jours <= 0}>
              <Icone nom="envoyer" taille={16} /> {occupe ? "Émission…" : apercu ? `Émettre la facture ${apercu.numero}` : "Émettre la facture"}
            </Bouton>
            <Bouton variante="contour" disabled={!clientId} onClick={() => void telechargerTimesheet(clientId, mois).catch((e: Error) => setErreur(e.message))}>
              <Icone nom="calendrier" taille={16} /> Timesheet PDF
            </Bouton>
          </div>
          <p className="text-xs text-ck-texte-2">Le bouton s'active dès qu'au moins un jour est validé. L'aperçu et le timesheet ne consomment aucun numéro.</p>
        </form>
      </Carte>

      <Carte aria-labelledby="titre-apercu" className="bg-[#f7f8fb] sm:!p-7 lg:sticky lg:top-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="titre-apercu" className="ck-titre text-lg">
              Aperçu
            </h2>
            <p className="text-sm text-ck-texte-2">La facture telle qu'elle sera envoyée.</p>
          </div>
          {apercu?.donnees && (
            <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={() => void telechargerFacture(apercu.donnees!, true).catch((e: Error) => setErreur(e.message))}>
              Ouvrir en PDF
            </Bouton>
          )}
        </div>
        {apercu?.donnees ? <ApercuFacture d={apercu.donnees} /> : <Chargement />}
      </Carte>
    </div>
  );
}

// ——— Factures émises ———

function ListeFactures({ liste, clients, onChange, onErreur }: { liste: Liste; clients: ClientAdmin[]; onChange: () => void; onErreur: (m: string) => void }) {
  const annees = useMemo(() => [...new Set([Number(aujourdhui().slice(0, 4)), ...liste.factures.map((f) => f.annee)])].sort((a, b) => b - a), [liste]);
  const [annee, setAnnee] = useState(annees[0]!);
  const [client, setClient] = useState("");
  const factures = liste.factures.filter((f) => f.annee === annee && (!client || f.client_id === client));

  async function action(faire: () => Promise<unknown>) {
    try {
      await faire();
      onChange();
    } catch (e) {
      onErreur((e as Error).message);
    }
  }

  return (
    <section id="factures-emises" aria-labelledby="titre-emises" className="mt-10 scroll-mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="titre-emises" className="ck-titre text-xl">
          Factures émises
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label htmlFor="filtre-annee" className="text-ck-texte-2">
            Année
          </label>
          <select id="filtre-annee" value={annee} onChange={(e) => setAnnee(Number(e.target.value))} className={`${classeChamp} !w-auto !py-1.5`}>
            {annees.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <label htmlFor="filtre-client" className="ml-2 text-ck-texte-2">
            Client
          </label>
          <select id="filtre-client" value={client} onChange={(e) => setClient(e.target.value)} className={`${classeChamp} !w-auto !py-1.5`}>
            <option value="">Tous</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Carte className="overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead className="text-ck-texte-2">
            <tr className="border-b border-ck-bordure">
              {["N°", "Client", "Période", "Émise le", "Total TTC", "Statut", ""].map((t, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-semibold ${i === 4 ? "text-right" : "text-left"}`}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {factures.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2fb] text-ck-titre">
                    <Icone nom="facture" taille={22} />
                  </span>
                  <p className="font-bold text-ck-titre">{liste.factures.length ? "Aucune facture pour ces filtres" : "Aucune facture émise depuis Cockpit"}</p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-ck-texte-2">
                    {liste.derniereHorsCockpit ? `La dernière facture envoyée avant Cockpit porte le numéro ${liste.derniereHorsCockpit}. ` : ""}Chaque facture émise apparaîtra ici avec son statut : envoyée, payée ou en retard.
                  </p>
                </td>
              </tr>
            ) : (
              factures.map((f) => (
                <tr key={f.id} className="border-b border-ck-bordure last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-bold tabular-nums text-ck-titre">
                    {f.numero_affiche}
                    {f.importee && (
                      <span className="ml-2 rounded bg-ck-surface-2 px-1.5 py-0.5 text-[11px] font-semibold text-ck-texte-2" title="Facture émise avant Cockpit : PDF d'origine importé">
                        Importée
                      </span>
                    )}
                  </th>
                  <td className="px-4 py-3">{f.client}</td>
                  <td className="px-4 py-3 capitalize">{libelleMois(f.mois)}</td>
                  <td className="px-4 py-3">{dateFr(f.date_emission)}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{dzd(f.montant_ttc)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUT[f.statut].style}`} title={f.payee_le ? `Payée le ${dateFr(f.payee_le)}` : undefined}>
                      {STATUT[f.statut].libelle}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button type="button" onClick={() => void action(async () => (f.importee ? ouvrirFichier(`factures/${f.id}`) : telechargerFacture((await api<{ donnees: DonneesFacture }>(`factures/${f.id}`)).donnees)))} className="font-bold text-ck-orange-texte hover:underline">
                      PDF
                    </button>
                    <button type="button" onClick={() => void action(() => api(`factures/${f.id}`, { methode: "PATCH", corps: { payee: !f.payee_le } }))} className="ml-4 font-semibold text-[#2f5bd3] hover:underline">
                      {f.payee_le ? "Annuler le paiement" : "Marquer payée"}
                    </button>
                    {(f.derniere || f.importee) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(f.importee ? `Retirer la facture importée ${f.numero_affiche} et son PDF ?` : `Supprimer la facture ${f.numero_affiche} ? Son numéro sera réutilisé pour la prochaine facture.`)) void action(() => api(`factures/${f.id}`, { methode: "DELETE" }));
                        }}
                        className="ml-4 text-ck-texte-2 hover:text-red-700 hover:underline"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Carte>
    </section>
  );
}

// ——— Paramètres (lecture seule) ———

const CHAMPS_ENTREPRISE: [string, string][] = [
  ["raison_sociale", "Raison sociale"],
  ["siege", "Siège social"],
  ["rc", "RC"],
  ["nif", "NIF"],
  ["nis", "NIS"],
  ["ai", "AI"],
  ["rib", "RIB"],
  ["banque", "Domiciliation"],
  ["email", "E-mail"],
];

function Ligne({ libelle, valeur }: { libelle: string; valeur: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ck-bordure py-2.5 text-sm last:border-0">
      <dt className="text-ck-texte-2">{libelle}</dt>
      <dd className={`text-right font-semibold ${valeur ? "text-ck-titre" : "italic text-ck-texte-2"}`}>{valeur || "Non renseigné"}</dd>
    </div>
  );
}

function Parametres({ liste }: { liste: Liste }) {
  const [entreprise, setEntreprise] = useState<Record<string, string> | null>(null);
  useEffect(() => {
    api<{ entreprise: Record<string, string> | null }>("parametres/entreprise")
      .then((d) => setEntreprise(d.entreprise ?? {}))
      .catch(() => setEntreprise({}));
  }, []);
  return (
    <section aria-labelledby="titre-parametres" className="mt-10">
      <h2 id="titre-parametres" className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="ck-titre flex items-center gap-2 text-lg">
          <Icone nom="cadenas" taille={18} /> Paramètres de facturation
        </span>
        <span className="text-xs text-ck-texte-2">Verrouillés, imprimés sur chaque facture</span>
      </h2>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Carte aria-labelledby="titre-numerotation">
          <h3 id="titre-numerotation" className="mb-2 font-bold text-ck-titre">
            Numérotation et TVA
          </h3>
          <dl>
            <Ligne libelle="Prochaine facture" valeur={liste.prochain} />
            <Ligne libelle="Dernière facture avant Cockpit" valeur={liste.derniereHorsCockpit} />
            <Ligne libelle="TVA" valeur={`${String(liste.tva).replace(".", ",")} %`} />
            <Ligne libelle="Remise à zéro" valeur="001 au 1er janvier" />
          </dl>
        </Carte>
        <Carte aria-labelledby="titre-entreprise">
          <h3 id="titre-entreprise" className="mb-2 font-bold text-ck-titre">
            Identité de l'entreprise
          </h3>
          {entreprise ? (
            <dl>
              {CHAMPS_ENTREPRISE.map(([cle, libelle]) => (
                <Ligne key={cle} libelle={libelle} valeur={entreprise[cle]} />
              ))}
            </dl>
          ) : (
            <Chargement />
          )}
        </Carte>
      </div>
    </section>
  );
}

export default function Factures({ moi }: { moi: Moi }) {
  const [liste, setListe] = useState<Liste | null>(null);
  const [clients, setClients] = useState<ClientAdmin[] | null>(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api<Liste>("factures")
      .then(setListe)
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(() => {
    charger();
    api<{ clients: ClientAdmin[] }>("clients")
      .then((d) => setClients(d.clients))
      .catch((e: Error) => setErreur(e.message));
  }, [charger]);

  if (!liste || !clients) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const actifs = clients.filter((c) => c.actif);
  const annee = Number(aujourdhui().slice(0, 4));
  const deLAnnee = liste.factures.filter((f) => f.annee === annee);
  const ttc = deLAnnee.reduce((s, f) => s + f.montant_ttc, 0);

  return (
    <>
      <EnTete
        titre="Les"
        accent="factures."
        sousTitre="Émettez une facture en trois étapes. Seuls les jours validés sont facturés."
        actions={
          <>
            {moi.onglets.includes("documents") && (
              <Bouton variante="contour" onClick={() => naviguer("/documents")}>
                <Icone nom="dossier" taille={18} /> Importer d'anciennes factures
              </Bouton>
            )}
            <Bouton variante="contour" onClick={() => document.getElementById("factures-emises")?.scrollIntoView({ behavior: "smooth" })}>
              <Icone nom="menu" taille={18} /> Factures émises
            </Bouton>
          </>
        }
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ChiffreCle icone="document" teinte="bg-[#eef2fb] text-ck-titre" valeur={liste.prochain} libelle="prochain numéro" />
        <ChiffreCle icone="horloge" teinte="bg-orange-50 text-ck-orange" valeur={liste.clientsEnAttente} libelle={`client${liste.clientsEnAttente > 1 ? "s" : ""} en attente de validation`} />
        <ChiffreCle icone="facture" teinte="bg-[#eef2fb] text-[#2f5bd3]" valeur={deLAnnee.length} libelle={`facture${deLAnnee.length > 1 ? "s" : ""} émise${deLAnnee.length > 1 ? "s" : ""} en ${annee}`} />
        <ChiffreCle icone="banque" teinte="bg-emerald-50 text-emerald-700" valeur={formatDzd(ttc)} libelle={`facturé TTC en ${annee}`} />
      </div>
      {erreur && (
        <div className="mb-6">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
      {actifs.length ? <Emettre clients={actifs} onEmise={charger} /> : <Carte className="text-sm text-ck-texte-2">Créez d'abord un client.</Carte>}
      <ListeFactures liste={liste} clients={clients.filter((c) => c.actif || liste.factures.some((f) => f.client_id === c.id))} onChange={charger} onErreur={setErreur} />
      <Parametres liste={liste} />
    </>
  );
}
