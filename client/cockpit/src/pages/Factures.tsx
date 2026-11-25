import { useCallback, useEffect, useState, type FormEvent } from "react";
import { aujourdhui, decalerMois, formatJours, libelleMois } from "../../../../shared/cockpit";
import type { DonneesFacture } from "../../../../shared/facture";
import type { DonneesTimesheet } from "../../../../shared/timesheet";
import { api, type ClientAdmin } from "../api";
import { Bouton, Carte, Champ, Chargement, EnTete, EnteteSection, Erreur, Info, classeChamp } from "../ui";

type Facture = {
  id: string;
  numero_affiche: string;
  mois: string;
  date_emission: string;
  jours: number;
  montant_ht: number;
  montant_ttc: number;
  client: string;
  derniere: boolean;
  cree_par: string | null;
};
type Liste = { factures: Facture[]; tva: number; derniereHorsCockpit: string | null; prochain: string };
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
  client: { raison_sociale: string; rc: string | null; nif: string | null; adresse: string | null; raison_sociale_timesheet: string; numero_contrat: string | null };
  donnees: DonneesFacture | null;
};

const dzd = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[\u202f\u00a0]/g, " ")} DZD`;
const dateFr = (iso: string) => iso.split("-").reverse().join("/");

/** Timesheet PDF du client pour le mois (jours validés uniquement). */
async function telechargerTimesheet(clientId: string, mois: string) {
  const [donnees, pdf] = await Promise.all([api<DonneesTimesheet>(`timesheet?client=${clientId}&mois=${mois}`), import("../../../../shared/timesheet")]);
  const octets = await pdf.genererTimesheet(donnees);
  const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = pdf.nomFichier(donnees);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Génère le PDF (logo CTA en haut à gauche) et le télécharge. */
async function telechargerFacture(donnees: DonneesFacture) {
  const [pdf, logo] = await Promise.all([
    import("../../../../shared/facture"),
    fetch("/images/logo-cta-facture.png")
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null),
  ]);
  const octets = await pdf.genererFacture(donnees, logo ? new Uint8Array(logo) : undefined);
  const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = pdf.nomFichierFacture(donnees);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Emettre({ clients, onEmise }: { clients: ClientAdmin[]; onEmise: () => void }) {
  const params = new URLSearchParams(window.location.search);
  const [clientId, setClientId] = useState(params.get("client") ?? clients[0]?.id ?? "");
  const [mois, setMois] = useState(params.get("mois") ?? decalerMois(aujourdhui().slice(0, 7), -1));
  const [date, setDate] = useState(aujourdhui());
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!clientId || !mois) return;
    setApercu(null);
    setErreur("");
    api<Apercu>(`factures/apercu?client=${clientId}&mois=${mois}&date=${date}`)
      .then(setApercu)
      .catch((e: Error) => setErreur(e.message));
  }, [clientId, mois, date]);

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
      setApercu(null);
      api<Apercu>(`factures/apercu?client=${clientId}&mois=${mois}&date=${date}`).then(setApercu).catch(() => {});
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const ligne = (libelle: string, valeur: string, fort = false) => (
    <div className={`flex justify-between gap-4 py-1.5 ${fort ? "border-t border-ck-bordure pt-2.5 font-bold text-ck-titre" : ""}`}>
      <dt className={fort ? "" : "text-ck-texte-2"}>{libelle}</dt>
      <dd className="text-right tabular-nums">{valeur}</dd>
    </div>
  );

  return (
    <Carte aria-labelledby="titre-emettre">
      <EnteteSection id="titre-emettre" icone="facture" titre="Émettre une facture" sousTitre="Calculée sur les jours validés du mois." />
      <form onSubmit={emettre} className="grid gap-4">
        <div>
          <label htmlFor="facture-client" className="mb-1.5 block text-sm font-semibold text-ck-titre">
            Client
          </label>
          <select id="facture-client" value={clientId} onChange={(e) => setClientId(e.target.value)} className={classeChamp} required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Champ libelle="Mois facturé" name="mois" type="month" value={mois} onChange={(e) => setMois(e.target.value)} required />
          <Champ libelle="Date d'émission" name="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        {erreur && <Erreur>{erreur}</Erreur>}
        {!apercu && !erreur && <Chargement />}
        {apercu && (
          <>
            <dl className="rounded-xl bg-ck-surface-2 px-4 py-3 text-sm">
              {ligne("Facturé à", apercu.client.raison_sociale)}
              {ligne("Siège social", apercu.client.adresse ?? "Non renseigné")}
              {ligne("RC", apercu.client.rc ?? "Non renseigné")}
              {ligne("NIF", apercu.client.nif ?? "Non renseigné")}
              {ligne("Timesheet au nom de", apercu.client.raison_sociale_timesheet)}
              {ligne("Contrat N°", apercu.client.numero_contrat ?? "Non renseigné")}
              {ligne("Période", `${dateFr(apercu.debut)} au ${dateFr(apercu.fin)}`)}
              {ligne("Jours validés", formatJours(apercu.jours))}
              {ligne("Prix unitaire", dzd(apercu.pu))}
              {ligne("Total HT", dzd(apercu.ht))}
              {ligne(`TVA ${apercu.tva_taux} %`, dzd(apercu.tva))}
              {ligne("Total TTC", dzd(apercu.ttc), true)}
            </dl>
            {(!apercu.client.rc || !apercu.client.nif || !apercu.client.adresse) && (
              <Info>La fiche du client n'a pas d'adresse, de RC ou de NIF : complétez-la dans Clients pour qu'ils figurent sur la facture.</Info>
            )}
            {apercu.entrepriseIncomplete && <Info>L'identité de l'entreprise (NIF, RIB…) n'est pas configurée : prévenez l'administrateur technique avant d'émettre.</Info>}
            {apercu.joursNonValides > 0 && <Info>{formatJours(apercu.joursNonValides)} saisis mais pas encore validés ne sont pas facturés.</Info>}
            {apercu.dejaFacture.length > 0 && <Info>Ce mois est déjà facturé à ce client : facture {apercu.dejaFacture.join(", ")}.</Info>}
            {message && (
              <p role="status" className="text-sm font-semibold text-emerald-700">
                {message}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Bouton type="submit" disabled={occupe || apercu.jours <= 0}>
                {occupe ? "Émission…" : apercu.jours > 0 ? `Émettre la facture n° ${apercu.numero}` : "Aucun jour validé à facturer"}
              </Bouton>
              {apercu.donnees && (
                <Bouton variante="contour" onClick={() => void telechargerFacture(apercu.donnees!).catch((e: Error) => setErreur(e.message))}>
                  Aperçu de la facture (PDF)
                </Bouton>
              )}
              <Bouton variante="contour" onClick={() => void telechargerTimesheet(clientId, mois).catch((e: Error) => setErreur(e.message))}>
                Timesheet PDF
              </Bouton>
            </div>
            <p className="text-xs text-ck-texte-2">L'aperçu et le timesheet ne consomment aucun numéro de facture.</p>
          </>
        )}
      </form>
    </Carte>
  );
}

const CHAMPS_ENTREPRISE: [string, string][] = [
  ["raison_sociale", "Raison sociale"],
  ["siege", "Siège social"],
  ["rc", "RC"],
  ["nif", "NIF"],
  ["nis", "NIS"],
  ["ai", "AI"],
  ["rib", "RIB"],
  ["banque", "Domiciliation bancaire"],
  ["email", "E-mail"],
];

function Ligne({ libelle, valeur }: { libelle: string; valeur: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ck-bordure py-2 text-sm last:border-0">
      <dt className="text-ck-texte-2">{libelle}</dt>
      <dd className={`text-right font-semibold ${valeur ? "text-ck-titre" : "italic text-ck-texte-2"}`}>{valeur || "Non renseigné"}</dd>
    </div>
  );
}

/** Identité légale imprimée sur les factures : figée (variable ENTREPRISE_CTA), affichée en lecture seule. */
function Entreprise() {
  const [entreprise, setEntreprise] = useState<Record<string, string> | null>(null);
  const [erreur, setErreur] = useState("");
  useEffect(() => {
    api<{ entreprise: Record<string, string> | null }>("parametres/entreprise")
      .then((d) => setEntreprise(d.entreprise ?? {}))
      .catch((e: Error) => setErreur(e.message));
  }, []);
  return (
    <Carte aria-labelledby="titre-entreprise">
      <EnteteSection id="titre-entreprise" icone="cadenas" titre="Identité de l'entreprise" sousTitre="Imprimée en tête des factures. Non modifiable." />
      {erreur && <Erreur>{erreur}</Erreur>}
      {entreprise && (
        <dl>
          {CHAMPS_ENTREPRISE.map(([cle, libelle]) => (
            <Ligne key={cle} libelle={libelle} valeur={entreprise[cle]} />
          ))}
        </dl>
      )}
    </Carte>
  );
}

function Reglages({ liste }: { liste: Liste }) {
  return (
    <Carte aria-labelledby="titre-numerotation">
      <EnteteSection id="titre-numerotation" icone="cadenas" titre="Numérotation" sousTitre="Suite de vos factures et taux de TVA. Non modifiable." />
      <dl>
        <Ligne libelle="Prochaine facture" valeur={liste.prochain} />
        <Ligne libelle="Dernière facture envoyée avant Cockpit" valeur={liste.derniereHorsCockpit} />
        <Ligne libelle="TVA" valeur={`${String(liste.tva).replace(".", ",")} %`} />
      </dl>
      <p className="mt-3 text-xs text-ck-texte-2">La numérotation repart à 001 chaque année.</p>
    </Carte>
  );
}

export default function Factures() {
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
      .then((d) => setClients(d.clients.filter((c) => c.actif)))
      .catch((e: Error) => setErreur(e.message));
  }, [charger]);

  async function retelecharger(f: Facture) {
    try {
      const r = await api<{ donnees: DonneesFacture }>(`factures/${f.id}`);
      await telechargerFacture(r.donnees);
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  async function supprimer(f: Facture) {
    if (!window.confirm(`Supprimer la facture ${f.numero_affiche} ? Son numéro sera réutilisé pour la prochaine facture.`)) return;
    try {
      await api(`factures/${f.id}`, { methode: "DELETE" });
      charger();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  if (!liste || !clients) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  return (
    <>
      <EnTete titre="Les" accent="factures." sousTitre={`Prochaine facture : ${liste.prochain}. Seuls les jours validés sont facturés.`} />
      {erreur && (
        <div className="mb-6">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">{clients.length ? <Emettre clients={clients} onEmise={charger} /> : <Info>Créez d'abord un client.</Info>}</div>
        <div className="grid gap-6 lg:col-span-2">
          <Reglages liste={liste} />
          <Entreprise />
        </div>
      </div>

      <section aria-labelledby="titre-emises" className="mt-10">
        <h2 id="titre-emises" className="ck-titre mb-4 text-xl">
          Factures émises
        </h2>
        {liste.factures.length === 0 ? (
          <Carte className="text-sm text-ck-texte-2">Aucune facture émise depuis Cockpit pour l'instant.</Carte>
        ) : (
          <Carte className="!p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-ck-texte-2">
                <tr className="border-b border-ck-bordure">
                  {["N°", "Client", "Période", "Émise le", "Jours", "Total TTC", ""].map((t, i) => (
                    <th key={i} scope="col" className={`px-4 py-3 font-semibold ${i >= 4 ? "text-right" : "text-left"}`}>
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {liste.factures.map((f) => (
                  <tr key={f.id} className="border-b border-ck-bordure last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-bold text-ck-titre tabular-nums">
                      {f.numero_affiche}
                    </th>
                    <td className="px-4 py-3">{f.client}</td>
                    <td className="px-4 py-3 capitalize">{libelleMois(f.mois)}</td>
                    <td className="px-4 py-3">{dateFr(f.date_emission)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatJours(f.jours)}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{dzd(f.montant_ttc)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button type="button" onClick={() => void retelecharger(f)} className="font-bold text-ck-orange-texte hover:underline">
                        PDF
                      </button>
                      {f.derniere && (
                        <button type="button" onClick={() => void supprimer(f)} className="ml-4 text-ck-texte-2 hover:text-red-700 hover:underline">
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Carte>
        )}
      </section>
    </>
  );
}
