import { useEffect, useState, type FormEvent } from "react";
import { STATUT_CABINET_LABEL, type StatutCabinet } from "../../../../shared/cockpit";
import { COLONNES_KANBAN, COULEUR_STATUT, lienAppelCabinet, lienWhatsApp, messageWhatsApp } from "../../../../shared/prospection";
import { api, type CabinetCarte, type FicheCabinet, type LigneHistorique } from "../api";
import { Bouton, Champ, Chargement, Erreur, IconeWhatsApp, Modale, PanneauLateral, Pastille, ZoneTexte, classeChamp } from "../ui";

const CHAMPS: [keyof FicheCabinet, string, ("date" | "tel" | "email" | "zone")?][] = [
  ["nom", "Nom du cabinet"],
  ["veterinaire", "Vétérinaire(s)"],
  ["commune", "Commune"],
  ["telephone", "Téléphone", "tel"],
  ["telephone2", "Autres téléphones", "tel"],
  ["email", "E-mail", "email"],
  ["segment", "Segment"],
  ["semaine_plan", "Semaine du plan"],
  ["canal1", "Canal 1"],
  ["contact_canal1", "Contact canal 1", "tel"],
  ["canal_relance", "Canal relance"],
  ["contact_relance", "Contact relance", "tel"],
  ["premier_contact", "Premier contact", "date"],
  ["relance_le", "Prochaine relance", "date"],
  ["demo_le", "Date de la démo", "date"],
  ["notes", "Notes", "zone"],
  ["message", "Message personnalisé", "zone"],
  ["ensuite", "Ensuite", "zone"],
];

function Info({ titre, children }: { titre: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 py-1.5 text-sm">
      <dt className="text-ck-texte-2">{titre}</dt>
      <dd className="min-w-0 break-words text-ck-texte">{children}</dd>
    </div>
  );
}

const lienExterne = (url: string | null, texte?: string) =>
  url ? (
    <a href={/^https?:\/\//.test(url) ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-ck-orange-texte underline underline-offset-2">
      {texte ?? url}
    </a>
  ) : null;

const dateHeure = (iso: string) => new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function Fiche({ id, onFermer, onChange, onSupprime }: { id: string; onFermer: () => void; onChange: (c?: Partial<CabinetCarte> & { id: string }) => void; onSupprime: (id: string) => void }) {
  const [fiche, setFiche] = useState<{ cabinet: FicheCabinet; historique: LigneHistorique[]; modele: string } | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState("");
  const [message, setMessage] = useState("");
  const [occupe, setOccupe] = useState(false);
  const [confirmer, setConfirmer] = useState(false);

  const charger = () =>
    api<{ cabinet: FicheCabinet; historique: LigneHistorique[]; modele: string }>(`cabinets/${id}`)
      .then((d) => {
        setFiche(d);
        setForm(Object.fromEntries(CHAMPS.map(([k]) => [k, (d.cabinet[k] as string | null) ?? ""])));
      })
      .catch((e: Error) => setErreur(e.message));

  useEffect(() => {
    void charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const c = fiche?.cabinet;
  const modifs = c ? Object.fromEntries(Object.entries(form).filter(([k, v]) => v !== ((c[k as keyof FicheCabinet] as string | null) ?? ""))) : {};
  const nbModifs = Object.keys(modifs).length;

  async function enregistrer(e: FormEvent) {
    e.preventDefault();
    if (!nbModifs) return;
    setOccupe(true);
    setErreur("");
    try {
      await api(`cabinets/${id}`, { methode: "PATCH", corps: Object.fromEntries(Object.entries(modifs).map(([k, v]) => [k, v.trim() || null])) });
      await charger();
      onChange({ id, ...Object.fromEntries(Object.entries(modifs).map(([k, v]) => [k, v.trim() || null])) });
      setMessage("Fiche enregistrée.");
    } catch (err) {
      setErreur((err as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  async function changerStatut(statut: StatutCabinet) {
    setErreur("");
    try {
      const r = await api<{ cabinet: Partial<CabinetCarte> }>(`cabinets/${id}/statut`, { corps: { statut } });
      await charger();
      onChange({ id, ...r.cabinet });
      setMessage(`Statut : ${STATUT_CABINET_LABEL[statut]}.`);
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  async function whatsapp() {
    try {
      const r = await api<{ cabinet: Partial<CabinetCarte> }>(`cabinets/${id}/whatsapp`, { methode: "POST" });
      await charger();
      onChange({ id, ...r.cabinet });
    } catch (err) {
      setErreur((err as Error).message);
    }
  }

  async function supprimer() {
    setOccupe(true);
    try {
      await api(`cabinets/${id}`, { methode: "DELETE" });
      onSupprime(id);
    } catch (err) {
      setErreur((err as Error).message);
      setOccupe(false);
      setConfirmer(false);
    }
  }

  if (!fiche || !c)
    return (
      <PanneauLateral titre="Fiche cabinet" onFermer={onFermer}>
        {erreur ? <Erreur>{erreur}</Erreur> : <Chargement />}
      </PanneauLateral>
    );

  const wa = lienWhatsApp(c, fiche.modele);
  const appel = lienAppelCabinet(c);
  const extra = Object.entries(c.extra ?? {});

  return (
    <PanneauLateral
      titre={c.nom}
      sousTitre={
        <span className="flex flex-wrap items-center gap-2">
          <Pastille style={{ backgroundColor: `${COULEUR_STATUT[c.statut]}33`, color: "inherit" }}>{STATUT_CABINET_LABEL[c.statut]}</Pastille>
          {c.veterinaire}
          {c.commune ? ` · ${c.commune}` : ""}
        </span>
      }
      onFermer={onFermer}
      pied={
        <>
          <Bouton variante="danger" onClick={() => setConfirmer(true)} disabled={occupe}>
            Supprimer
          </Bouton>
          <span className="flex-1" />
          <Bouton type="submit" form="form-fiche" disabled={occupe || !nbModifs}>
            {nbModifs ? `Enregistrer (${nbModifs})` : "Enregistré"}
          </Bouton>
        </>
      }
    >
      <div className="grid gap-6">
        {erreur && <Erreur>{erreur}</Erreur>}
        {message && !erreur && (
          <p role="status" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {message}
          </p>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label htmlFor="fiche-statut" className="mb-1.5 block text-sm font-semibold text-ck-titre">
              Statut
            </label>
            <select id="fiche-statut" value={c.statut} onChange={(e) => void changerStatut(e.target.value as StatutCabinet)} className={classeChamp}>
              {[...COLONNES_KANBAN, "hors_cible" as const].map((s) => (
                <option key={s} value={s}>
                  {STATUT_CABINET_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" onClick={() => void whatsapp()} className="inline-flex items-center gap-2 rounded-[10px] bg-[#1E8A5A] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90">
              <IconeWhatsApp /> WhatsApp
            </a>
          )}
          {appel && (
            <a href={appel} className="inline-flex items-center rounded-[10px] border-2 border-ck-plein px-4 py-2 text-sm font-bold text-ck-titre">
              Appeler
            </a>
          )}
        </div>
        {c.raison_hors_cible && <p className="text-sm text-ck-texte-2">Hors cible : {c.raison_hors_cible}</p>}

        <form id="form-fiche" onSubmit={enregistrer} className="grid gap-4 sm:grid-cols-2">
          {CHAMPS.map(([k, libelle, type]) =>
            type === "zone" ? (
              <ZoneTexte key={k} className="sm:col-span-2" libelle={libelle} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} rows={k === "message" ? 5 : 3} />
            ) : (
              <Champ key={k} libelle={libelle} type={type ?? "text"} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={k === "nom"} />
            ),
          )}
        </form>

        <section aria-labelledby="titre-message">
          <h3 id="titre-message" className="ck-titre mb-2 text-base">
            Message WhatsApp
          </h3>
          <p className="whitespace-pre-line rounded-xl bg-[#DCF8C6] px-4 py-3 text-sm text-[#0A1838]">{messageWhatsApp(c, fiche.modele)}</p>
          <p className="mt-1 text-xs text-ck-texte-2">{c.message ? "Message personnalisé du cabinet." : "Modèle des réglages (aucun message personnalisé)."}</p>
        </section>

        <section aria-labelledby="titre-annuaire">
          <h3 id="titre-annuaire" className="ck-titre mb-2 text-base">
            Annuaire
          </h3>
          <dl className="divide-y divide-[color:var(--ck-bordure)]">
            <Info titre="Adresse">
              {c.adresse}
              {c.adresse && c.lien_carte ? " · " : ""}
              {lienExterne(c.lien_carte, "Voir sur la carte")}
            </Info>
            <Info titre="Autre adresse">{c.adresse2}</Info>
            <Info titre="Type">{c.type}</Info>
            <Info titre="Horaires">{c.horaires && <span className="whitespace-pre-line">{c.horaires}</span>}</Info>
            <Info titre="Urgences / 24h">{c.urgences}</Info>
            <Info titre="Note Google">{c.note_google}</Info>
            <Info titre="État Google">{c.etat_google}</Info>
            <Info titre="Site web">{lienExterne(c.site)}</Info>
            <Info titre="Facebook">{lienExterne(c.facebook)}</Info>
            <Info titre="Instagram">{lienExterne(c.instagram)}</Info>
            <Info titre="TikTok / WhatsApp">{c.tiktok}</Info>
            <Info titre="Sources">{c.sources}</Info>
            <Info titre="N°">{c.numero}</Info>
            {extra.map(([k, v]) => (
              <Info key={k} titre={k}>
                {/^https?:\/\//.test(v) ? lienExterne(v) : v}
              </Info>
            ))}
          </dl>
        </section>

        <section aria-labelledby="titre-historique">
          <h3 id="titre-historique" className="ck-titre mb-2 text-base">
            Historique
          </h3>
          {fiche.historique.length === 0 ? (
            <p className="text-sm text-ck-texte-2">Aucun événement.</p>
          ) : (
            <ol className="relative ml-1.5 border-l-2 border-ck-bordure">
              {fiche.historique.map((h) => (
                <li key={h.id} className="mb-3 ml-4">
                  <span aria-hidden="true" className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full ring-2 ring-[color:var(--ck-surface)]" style={{ backgroundColor: COULEUR_STATUT[(h.statut as StatutCabinet) ?? "a_contacter"] ?? "#B8C3D6" }} />
                  <p className="text-sm font-semibold text-ck-titre">{h.action}</p>
                  <p className="text-xs text-ck-texte-2">
                    {dateHeure(h.le)}
                    {h.auteur ? ` · ${h.auteur}` : ""}
                  </p>
                  {h.note && <p className="mt-0.5 text-sm text-ck-texte-2">{h.note}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <Modale
        titre="Supprimer ce cabinet ?"
        ouverte={confirmer}
        onFermer={() => setConfirmer(false)}
        pied={
          <>
            <Bouton variante="discret" onClick={() => setConfirmer(false)}>
              Annuler
            </Bouton>
            <Bouton variante="danger" onClick={() => void supprimer()} disabled={occupe}>
              Supprimer définitivement
            </Bouton>
          </>
        }
      >
        <p>
          « {c.nom} » et son historique seront supprimés. Cette action est irréversible. Pour simplement le retirer du Kanban, passez-le plutôt en « Hors cible ».
        </p>
      </Modale>
    </PanneauLateral>
  );
}
