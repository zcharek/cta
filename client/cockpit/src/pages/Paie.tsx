import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { SITUATIONS, aujourdhui, formatDzd, libelleMois } from "../../../../shared/cockpit";
import type { DonneesBulletin, Paie as Calcul } from "../../../../shared/paie";
import { api } from "../api";
import { naviguer } from "../routeur";
import { Bouton, Carte, Champ, Chargement, ChiffreCle, EnTete, Erreur, Etape, Icone, Info, Verification, classeChamp } from "../ui";

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
type Bulletin = { id: string; mois: string; profil_id: string; nom: string; brut: number; net: number; cree_le: string };
type Donnees = {
  numeroAdherent: string | null;
  adherentFige: boolean;
  entreprise: { raison_sociale: string; siege: string };
  salaries: Salarie[];
  bulletins: Bulletin[];
  prochainMatricule: string;
};
type Infos = {
  numeroAdherent: string;
  matricule: string;
  fonction: string;
  dateEntree: string;
  affectation: string;
  situationFamiliale: string;
  numeroSs: string;
  numeroCompte: string;
};

const da = (n: number) => `${n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/[  ]/g, " ")} DA`;
const dateFr = (iso: string) => iso.slice(0, 10).split("-").reverse().join("/");
const lireNet = (s: string) => Number(s.replace(/\s/g, "").replace(",", "."));

/** Bulletin PDF, avec le logo CTA seul en haut à gauche. */
async function telechargerBulletin(donnees: DonneesBulletin) {
  const [pdf, logo] = await Promise.all([
    import("../../../../shared/paie"),
    fetch("/images/logo-cta-icone.png") // logo seul, sans « Central Test Agency »
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

// ——— Aperçu HTML du bulletin (miniature fidèle au PDF) ———

function ApercuBulletin({ d }: { d: DonneesBulletin }) {
  const s = d.salarie;
  const p = d.paie;
  const m = (n: number) => da(n).replace(" DA", "");
  const champ = (libelle: string, valeur: string | null | undefined, classe = "") => (
    <div className={classe}>
      <p className="text-[7px] font-bold uppercase tracking-wide text-[#5c6682]">{libelle}</p>
      <p className="truncate rounded-sm border border-[#d6dbe6] bg-[#f6f7fa] px-1.5 py-0.5 font-bold">{valeur || "-"}</p>
    </div>
  );
  return (
    <div className="relative overflow-hidden rounded-xl bg-white p-5 text-[9.5px] leading-snug text-[#071538] shadow-[0_4px_24px_rgba(7,21,56,0.12)]" aria-label="Aperçu du bulletin">
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center text-6xl font-black tracking-widest text-[#071538]/[0.05] [transform:rotate(-24deg)]">
        APERÇU
      </span>
      <div className="flex items-center gap-2.5">
        <img src="/images/logo-cta-icone.png" alt="" className="h-8 w-8" />
        <div className="min-w-0">
          <p className="truncate text-[11px] font-extrabold">{d.entreprise.raison_sociale}</p>
          <p className="truncate text-[8px] uppercase text-[#5c6682]">{d.entreprise.siege}</p>
          <p className="text-[8px] font-bold text-[#5c6682]">
            N° ADHÉRENT <span className="text-[#071538]">{d.entreprise.numero_adherent || "-"}</span>
          </p>
        </div>
      </div>
      <div className="mt-3 flex justify-between border-b-[3px] border-[#dc5a2e] bg-[#071538] px-3 py-1.5 text-[10.5px] font-bold text-white">
        <span>BULLETIN DE PAIE</span>
        <span className="uppercase">{libelleMois(d.mois)}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-x-2 gap-y-1.5">
        {champ("Matricule", s.matricule)}
        {champ("Nom", s.nom.toUpperCase(), "col-span-2")}
        {champ("Fonction", s.fonction.toUpperCase(), "col-span-2")}
        {champ("Date d'entrée", s.date_entree && dateFr(s.date_entree))}
        {champ("Affectation", s.affectation?.toUpperCase(), "col-span-2")}
        {champ("Situation", s.situation_familiale && `${s.situation_familiale} - ${SITUATIONS[s.situation_familiale] ?? ""}`)}
        {champ("N° SS", s.numero_ss)}
        {champ("N° de compte", s.numero_compte, "col-span-2")}
      </div>
      <table className="mt-3 w-full border-collapse border border-[#d6dbe6]">
        <thead>
          <tr className="bg-[#071538] text-left text-[8px] text-white">
            <th className="px-1.5 py-1">Libellé</th>
            <th className="px-1.5 py-1 text-right">Gain</th>
            <th className="px-1.5 py-1 text-right">Retenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-1.5 py-1">SALAIRE DE BASE</td>
            <td className="px-1.5 py-1 text-right font-bold">{m(p.brut)}</td>
            <td />
          </tr>
          <tr>
            <td className="px-1.5 py-1">RETENUE SÉCU. SOCIALE 9 %</td>
            <td />
            <td className="px-1.5 py-1 text-right font-bold">{m(p.retenueSs)}</td>
          </tr>
          <tr>
            <td className="px-1.5 py-1">RETENUE IRG</td>
            <td />
            <td className="px-1.5 py-1 text-right font-bold">{m(p.irg)}</td>
          </tr>
          <tr className="border-t border-[#d6dbe6] bg-[#f6f7fa] font-bold">
            <td className="px-1.5 py-1 text-right">TOTAL</td>
            <td className="px-1.5 py-1 text-right">{m(p.brut)}</td>
            <td className="px-1.5 py-1 text-right">{m(p.retenueSs + p.irg)}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-3 flex items-center justify-end gap-3">
        <span className="text-[10px] font-bold">NET À PAYER</span>
        <span className="border-l-4 border-[#dc5a2e] bg-[#071538] px-3 py-1.5 text-[11.5px] font-bold text-white">{da(p.net)}</span>
      </div>
      <p className="mt-3 border-t border-[#d6dbe6] pt-2 text-[7.5px] text-[#5c6682]">Document confidentiel</p>
    </div>
  );
}

// ——— Génération ———

function infosDe(s: Salarie, d: Donnees): Infos {
  return {
    numeroAdherent: d.numeroAdherent ?? "",
    matricule: s.matricule ?? d.prochainMatricule,
    fonction: s.fonction ?? "",
    dateEntree: s.date_entree ?? "",
    affectation: s.affectation ?? "",
    situationFamiliale: s.situation_familiale ?? "",
    numeroSs: s.numero_ss ?? "",
    numeroCompte: s.numero_compte ?? "",
  };
}

function Generer({ donnees, onGenere }: { donnees: Donnees; onGenere: () => void }) {
  const [salarieId, setSalarieId] = useState(donnees.salaries[0]?.id ?? "");
  const salarie = donnees.salaries.find((s) => s.id === salarieId)!;
  const [mois, setMois] = useState(aujourdhui().slice(0, 7));
  const [net, setNet] = useState(salarie.salaire_net ? String(salarie.salaire_net) : "");
  const [infos, setInfos] = useState<Infos>(() => infosDe(salarie, donnees));
  const [calcul, setCalcul] = useState<Calcul | null>(null);
  const [erreur, setErreur] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [message, setMessage] = useState("");
  // Informations dépliées si quelque chose d'obligatoire manque, à l'ouverture et à chaque changement de salarié
  const aCompleter = (i: Infos) => !i.numeroAdherent.trim() || !i.matricule.trim() || !i.fonction.trim();
  const [ouvert, setOuvert] = useState(() => !salarie.matricule || aCompleter(infos));

  function choisir(id: string) {
    const s = donnees.salaries.find((x) => x.id === id)!;
    setSalarieId(id);
    setNet(s.salaire_net ? String(s.salaire_net) : "");
    const i = infosDe(s, donnees);
    setInfos(i);
    setOuvert(!s.matricule || aCompleter(i));
    setMessage("");
    setErreur("");
  }

  useEffect(() => {
    setCalcul(null);
    const n = lireNet(net);
    if (!n || n <= 0) return;
    const t = setTimeout(() => {
      api<{ paie: Calcul }>(`paie/apercu?net=${n}`)
        .then((d) => setCalcul(d.paie))
        .catch(() => setCalcul(null));
    }, 300);
    return () => clearTimeout(t);
  }, [net]);

  const maj = (cle: keyof Infos) => (e: { target: { value: string } }) => setInfos((i) => ({ ...i, [cle]: e.target.value }));
  const premiereFois = !salarie.matricule;
  const dejaFait = donnees.bulletins.some((b) => b.profil_id === salarie.id && b.mois === mois);
  const adherentOk = !!infos.numeroAdherent.trim();
  const ficheOk = !!infos.matricule.trim() && !!infos.fonction.trim();
  const bancaireOk = !!infos.numeroSs.trim() && !!infos.numeroCompte.trim();
  const manque = [!infos.numeroSs.trim() && "N° de sécurité sociale", !infos.numeroCompte.trim() && "N° de compte"].filter(Boolean);

  const apercu: DonneesBulletin | null = calcul
    ? {
        mois,
        entreprise: { ...donnees.entreprise, numero_adherent: infos.numeroAdherent.trim() },
        salarie: {
          matricule: infos.matricule.trim(),
          nom: salarie.nom,
          situation_familiale: infos.situationFamiliale || null,
          fonction: infos.fonction.trim(),
          affectation: infos.affectation.trim() || null,
          date_entree: infos.dateEntree || null,
          numero_ss: infos.numeroSs.trim() || null,
          numero_compte: infos.numeroCompte.trim() || null,
        },
        paie: calcul,
      }
    : null;

  async function generer(e: FormEvent) {
    e.preventDefault();
    if (dejaFait && !window.confirm(`Le bulletin de ${libelleMois(mois)} existe déjà pour ${salarie.nom}. Le remplacer ?`)) return;
    setOccupe(true);
    setErreur("");
    setMessage("");
    try {
      const r = await api<{ donnees: DonneesBulletin }>("paie/bulletins", { corps: { ...infos, profilId: salarie.id, mois, net } });
      await telechargerBulletin(r.donnees);
      setMessage(`Bulletin de ${libelleMois(mois)} généré et téléchargé.`);
      onGenere();
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const ligne = (libelle: string, valeur: string) => (
    <div className="flex justify-between gap-4 py-1.5 text-sm">
      <dt className="text-ck-texte-2">{libelle}</dt>
      <dd className="text-right font-semibold tabular-nums text-ck-titre">{valeur}</dd>
    </div>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <Carte aria-labelledby="titre-generer" className="sm:!p-7">
        <div className="mb-6 flex items-start gap-3.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef2fb] text-ck-titre">
            <Icone nom="banque" taille={20} />
          </span>
          <div>
            <h2 id="titre-generer" className="ck-titre text-lg leading-tight">
              Générer un bulletin
            </h2>
            <p className="mt-0.5 text-sm text-ck-texte-2">Saisissez le net : le brut, la sécurité sociale et l'IRG sont calculés.</p>
          </div>
        </div>

        <form onSubmit={generer} className="grid gap-5">
          <Etape numero={1} titre="Salarié et période">
            <div className="grid gap-4">
              <div>
                <label htmlFor="paie-salarie" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                  Salarié
                </label>
                <select id="paie-salarie" value={salarieId} onChange={(e) => choisir(e.target.value)} className={classeChamp}>
                  {donnees.salaries.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                      {s.matricule ? ` (${s.matricule})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Champ libelle="Mois" name="mois" type="month" value={mois} onChange={(e) => setMois(e.target.value)} required />
                <Champ libelle="Salaire net à payer (DA)" name="net" inputMode="decimal" value={net} onChange={(e) => setNet(e.target.value)} required placeholder="80 000" />
              </div>
              {premiereFois && <Info>Premier bulletin de {salarie.nom} : complétez ses informations, elles seront reprises les mois suivants.</Info>}
            </div>
          </Etape>

          <Etape numero={2} titre="Vérifications">
            <ul className="divide-y divide-[color:var(--ck-bordure)]">
              <Verification
                ok={adherentOk}
                titre={adherentOk ? "N° adhérent de l'employeur renseigné" : "N° adhérent de l'employeur à saisir"}
                detail={donnees.adherentFige ? "Identité de l'entreprise : non modifiable." : adherentOk ? "Enregistré, repris sur tous les bulletins." : "Demandé une seule fois, puis repris sur tous les bulletins."}
              />
              <Verification ok={ficheOk} titre={ficheOk ? "Matricule et fonction renseignés" : "Matricule et fonction obligatoires"} detail={ficheOk ? `Matricule ${infos.matricule}, ${infos.fonction}.` : "Complétez-les dans les informations ci-dessous."} />
              <Verification
                ok={bancaireOk}
                titre={bancaireOk ? "N° de sécurité sociale et compte renseignés" : "Informations du salarié incomplètes"}
                detail={bancaireOk ? "Imprimés sur le bulletin." : `Il manque : ${manque.join(", ")}. Facultatif ; le salarié peut aussi les saisir dans « Mon profil ».`}
              />
              {dejaFait && <Verification ok={false} titre="Bulletin déjà généré pour ce mois" detail="Il sera remplacé, après confirmation." />}
            </ul>

            <details open={ouvert} onToggle={(e) => setOuvert(e.currentTarget.open)} className="group mt-3 rounded-2xl border border-ck-bordure">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-ck-titre">
                Informations du bulletin
                <span className="text-xs font-semibold text-[#2f5bd3] group-open:hidden">Modifier</span>
                <span className="hidden text-xs font-semibold text-ck-texte-2 group-open:inline">Masquer</span>
              </summary>
              <div className="grid gap-4 border-t border-ck-bordure px-4 py-4">
                <Champ
                  libelle="N° adhérent (CNAS)"
                  name="numeroAdherent"
                  value={infos.numeroAdherent}
                  onChange={maj("numeroAdherent")}
                  readOnly={donnees.adherentFige}
                  required
                  placeholder="12345678 90"
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Champ libelle="Matricule" name="matricule" required maxLength={20} value={infos.matricule} onChange={maj("matricule")} />
                  <Champ libelle="Fonction" name="fonction" required maxLength={120} value={infos.fonction} onChange={maj("fonction")} placeholder="Ingénieur logiciel" className="sm:col-span-2" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Champ libelle="Date d'entrée" name="dateEntree" type="date" value={infos.dateEntree} onChange={maj("dateEntree")} />
                  <Champ libelle="Affectation" name="affectation" maxLength={120} value={infos.affectation} onChange={maj("affectation")} placeholder="Facultatif" className="sm:col-span-2" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="paie-situation" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                      Situation familiale
                    </label>
                    <select id="paie-situation" name="situationFamiliale" value={infos.situationFamiliale} onChange={maj("situationFamiliale")} className={classeChamp}>
                      <option value="">-</option>
                      {Object.entries(SITUATIONS).map(([code, libelle]) => (
                        <option key={code} value={code}>
                          {libelle}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Champ libelle="N° sécurité sociale" name="numeroSs" inputMode="numeric" maxLength={30} value={infos.numeroSs} onChange={maj("numeroSs")} className="sm:col-span-2" />
                </div>
                <Champ libelle="N° de compte" name="numeroCompte" inputMode="numeric" maxLength={40} value={infos.numeroCompte} onChange={maj("numeroCompte")} />
              </div>
            </details>
          </Etape>

          <Etape numero={3} titre="Montants">
            {calcul ? (
              <dl className="rounded-2xl bg-[var(--ck-champ)] px-5 py-3">
                {ligne("Salaire de base (brut)", da(calcul.brut))}
                {ligne("Retenue sécurité sociale (9 %)", da(calcul.retenueSs))}
                {ligne("Retenue IRG", da(calcul.irg))}
                <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-ck-bordure pt-3">
                  <dt className="font-bold text-ck-titre">Net à payer</dt>
                  <dd className="ck-titre text-2xl tabular-nums">{da(calcul.net)}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-ck-texte-2">Saisissez le salaire net pour calculer le bulletin.</p>
            )}
          </Etape>

          {erreur && <Erreur>{erreur}</Erreur>}
          {message && (
            <p role="status" className="text-sm font-semibold text-emerald-700">
              {message}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Bouton type="submit" variante="orange" disabled={occupe || !calcul || !adherentOk || !ficheOk}>
              <Icone nom="document" taille={16} /> {occupe ? "Génération…" : `Générer le bulletin de ${libelleMois(mois)}`}
            </Bouton>
            <Bouton variante="contour" onClick={() => naviguer("/reglages/collaborateurs")}>
              <Icone nom="equipe" taille={16} /> Fiches collaborateurs
            </Bouton>
          </div>
          <p className="text-xs text-ck-texte-2">Les informations saisies sont enregistrées sur la fiche du salarié et reprises les mois suivants.</p>
        </form>
      </Carte>

      <Carte aria-labelledby="titre-apercu" className="bg-[#f7f8fb] sm:!p-7 lg:sticky lg:top-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="titre-apercu" className="ck-titre text-lg">
              Aperçu
            </h2>
            <p className="text-sm text-ck-texte-2">Le bulletin tel qu'il sera généré.</p>
          </div>
          {apercu && (
            <Bouton variante="contour" className="!px-3 !py-1.5 !text-xs" onClick={() => void telechargerBulletin(apercu).catch((e: Error) => setErreur(e.message))}>
              Ouvrir en PDF
            </Bouton>
          )}
        </div>
        {apercu ? (
          <ApercuBulletin d={apercu} />
        ) : (
          <div className="grid place-items-center rounded-xl border border-dashed border-ck-bordure px-6 py-16 text-center">
            <span className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2fb] text-ck-titre">
              <Icone nom="document" taille={22} />
            </span>
            <p className="font-bold text-ck-titre">Aperçu en attente</p>
            <p className="mt-1 max-w-xs text-xs text-ck-texte-2">Saisissez le salaire net pour afficher le bulletin.</p>
          </div>
        )}
      </Carte>
    </div>
  );
}

// ——— Bulletins générés ———

function ListeBulletins({ donnees, onErreur }: { donnees: Donnees; onErreur: (m: string) => void }) {
  const annees = useMemo(() => [...new Set([Number(aujourdhui().slice(0, 4)), ...donnees.bulletins.map((b) => Number(b.mois.slice(0, 4)))])].sort((a, b) => b - a), [donnees]);
  const [annee, setAnnee] = useState(annees[0]!);
  const [salarie, setSalarie] = useState("");
  const bulletins = donnees.bulletins.filter((b) => b.mois.startsWith(String(annee)) && (!salarie || b.profil_id === salarie));
  const matricule = (id: string) => donnees.salaries.find((s) => s.id === id)?.matricule ?? "-";

  async function retelecharger(b: Bulletin) {
    try {
      await telechargerBulletin((await api<{ donnees: DonneesBulletin }>(`paie/bulletins/${b.id}`)).donnees);
    } catch (e) {
      onErreur((e as Error).message);
    }
  }

  return (
    <section id="bulletins-generes" aria-labelledby="titre-bulletins" className="mt-10 scroll-mt-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="titre-bulletins" className="ck-titre text-xl">
          Bulletins générés
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
          <label htmlFor="filtre-salarie" className="ml-2 text-ck-texte-2">
            Salarié
          </label>
          <select id="filtre-salarie" aria-label="Filtrer par salarié" value={salarie} onChange={(e) => setSalarie(e.target.value)} className={`${classeChamp} !w-auto !py-1.5`}>
            <option value="">Tous</option>
            {donnees.salaries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Carte className="overflow-x-auto !p-0">
        <table className="w-full text-sm">
          <thead className="text-ck-texte-2">
            <tr className="border-b border-ck-bordure">
              {["Salarié", "Matricule", "Mois", "Brut", "Net à payer", "Généré le", ""].map((t, i) => (
                <th key={i} scope="col" className={`px-4 py-3 font-semibold ${i === 3 || i === 4 ? "text-right" : "text-left"}`}>
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bulletins.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center">
                  <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#eef2fb] text-ck-titre">
                    <Icone nom="banque" taille={22} />
                  </span>
                  <p className="font-bold text-ck-titre">{donnees.bulletins.length ? "Aucun bulletin pour ces filtres" : "Aucun bulletin pour l'instant"}</p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-ck-texte-2">Chaque bulletin généré apparaîtra ici et pourra être retéléchargé à l'identique.</p>
                </td>
              </tr>
            ) : (
              bulletins.map((b) => (
                <tr key={b.id} className="border-b border-ck-bordure last:border-0">
                  <th scope="row" className="px-4 py-3 text-left font-bold text-ck-titre">
                    {b.nom}
                  </th>
                  <td className="px-4 py-3 tabular-nums">{matricule(b.profil_id)}</td>
                  <td className="px-4 py-3 capitalize">{libelleMois(b.mois)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{da(b.brut)}</td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">{da(b.net)}</td>
                  <td className="px-4 py-3">{dateFr(b.cree_le)}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => void retelecharger(b)} className="font-bold text-ck-orange-texte hover:underline">
                      PDF
                    </button>
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

function Ligne({ libelle, valeur }: { libelle: string; valeur: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ck-bordure py-2.5 text-sm last:border-0">
      <dt className="text-ck-texte-2">{libelle}</dt>
      <dd className={`text-right font-semibold ${valeur ? "text-ck-titre" : "italic text-ck-texte-2"}`}>{valeur || "Non renseigné"}</dd>
    </div>
  );
}

function Parametres({ donnees }: { donnees: Donnees }) {
  return (
    <section aria-labelledby="titre-parametres" className="mt-10">
      <h2 id="titre-parametres" className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="ck-titre flex items-center gap-2 text-lg">
          <Icone nom="cadenas" taille={18} /> Paramètres de paie
        </span>
        <span className="text-xs text-ck-texte-2">Verrouillés, appliqués à chaque bulletin</span>
      </h2>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Carte aria-labelledby="titre-calcul">
          <h3 id="titre-calcul" className="mb-2 font-bold text-ck-titre">
            Calcul
          </h3>
          <dl>
            <Ligne libelle="Retenue sécurité sociale" valeur="9 % du brut" />
            <Ligne libelle="IRG" valeur="Barème 2022, abattement 40 %" />
            <Ligne libelle="Exonération IRG" valeur="Jusqu'à 30 000 DA imposables" />
            <Ligne libelle="Salaire de base" valeur="26 jours" />
          </dl>
        </Carte>
        <Carte aria-labelledby="titre-employeur">
          <h3 id="titre-employeur" className="mb-2 font-bold text-ck-titre">
            Employeur
          </h3>
          <dl>
            <Ligne libelle="Raison sociale" valeur={donnees.entreprise.raison_sociale} />
            <Ligne libelle="Siège social" valeur={donnees.entreprise.siege} />
            <Ligne libelle="N° adhérent (CNAS)" valeur={donnees.numeroAdherent} />
          </dl>
        </Carte>
      </div>
    </section>
  );
}

export default function Paie() {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    api<Donnees>("paie")
      .then(setDonnees)
      .catch((e: Error) => setErreur(e.message));
  }, []);
  useEffect(charger, [charger]);

  if (!donnees) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  const moisCourant = aujourdhui().slice(0, 7);
  const annee = moisCourant.slice(0, 4);
  const faits = new Set(donnees.bulletins.filter((b) => b.mois === moisCourant).map((b) => b.profil_id));
  const aGenerer = donnees.salaries.filter((s) => !faits.has(s.id)).length;
  const deLAnnee = donnees.bulletins.filter((b) => b.mois.startsWith(annee));
  const netAnnee = deLAnnee.reduce((s, b) => s + b.net, 0);

  return (
    <>
      <EnTete
        titre="Bulletins"
        accent="de paie."
        sousTitre="Générez un bulletin en trois étapes. Le brut est calculé à partir du net convenu."
        actions={
          <Bouton variante="contour" onClick={() => document.getElementById("bulletins-generes")?.scrollIntoView({ behavior: "smooth" })}>
            <Icone nom="menu" taille={18} /> Bulletins générés
          </Bouton>
        }
      />
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ChiffreCle icone="equipe" teinte="bg-[#eef2fb] text-ck-titre" valeur={donnees.salaries.length} libelle={`salarié${donnees.salaries.length > 1 ? "s" : ""} actif${donnees.salaries.length > 1 ? "s" : ""}`} />
        <ChiffreCle icone="horloge" teinte="bg-orange-50 text-ck-orange" valeur={aGenerer} libelle={`bulletin${aGenerer > 1 ? "s" : ""} à générer pour ${libelleMois(moisCourant)}`} />
        <ChiffreCle icone="document" teinte="bg-[#eef2fb] text-[#2f5bd3]" valeur={deLAnnee.length} libelle={`bulletin${deLAnnee.length > 1 ? "s" : ""} généré${deLAnnee.length > 1 ? "s" : ""} en ${annee}`} />
        <ChiffreCle icone="banque" teinte="bg-emerald-50 text-emerald-700" valeur={formatDzd(netAnnee)} libelle={`net versé en ${annee}`} />
      </div>
      {erreur && (
        <div className="mb-6">
          <Erreur>{erreur}</Erreur>
        </div>
      )}
      {donnees.salaries.length ? <Generer donnees={donnees} onGenere={charger} /> : <Carte className="text-sm text-ck-texte-2">Aucun salarié actif.</Carte>}
      <ListeBulletins donnees={donnees} onErreur={setErreur} />
      <Parametres donnees={donnees} />
    </>
  );
}
