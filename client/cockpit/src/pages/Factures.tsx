import { useCallback, useEffect, useState, type FormEvent } from "react";
import { aujourdhui, decalerMois, formatJours, libelleMois } from "../../../../shared/cockpit";
import type { DonneesFacture } from "../../../../shared/facture";
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
  client: { raison_sociale: string; rc: string | null; nif: string | null; adresse: string | null };
};

const dzd = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[\u202f\u00a0]/g, " ")} DZD`;
const dateFr = (iso: string) => iso.split("-").reverse().join("/");

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
            {apercu.entrepriseIncomplete && <Info>L'identité de l'entreprise (NIF, RIB…) n'est pas encore renseignée : complétez la carte « Identité de l'entreprise » avant d'émettre.</Info>}
            {apercu.joursNonValides > 0 && <Info>{formatJours(apercu.joursNonValides)} saisis mais pas encore validés ne sont pas facturés.</Info>}
            {apercu.dejaFacture.length > 0 && <Info>Ce mois est déjà facturé à ce client : facture {apercu.dejaFacture.join(", ")}.</Info>}
            {message && (
              <p role="status" className="text-sm font-semibold text-emerald-700">
                {message}
              </p>
            )}
            <Bouton type="submit" disabled={occupe || apercu.jours <= 0} className="justify-self-start">
              {occupe ? "Émission…" : apercu.jours > 0 ? `Émettre la facture n° ${apercu.numero}` : "Aucun jour validé à facturer"}
            </Bouton>
          </>
        )}
      </form>
    </Carte>
  );
}

const CHAMPS_ENTREPRISE: [string, string, string?][] = [
  ["raison_sociale", "Raison sociale", "SARL CENTRAL TEST APPLICATION"],
  ["siege", "Siège social"],
  ["rc", "RC"],
  ["nif", "NIF"],
  ["nis", "NIS"],
  ["ai", "AI"],
  ["rib", "RIB"],
  ["banque", "Domiciliation bancaire"],
  ["email", "E-mail"],
  ["ville", "Ville d'émission", "Alger"],
];

/** Identité légale imprimée sur les factures : stockée en base uniquement (le code est public). */
function Entreprise() {
  const [valeurs, setValeurs] = useState<Record<string, string> | null>(null);
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);
  useEffect(() => {
    api<{ entreprise: Record<string, string> | null }>("parametres/entreprise")
      .then((d) => {
        setValeurs(d.entreprise ?? {});
        if (!d.entreprise?.nif || !d.entreprise?.rib) setOuvert(true);
      })
      .catch((e: Error) => setErreur(e.message));
  }, []);
  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setErreur("");
    setOk(false);
    try {
      await api("parametres/entreprise", { methode: "PUT", corps: f });
      setValeurs(f);
      setOk(true);
    } catch (err) {
      setErreur((err as Error).message);
    }
  }
  const incomplet = valeurs && (!valeurs.nif || !valeurs.rib);
  return (
    <Carte aria-labelledby="titre-entreprise">
      <EnteteSection
        id="titre-entreprise"
        icone="identite"
        titre="Identité de l'entreprise"
        sousTitre={incomplet ? "À compléter : imprimée en tête des factures." : "Imprimée en tête des factures."}
        action={
          <Bouton variante="discret" className="!px-3 !py-1.5" onClick={() => setOuvert((o) => !o)} aria-expanded={ouvert}>
            {ouvert ? "Masquer" : "Modifier"}
          </Bouton>
        }
      />
      {erreur && <Erreur>{erreur}</Erreur>}
      {ouvert && valeurs && (
        <form onSubmit={envoyer} className="grid gap-3">
          {CHAMPS_ENTREPRISE.map(([cle, libelle, defaut]) => (
            <Champ key={cle} libelle={libelle} name={cle} defaultValue={valeurs[cle] || defaut || ""} />
          ))}
          {ok && (
            <p role="status" className="text-sm font-semibold text-emerald-700">
              Enregistré.
            </p>
          )}
          <Bouton type="submit" variante="contour" className="justify-self-start">
            Enregistrer
          </Bouton>
        </form>
      )}
    </Carte>
  );
}

function Reglages({ liste, onEnregistre }: { liste: Liste; onEnregistre: () => void }) {
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);
  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setErreur("");
    setOk(false);
    try {
      await api("parametres/facturation", { methode: "PUT", corps: { derniere: f.derniere, tva: f.tva } });
      setOk(true);
      onEnregistre();
    } catch (err) {
      setErreur((err as Error).message);
    }
  }
  return (
    <Carte aria-labelledby="titre-numerotation">
      <EnteteSection id="titre-numerotation" icone="document" titre="Numérotation" sousTitre="Suite de vos factures et taux de TVA." />
      <p className="mb-4 text-sm text-ck-texte-2">
        Prochaine facture : <strong className="text-ck-titre">{liste.prochain}</strong>. La numérotation repart à 001 chaque année.
      </p>
      <form onSubmit={envoyer} className="grid gap-4">
        <Champ libelle="Dernière facture envoyée avant Cockpit" name="derniere" defaultValue={liste.derniereHorsCockpit ?? ""} placeholder="012-26" aide="Cockpit continue après ce numéro." />
        <Champ libelle="TVA (%)" name="tva" inputMode="decimal" defaultValue={String(liste.tva)} required />
        {erreur && <Erreur>{erreur}</Erreur>}
        {ok && (
          <p role="status" className="text-sm font-semibold text-emerald-700">
            Enregistré.
          </p>
        )}
        <Bouton type="submit" variante="contour" className="justify-self-start">
          Enregistrer
        </Bouton>
      </form>
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
          <Reglages liste={liste} onEnregistre={charger} />
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
