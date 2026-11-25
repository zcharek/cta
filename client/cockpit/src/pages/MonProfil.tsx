import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CHAMPS_COORDONNEES, MOT_DE_PASSE_MIN, ONGLET_LABEL, ROLE_LABEL, SITUATIONS, WILAYAS, coordonneesManquantes, type Coordonnees, type Role } from "../../../../shared/cockpit";
import { api, type Moi } from "../api";
import { Avatar, Bouton, Carte, Champ, Chargement, EnTete, EnteteSection, Erreur, Icone, classeChamp } from "../ui";

type Profil = { nom: string; email: string; role: Role; mot_de_passe_le: string | null } & Coordonnees;

const CHAMPS = Object.keys(CHAMPS_COORDONNEES) as (keyof Coordonnees)[];

type Rubrique = "identite" | "adresse" | "paie";
const RUBRIQUES: { cle: Rubrique; libelle: string; icone: string; champs: (keyof Coordonnees)[] }[] = [
  { cle: "identite", libelle: "Informations personnelles", icone: "profil", champs: ["date_naissance", "lieu_naissance", "nationalite", "nin", "telephone"] },
  { cle: "adresse", libelle: "Adresse", icone: "lieu", champs: ["adresse", "ville", "wilaya"] },
  { cle: "paie", libelle: "Paie", icone: "banque", champs: ["situation_familiale", "numero_ss", "numero_compte"] },
];

function Succes({ children }: { children: string }) {
  return (
    <p role="status" className="text-sm font-semibold text-emerald-700">
      {children}
    </p>
  );
}

/** « Mon profil » : ses coordonnées et son mot de passe. Accessible à tous, quels que soient les onglets. */
export default function MonProfil({ moi, onMisAJour }: { moi: Moi; onMisAJour: () => void }) {
  const [profil, setProfil] = useState<Profil | null>(null);
  const [erreur, setErreur] = useState("");
  const [rubrique, setRubrique] = useState<Rubrique>("identite");
  const formulaire = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<{ profil: Profil }>("profil")
      .then((d) => setProfil(d.profil))
      .catch((e: Error) => setErreur(e.message));
  }, []);

  if (!profil) return erreur ? <Erreur>{erreur}</Erreur> : <Chargement />;

  function modifier() {
    formulaire.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    formulaire.current?.querySelector<HTMLInputElement>("input:not([readonly])")?.focus({ preventScroll: true });
  }

  return (
    <>
      <EnTete titre="Mon" accent="profil." sousTitre="Consultez et gérez vos informations personnelles." />
      <Entete profil={profil} onModifier={modifier} />

      <div ref={formulaire} className="mt-6 scroll-mt-6">
        <Onglets actif={rubrique} onChange={setRubrique} profil={profil} />
      </div>
      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <FicheCoordonnees profil={profil} rubrique={rubrique} onRubrique={setRubrique} onEnregistre={(p) => (setProfil(p), onMisAJour())} />
        <div className="grid gap-6">
          <MotDePasse />
          <Carte aria-labelledby="titre-acces">
            <EnteteSection id="titre-acces" icone="bouclier" titre="Mes accès" sousTitre="Les pages de Cockpit ouvertes pour vous" />
            {moi.onglets.length ? (
              <ul className="grid gap-2.5">
                {moi.onglets.map((o) => (
                  <li key={o} className="flex items-center gap-2.5 text-sm font-semibold text-ck-titre">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#2f5bd3] text-white">
                      <Icone nom="coche" taille={13} />
                    </span>
                    {ONGLET_LABEL[o]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ck-texte-2">Aucun onglet activé.</p>
            )}
            <p className="mt-5 flex gap-2.5 rounded-xl bg-[#eef2fb] px-4 py-3 text-xs text-ck-texte">
              <Icone nom="info" taille={18} className="shrink-0 text-[#2f5bd3]" />
              Pour changer votre adresse e-mail ou vos accès, adressez-vous au Founder, à un Co-Founder ou à un QA Manager.
            </p>
          </Carte>
        </div>
      </div>
    </>
  );
}

function Fait({ icone, libelle, valeur }: { icone: string; libelle: string; valeur: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef2fb] text-ck-titre">
        <Icone nom={icone} taille={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-ck-texte-2">{libelle}</span>
        <span className={`block truncate text-sm font-semibold ${valeur ? "text-ck-titre" : "italic text-ck-texte-2"}`}>{valeur || "À renseigner"}</span>
      </span>
    </div>
  );
}

function Entete({ profil, onModifier }: { profil: Profil; onModifier: () => void }) {
  const manquants = coordonneesManquantes(profil).length;
  const pourcent = Math.round(((CHAMPS.length - manquants) / CHAMPS.length) * 100);
  return (
    <Carte className="ck-halo !p-6 sm:!p-7">
      <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-5">
          <Avatar nom={profil.nom} couleur="#DC5A2E" taille={84} />
          <div className="min-w-0">
            <p className="ck-titre truncate text-2xl">{profil.nom}</p>
            <p className="text-ck-texte-2">{ROLE_LABEL[profil.role]} · Central Test Agency</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Compte actif
            </span>
          </div>
        </div>
        <Bouton variante="contour" className="shrink-0 self-start bg-ck-surface sm:self-center" onClick={onModifier}>
          <Icone nom="crayon" taille={16} /> Modifier le profil
        </Bouton>
      </div>
      <div className="relative z-10 mt-6 grid gap-4 border-t border-ck-bordure pt-5 sm:grid-cols-3">
        <Fait icone="mail" libelle="E-mail" valeur={profil.email} />
        <Fait icone="telephone" libelle="Téléphone" valeur={profil.telephone} />
        <Fait icone="lieu" libelle="Ville" valeur={[profil.ville, profil.wilaya].filter(Boolean).join(", ") || null} />
      </div>
      <div className="relative z-10 mt-5">
        <div className="mb-1.5 flex justify-between text-xs font-semibold">
          <span className="text-ck-texte-2">{manquants ? `Fiche complète à ${pourcent} % : il manque ${manquants} information${manquants > 1 ? "s" : ""} pour vos contrats et bulletins.` : "Fiche complète : prête pour vos contrats et bulletins."}</span>
          <span className="text-ck-titre">{pourcent} %</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ck-champ)]" role="progressbar" aria-valuenow={pourcent} aria-valuemin={0} aria-valuemax={100} aria-label="Fiche complète">
          <div className={`h-full rounded-full ${manquants ? "bg-ck-orange" : "bg-emerald-500"}`} style={{ width: `${pourcent}%` }} />
        </div>
      </div>
    </Carte>
  );
}

function Onglets({ actif, onChange, profil }: { actif: Rubrique; onChange: (r: Rubrique) => void; profil: Profil }) {
  return (
    <div role="tablist" aria-label="Rubriques du profil" className="inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-ck-surface p-1.5 shadow-[var(--ck-ombre)]">
      {RUBRIQUES.map((r) => {
        const manque = r.champs.filter((c) => !profil[c]).length;
        const selection = actif === r.cle;
        return (
          <button
            key={r.cle}
            type="button"
            role="tab"
            id={`onglet-${r.cle}`}
            aria-selected={selection}
            aria-controls={`rubrique-${r.cle}`}
            onClick={() => onChange(r.cle)}
            className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${selection ? "bg-[#eef2fb] text-ck-titre" : "text-ck-texte-2 hover:text-ck-titre"}`}
          >
            <Icone nom={r.icone} taille={18} />
            {r.libelle}
            {manque > 0 && (
              <span className="rounded-full bg-ck-orange px-1.5 text-[11px] font-bold text-white" title={`${manque} à compléter`}>
                {manque}
              </span>
            )}
            {selection && <span aria-hidden="true" className="absolute inset-x-4 -bottom-1.5 h-0.5 rounded-full bg-ck-orange" />}
          </button>
        );
      })}
    </div>
  );
}

function FicheCoordonnees({ profil, rubrique, onRubrique, onEnregistre }: { profil: Profil; rubrique: Rubrique; onRubrique: (r: Rubrique) => void; onEnregistre: (p: Profil) => void }) {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const corps = Object.fromEntries([["nom", f.nom], ...CHAMPS.map((k) => [k, (f[k] ?? "").trim()])]);
    setOccupe(true);
    setErreur("");
    setOk(false);
    try {
      await api("profil", { methode: "PATCH", corps });
      const maj = Object.fromEntries(CHAMPS.map((k) => [k, corps[k] || null])) as Coordonnees;
      onEnregistre({ ...profil, ...maj, nom: f.nom!.trim() });
      setOk(true);
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  // Toutes les rubriques restent dans le formulaire (masquées) : un seul enregistrement pour l'ensemble.
  const panneau = (cle: Rubrique, contenu: ReactNode) => (
    <div role="tabpanel" id={`rubrique-${cle}`} aria-labelledby={`onglet-${cle}`} hidden={rubrique !== cle}>
      {contenu}
    </div>
  );

  return (
    <Carte>
      <form
        onSubmit={envoyer}
        // Un champ invalide dans une rubrique masquée : on l'affiche pour que le navigateur puisse le signaler.
        onInvalidCapture={(e) => {
          const panneau = (e.target as HTMLElement).closest<HTMLElement>("[role=tabpanel]");
          const cle = panneau?.id.replace("rubrique-", "") as Rubrique | undefined;
          if (cle && cle !== rubrique) onRubrique(cle);
        }}
        className="grid gap-5"
      >
        {panneau(
          "identite",
          <>
            <EnteteSection icone="profil" titre="Mes informations personnelles" sousTitre="Telles qu'elles figurent sur votre pièce d'identité : elles servent à vos contrats." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ libelle="Prénom et nom" name="nom" required maxLength={120} defaultValue={profil.nom} autoComplete="name" />
              <Champ libelle="Date de naissance" name="date_naissance" type="date" defaultValue={profil.date_naissance ?? ""} autoComplete="bday" max={new Date().toISOString().slice(0, 10)} />
              <Champ libelle="Lieu de naissance" name="lieu_naissance" maxLength={120} defaultValue={profil.lieu_naissance ?? ""} placeholder="Commune et wilaya" />
              <Champ libelle="Nationalité" name="nationalite" maxLength={60} defaultValue={profil.nationalite ?? ""} placeholder="Algérienne" list="liste-nationalites" />
              <Champ libelle="NIN" name="nin" icone="identite" inputMode="numeric" maxLength={30} defaultValue={profil.nin ?? ""} placeholder="18 chiffres" pattern="[0-9 ]{18,30}" title="18 chiffres" aide="Au dos de la carte d'identité biométrique." />
              <Champ libelle="Téléphone" name="telephone" icone="telephone" type="tel" maxLength={30} defaultValue={profil.telephone ?? ""} autoComplete="tel" placeholder="0550 12 34 56" />
              <Champ libelle="Adresse e-mail" name="email" icone="mail" type="email" defaultValue={profil.email} readOnly aide="Votre identifiant de connexion." className="sm:col-span-2" />
            </div>
            <datalist id="liste-nationalites">
              <option value="Algérienne" />
            </datalist>
          </>,
        )}
        {panneau(
          "adresse",
          <>
            <EnteteSection icone="lieu" titre="Mon adresse" sousTitre="Votre adresse de résidence." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ libelle="Adresse" name="adresse" maxLength={300} defaultValue={profil.adresse ?? ""} autoComplete="street-address" placeholder="12 rue Didouche Mourad" className="sm:col-span-2" />
              <Champ libelle="Ville" name="ville" icone="batiment" maxLength={120} defaultValue={profil.ville ?? ""} autoComplete="address-level2" placeholder="Alger-Centre" />
              <Champ libelle="Wilaya" name="wilaya" icone="lieu" maxLength={60} defaultValue={profil.wilaya ?? ""} list="liste-wilayas" autoComplete="address-level1" placeholder="Choisir ou saisir" />
            </div>
            <datalist id="liste-wilayas">
              {WILAYAS.map((w, i) => (
                <option key={w} value={w}>{`${String(i + 1).padStart(2, "0")} – ${w}`}</option>
              ))}
            </datalist>
          </>,
        )}
        {panneau(
          "paie",
          <>
            <EnteteSection icone="banque" titre="Paie" sousTitre="Reprises sur vos bulletins de salaire." />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="situation" className="mb-1.5 block text-sm font-semibold text-ck-titre">
                  Situation familiale
                </label>
                <select id="situation" name="situation_familiale" defaultValue={profil.situation_familiale ?? ""} className={classeChamp}>
                  <option value="">Choisir…</option>
                  {Object.entries(SITUATIONS).map(([code, libelle]) => (
                    <option key={code} value={code}>
                      {libelle}
                    </option>
                  ))}
                </select>
              </div>
              <Champ libelle="N° de sécurité sociale" name="numero_ss" icone="identite" inputMode="numeric" maxLength={30} defaultValue={profil.numero_ss ?? ""} placeholder="1234567890 12" />
              <Champ libelle="N° de compte bancaire (RIP ou RIB)" name="numero_compte" icone="banque" inputMode="numeric" maxLength={40} defaultValue={profil.numero_compte ?? ""} aide="Compte sur lequel votre salaire est versé." className="sm:col-span-2" />
            </div>
          </>,
        )}
        {erreur && <Erreur>{erreur}</Erreur>}
        {ok && <Succes>Informations enregistrées.</Succes>}
        <div className="flex flex-wrap items-center gap-3 border-t border-ck-bordure pt-5">
          <Bouton type="submit" disabled={occupe}>
            {occupe ? "Enregistrement…" : "Enregistrer"}
          </Bouton>
          <span className="text-xs text-ck-texte-2">Enregistre les trois rubriques en une fois.</span>
        </div>
      </form>
    </Carte>
  );
}

function MotDePasse() {
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ok, setOk] = useState(false);
  const [visible, setVisible] = useState(false);

  async function envoyer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setErreur("");
    setOk(false);
    if (f.nouveau !== f.confirmation) return setErreur("Les deux mots de passe ne correspondent pas.");
    setOccupe(true);
    try {
      await api("profil/mot-de-passe", { corps: { actuel: f.actuel, nouveau: f.nouveau } });
      form.reset();
      setOk(true);
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const sombre = "w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-white placeholder:text-white/50 focus:border-ck-orange focus:outline-none focus:ring-2 focus:ring-[#dc5a2e]/30";
  const champ = (libelle: string, name: string, autoComplete: string) => (
    <label className="grid gap-1.5 text-sm font-semibold text-white/90">
      {libelle}
      <input name={name} type={visible ? "text" : "password"} required minLength={name === "actuel" ? undefined : MOT_DE_PASSE_MIN} autoComplete={autoComplete} className={sombre} />
    </label>
  );

  return (
    <section aria-labelledby="titre-mdp" className="ck-sidebar relative overflow-hidden rounded-[20px] p-6 text-white shadow-[var(--ck-ombre)]">
      <Icone nom="bouclier" taille={140} className="pointer-events-none absolute -bottom-8 -right-8 text-white/[0.06]" />
      <EnteteSection id="titre-mdp" icone="cadenas" titre="Mot de passe" sousTitre={`Au moins ${MOT_DE_PASSE_MIN} caractères. Vos autres sessions seront fermées.`} sombre />
      <form onSubmit={envoyer} className="relative grid gap-3.5">
        {champ("Mot de passe actuel", "actuel", "current-password")}
        {champ("Nouveau mot de passe", "nouveau", "new-password")}
        {champ("Confirmation", "confirmation", "new-password")}
        <label className="flex items-center gap-2 text-xs text-white/70">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-[#dc5a2e]" />
          Afficher les mots de passe
        </label>
        {erreur && <Erreur>{erreur}</Erreur>}
        {ok && <p role="status" className="text-sm font-semibold text-emerald-300">Mot de passe modifié. Vos autres sessions ont été fermées.</p>}
        <button type="submit" disabled={occupe} className="inline-flex items-center justify-center gap-2 justify-self-start rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ck-titre transition hover:bg-white/90 disabled:opacity-50">
          <Icone nom="cadenas" taille={16} />
          {occupe ? "Modification…" : "Changer le mot de passe"}
        </button>
      </form>
    </section>
  );
}
