import { useEffect, useState } from "react";
import { messageWhatsApp, numeroWhatsApp, type ContactsCabinet } from "../../../../shared/prospection";
import { api } from "../api";
import { Bouton, Chargement, Erreur, Modale, ZoneTexte, classeChamp } from "../ui";

type Exemple = ContactsCabinet & { id: string };

const EXEMPLE_FICTIF: Exemple = { id: "", nom: "Cabinet Vétérinaire d'Hydra", veterinaire: "Dr Benali", telephone: "0550 12 34 56", contact_canal1: null, contact_relance: null, message: null };

/** Modèle de message WhatsApp, configuré dans une fenêtre ouverte depuis la page Cabinets. */
export default function FenetreMessageWhatsApp({ onFermer, onEnregistre }: { onFermer: () => void; onEnregistre: (modele: string) => void }) {
  const [modele, setModele] = useState<string | null>(null);
  const [enregistre, setEnregistre] = useState("");
  const [exemples, setExemples] = useState<Exemple[]>([]);
  const [choix, setChoix] = useState("");
  const [erreur, setErreur] = useState("");
  const [etat, setEtat] = useState("");

  useEffect(() => {
    api<{ modele: string; exemples: Exemple[] }>("parametres/whatsapp")
      .then((d) => {
        setModele(d.modele);
        setEnregistre(d.modele);
        setExemples(d.exemples);
        setChoix(d.exemples[0]?.id ?? "");
      })
      .catch((e: Error) => setErreur(e.message));
  }, []);

  async function enregistrer() {
    if (modele === null) return;
    setErreur("");
    setEtat("Enregistrement…");
    try {
      const r = await api<{ modele: string }>("parametres/whatsapp", { methode: "PUT", corps: { modele } });
      setEnregistre(r.modele);
      setModele(r.modele);
      setEtat("Modèle enregistré.");
      onEnregistre(r.modele);
    } catch (e) {
      setErreur((e as Error).message);
      setEtat("");
    }
  }

  if (modele === null)
    return (
      <Modale titre="Message WhatsApp" ouverte onFermer={onFermer} large>
        {erreur ? <Erreur>{erreur}</Erreur> : <Chargement />}
      </Modale>
    );

  const exemple = exemples.find((e) => e.id === choix) ?? EXEMPLE_FICTIF;
  // L'aperçu montre le modèle : on ignore volontairement le message personnalisé éventuel du cabinet.
  const rendu = messageWhatsApp({ ...exemple, message: null }, modele);
  const numero = numeroWhatsApp(exemple);
  const heure = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  return (
    <Modale
      titre="Message WhatsApp"
      ouverte
      onFermer={onFermer}
      large
      pied={
        <>
          <span role="status" className="mr-auto text-sm text-ck-texte-2">
            {etat}
          </span>
          {modele !== enregistre && (
            <Bouton variante="discret" onClick={() => setModele(enregistre)}>
              Annuler les modifications
            </Bouton>
          )}
          <Bouton variante="contour" onClick={onFermer}>
            Fermer
          </Bouton>
          <Bouton onClick={() => void enregistrer()} disabled={modele === enregistre || !modele.trim()}>
            Enregistrer
          </Bouton>
        </>
      }
    >
      <p className="mb-5 text-sm text-ck-texte-2">Le modèle utilisé pour les cabinets qui n'ont pas de message personnalisé.</p>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <div>
          <ZoneTexte
            libelle="Modèle de message"
            value={modele}
            rows={10}
            maxLength={3000}
            onChange={(e) => {
              setModele(e.target.value);
              setEtat("");
            }}
            aide="{veterinaire} et {cabinet} sont remplacés par le nom du vétérinaire et celui du cabinet."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {["{veterinaire}", "{cabinet}"].map((v) => (
              <Bouton key={v} variante="discret" className="!px-2.5 !py-1 font-mono text-xs" onClick={() => setModele(`${modele}${modele.endsWith(" ") || !modele ? "" : " "}${v}`)}>
                + {v}
              </Bouton>
            ))}
          </div>
          {erreur && (
            <div className="mt-4">
              <Erreur>{erreur}</Erreur>
            </div>
          )}
        </div>

        <div>
          <div className="mb-4">
            <label htmlFor="exemple" className="mb-1.5 block text-sm font-semibold text-ck-titre">
              Aperçu pour
            </label>
            <select id="exemple" value={choix} onChange={(e) => setChoix(e.target.value)} className={classeChamp}>
              {exemples.length === 0 && <option value="">{EXEMPLE_FICTIF.nom} (exemple)</option>}
              {exemples.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nom}
                  {e.veterinaire ? ` – ${e.veterinaire}` : ""}
                </option>
              ))}
            </select>
          </div>
          {/* Bulle façon WhatsApp */}
          <div className="rounded-2xl bg-[#ECE5DD] p-4 dark:bg-[#0B141A]" aria-label="Aperçu du message">
            <p className="mb-3 text-center text-xs font-semibold text-[#54656F] dark:text-[#8696A0]">
              {exemple.veterinaire ?? exemple.nom} {numero ? `· +${numero}` : "· pas de numéro mobile"}
            </p>
            <div className="relative ml-auto max-w-[85%] rounded-xl rounded-tr-none bg-[#DCF8C6] px-3.5 pb-5 pt-2.5 text-sm text-[#111B21] shadow-sm dark:bg-[#005C4B] dark:text-[#E9EDEF]">
              <p className="whitespace-pre-line break-words">{rendu}</p>
              <span className="absolute bottom-1 right-2.5 text-[10px] text-[#667781] dark:text-[#8696A0]">{heure} ✓✓</span>
            </div>
          </div>
          {exemple.message && <p className="mt-3 text-xs text-ck-texte-2">Ce cabinet a un message personnalisé : c'est lui qui sera envoyé, pas ce modèle.</p>}
        </div>
      </div>
    </Modale>
  );
}
