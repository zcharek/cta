import { useCallback, useEffect, useState, type FormEvent } from "react";
import { SITUATIONS, aujourdhui, libelleMois } from "../../../../shared/cockpit";
import type { DonneesBulletin, Paie as Calcul } from "../../../../shared/paie";
import { api } from "../api";
import { Bouton, Carte, Champ, Chargement, EnTete, EnteteSection, Erreur, Info, classeChamp } from "../ui";

type Salarie = {
  id: string;
  nom: string;
  matricule: string | null;
  fonction: string | null;
  affectation: string | null;
  date_entree: string | null;
  salaire_net: number | null;
  situation_familiale: string | null;
  numero_ss: string | null;
  numero_compte: string | null;
};
type Bulletin = { id: string; mois: string; profil_id: string; nom: string; brut: number; net: number };
type Donnees = { numeroAdherent: string | null; adherentFige: boolean; salaries: Salarie[]; bulletins: Bulletin[]; prochainMatricule: string };

const da = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, " ")} DA`;

async function telechargerBulletin(donnees: DonneesBulletin) {
  const [pdf, logo] = await Promise.all([
    import("../../../../shared/paie"),
    fetch("/images/logo-cta-facture.png")
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .catch(() => null),
  ]);
  const octets = await pdf.genererBulletin(donnees, logo ? new Uint8Array(logo) : undefined);
  const url = URL.createObjectURL(new Blob([octets], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = pdf.nomFichierBulletin(donnees);
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Formulaire({ salarie, donnees, onGenere }: { salarie: Salarie; donnees: Donnees; onGenere: () => void }) {
  const [mois, setMois] = useState(aujourdhui().slice(0, 7));
  const [net, setNet] = useState(salarie.salaire_net ? String(salarie.salaire_net) : "");
  const [calcul, setCalcul] = useState<Calcul | null>(null);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [message, setMessage] = useState("");
  const premiereFois = !salarie.matricule;

  useEffect(() => {
    setCalcul(null);
    const n = Number(net.replace(/\s/g, "").replace(",", "."));
    if (!n || n <= 0) return;
    const t = setTimeout(() => {
      api<{ paie: Calcul }>(`paie/apercu?net=${n}`)
        .then((d) => setCalcul(d.paie))
        .catch(() => setCalcul(null));
    }, 300);
    return () => clearTimeout(t);
  }, [net]);

  const dejaFait = donnees.bulletins.some((b) => b.profil_id === salarie.id && b.mois === mois);

  async function generer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (dejaFait && !window.confirm(`Le bulletin de ${libelleMois(mois)} existe déjà pour ${salarie.nom}. Le remplacer ?`)) return;
    setOccupe(true);
    setErreur("");
    setMessage("");
    try {
      const r = await api<{ donnees: DonneesBulletin }>("paie/bulletins", { corps: { ...f, profilId: salarie.id, mois, net } });
      await telechargerBulletin(r.donnees);
      setMessage(`Bulletin de ${libelleMois(mois)} généré et téléchargé.`);
      onGenere();
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const titre = (t: string) => <h3 className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-ck-texte-2">{t}</h3>;
  const ligne = (libelle: string, valeur: string, fort = false) => (
    <div className={`flex justify-between gap-4 py-1.5 ${fort ? "border-t border-ck-bordure pt-2.5 font-bold text-ck-titre" : ""}`}>
      <dt className={fort ? "" : "text-ck-texte-2"}>{libelle}</dt>
      <dd className="text-right tabular-nums">{valeur}</dd>
    </div>
  );

  return (
    <form onSubmit={generer} className="grid gap-4">
      {premiereFois && <Info>Premier bulletin de {salarie.nom} : complétez ses informations, elles seront reprises les mois suivants.</Info>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ libelle="Mois" name="mois_" type="month" value={mois} onChange={(e) => setMois(e.target.value)} required />
        <Champ libelle="Salaire net à payer (DA)" name="net_" inputMode="decimal" value={net} onChange={(e) => setNet(e.target.value)} required placeholder="80 000" />
      </div>
      {calcul && (
        <dl className="rounded-xl bg-ck-surface-2 px-4 py-3 text-sm">
          {ligne("Salaire de base (brut)", da(calcul.brut))}
          {ligne("Retenue sécurité sociale (9 %)", da(calcul.retenueSs))}
          {ligne("Retenue IRG", da(calcul.irg))}
          {ligne("Net à payer", da(calcul.net), true)}
        </dl>
      )}

      {titre("Employeur")}
      <Champ
        libelle="N° adhérent (CNAS)"
        name="numeroAdherent"
        defaultValue={donnees.numeroAdherent ?? ""}
        readOnly={donnees.adherentFige}
        required
        placeholder="12345678 90"
        aide={donnees.adherentFige ? "Identité de l'entreprise : non modifiable." : donnees.numeroAdherent ? "Enregistré, repris sur tous les bulletins." : "Demandé une seule fois, puis repris sur tous les bulletins."}
      />

      {titre("Salarié")}
      <div className="grid gap-4 sm:grid-cols-3">
        <Champ libelle="Matricule" name="matricule" required maxLength={20} defaultValue={salarie.matricule ?? donnees.prochainMatricule} />
        <Champ libelle="Fonction" name="fonction" required maxLength={120} defaultValue={salarie.fonction ?? ""} placeholder="Ingénieur logiciel" className="sm:col-span-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Champ libelle="Date d'entrée" name="dateEntree" type="date" defaultValue={salarie.date_entree ?? ""} />
        <Champ libelle="Affectation" name="affectation" maxLength={120} defaultValue={salarie.affectation ?? ""} placeholder="Facultatif" className="sm:col-span-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="paie-situation" className="mb-1.5 block text-sm font-semibold text-ck-titre">
            Situation familiale
          </label>
          <select id="paie-situation" name="situationFamiliale" defaultValue={salarie.situation_familiale ?? ""} className={classeChamp}>
            <option value="">-</option>
            {Object.entries(SITUATIONS).map(([code, libelle]) => (
              <option key={code} value={code}>
                {libelle}
              </option>
            ))}
          </select>
        </div>
        <Champ libelle="N° sécurité sociale" name="numeroSs" inputMode="numeric" maxLength={30} defaultValue={salarie.numero_ss ?? ""} className="sm:col-span-2" />
      </div>
      <Champ libelle="N° de compte" name="numeroCompte" inputMode="numeric" maxLength={40} defaultValue={salarie.numero_compte ?? ""} aide="Le salarié peut aussi renseigner son N° SS et son compte dans « Mon profil »." />

      {erreur && <Erreur>{erreur}</Erreur>}
      {dejaFait && <Info>Un bulletin existe déjà pour ce mois : il sera remplacé.</Info>}
      {message && (
        <p role="status" className="text-sm font-semibold text-emerald-700">
          {message}
        </p>
      )}
      <Bouton type="submit" disabled={occupe || !calcul} className="justify-self-start">
        {occupe ? "Génération…" : "Générer le bulletin"}
      </Bouton>
    </form>
  );
}

export default function Paie() {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const [salarieId, setSalarieId] = useState("");

  const charger = useCallback(() => {
    api<Donnees>("paie")
      .then((d) => {
        setDonnees(d);
        setSalarieId((id) => id || d.salaries[0]?.id || "");
      })
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  async function retelecharger(b: Bulletin) {
    try {
      const r = await api<{ donnees: DonneesBulletin }>(`paie/bulletins/${b.id}`);
      await telechargerBulletin(r.donnees);
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  if (!donnees) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;
  const salarie = donnees.salaries.find((s) => s.id === salarieId);

  return (
    <>
      <EnTete titre="Bulletins" accent="de paie." sousTitre="Le brut est calculé à partir du net convenu : sécurité sociale 9 % et IRG selon le barème en vigueur." />
      {erreur && (
        <div className="mb-6">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <Carte className="lg:col-span-3" aria-labelledby="titre-generer">
          <EnteteSection id="titre-generer" icone="banque" titre="Générer un bulletin" sousTitre="Saisissez le net : le brut, la sécurité sociale et l'IRG sont calculés." />
          <div className="mb-4">
            <label htmlFor="paie-salarie" className="mb-1.5 block text-sm font-semibold text-ck-titre">
              Salarié
            </label>
            <select id="paie-salarie" value={salarieId} onChange={(e) => setSalarieId(e.target.value)} className={classeChamp}>
              {donnees.salaries.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                  {s.matricule ? ` (${s.matricule})` : ""}
                </option>
              ))}
            </select>
          </div>
          {salarie && <Formulaire key={salarie.id} salarie={salarie} donnees={donnees} onGenere={charger} />}
        </Carte>

        <section aria-labelledby="titre-bulletins" className="lg:col-span-2">
          <h2 id="titre-bulletins" className="ck-titre mb-4 text-xl">
            Bulletins générés
          </h2>
          {donnees.bulletins.length === 0 ? (
            <Carte className="text-sm text-ck-texte-2">Aucun bulletin pour l'instant.</Carte>
          ) : (
            <Carte className="!p-0">
              <ul className="divide-y divide-[color:var(--ck-bordure)]">
                {donnees.bulletins.map((b) => (
                  <li key={b.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold text-ck-titre">{b.nom}</span>
                      <span className="capitalize text-ck-texte-2">{libelleMois(b.mois)}</span>
                      <span className="text-ck-texte-2"> · net {da(b.net)}</span>
                    </span>
                    <button type="button" onClick={() => void retelecharger(b)} className="font-bold text-ck-orange-texte hover:underline">
                      PDF
                    </button>
                  </li>
                ))}
              </ul>
            </Carte>
          )}
        </section>
      </div>
    </>
  );
}
