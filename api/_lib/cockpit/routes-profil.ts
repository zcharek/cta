import bcrypt from "bcryptjs";
import { MOT_DE_PASSE_MIN, aujourdhui, normaliserNin } from "../../../shared/cockpit.js";
import { HttpError, json, readBody } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { cookieSession, exigerProfil } from "./session.js";
import { texte } from "./valider.js";

/** Champ facultatif : texte nettoyé, ou null s'il est vide. */
function facultatif(v: unknown, quoi: string, max: number): string | null {
  if (v === null || v === undefined || (typeof v === "string" && !v.trim())) return null;
  if (typeof v !== "string") throw new HttpError(400, `${quoi} invalide.`);
  const s = v.trim();
  if (s.length > max) throw new HttpError(400, `${quoi} : ${max} caractères maximum.`);
  return s;
}

function telephone(v: unknown): string | null {
  const t = facultatif(v, "Téléphone", 30);
  if (t && !/^\+?[0-9 .()-]{6,30}$/.test(t)) throw new HttpError(400, "Téléphone invalide : chiffres, espaces et + uniquement.");
  return t;
}

/** Date de naissance au format aaaa-mm-jj, d'une personne de 16 à 100 ans. */
function dateNaissance(v: unknown): string | null {
  const d = facultatif(v, "Date de naissance", 10);
  if (!d) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d);
  const date = m ? new Date(`${d}T12:00:00Z`) : null;
  if (!m || !date || isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== d) throw new HttpError(400, "Date de naissance invalide.");
  const annee = Number(aujourdhui().slice(0, 4));
  const age = annee - Number(m[1]);
  if (age < 16 || age > 100) throw new HttpError(400, "Date de naissance invalide : vérifiez l'année.");
  return d;
}

function nin(v: unknown): string | null {
  const t = facultatif(v, "NIN", 40);
  if (!t) return null;
  const n = normaliserNin(t);
  if (!n) throw new HttpError(400, "NIN invalide : 18 chiffres attendus.");
  return n;
}

// « Mon profil » : chacun consulte et modifie ses propres coordonnées et son mot de passe.
// Le type, les onglets et l'e-mail (identifiant de connexion) restent gérés dans Collaborateurs.
export function routesProfil(r: Routeur) {
  r.ajouter("GET", "profil", async ({ req }) => {
    const moi = await exigerProfil(req);
    const [p] = await sql`
      SELECT nom, email, role, matricule, date_entree::text AS date_entree, date_naissance::text AS date_naissance, lieu_naissance, nationalite, nin, telephone, adresse, ville, wilaya, situation_familiale, numero_ss, numero_compte,
        mot_de_passe_le::text AS mot_de_passe_le
      FROM profils WHERE id = ${moi.id}`;
    return json({ profil: p });
  });

  r.ajouter("PATCH", "profil", async ({ req }) => {
    const moi = await exigerProfil(req);
    const b = await readBody<Record<string, unknown>>(req);
    const nom = b.nom === undefined ? null : texte(b.nom, "Prénom et nom");
    // undefined = champ non envoyé (inchangé) ; null = champ vidé.
    const lire = <T,>(cle: string, f: (v: unknown) => T) => (b[cle] === undefined ? undefined : f(b[cle]));
    const maj = {
      date_naissance: lire("date_naissance", dateNaissance),
      lieu_naissance: lire("lieu_naissance", (v) => facultatif(v, "Lieu de naissance", 120)),
      nationalite: lire("nationalite", (v) => facultatif(v, "Nationalité", 60)),
      nin: lire("nin", nin),
      telephone: lire("telephone", telephone),
      adresse: lire("adresse", (v) => facultatif(v, "Adresse", 300)),
      ville: lire("ville", (v) => facultatif(v, "Ville", 120)),
      wilaya: lire("wilaya", (v) => facultatif(v, "Wilaya", 60)),
      situation_familiale: lire("situation_familiale", (v) => {
        const s = facultatif(v, "Situation familiale", 1);
        if (s && !["C", "M", "D", "V"].includes(s)) throw new HttpError(400, "Situation familiale invalide.");
        return s;
      }),
      numero_ss: lire("numero_ss", (v) => {
        const s = facultatif(v, "N° de sécurité sociale", 30);
        if (s && !/^[0-9 ]{8,30}$/.test(s)) throw new HttpError(400, "N° de sécurité sociale invalide : chiffres uniquement.");
        return s;
      }),
      numero_compte: lire("numero_compte", (v) => {
        const s = facultatif(v, "N° de compte", 40);
        if (s && !/^[0-9 ]{8,40}$/.test(s)) throw new HttpError(400, "N° de compte invalide : chiffres uniquement (RIP ou RIB).");
        return s;
      }),
    };
    const change = (k: keyof typeof maj) => maj[k] !== undefined;
    await sql`
      UPDATE profils SET
        nom = COALESCE(${nom}, nom),
        date_naissance = CASE WHEN ${change("date_naissance")}::boolean THEN ${maj.date_naissance ?? null}::date ELSE date_naissance END,
        lieu_naissance = CASE WHEN ${change("lieu_naissance")}::boolean THEN ${maj.lieu_naissance ?? null} ELSE lieu_naissance END,
        nationalite = CASE WHEN ${change("nationalite")}::boolean THEN ${maj.nationalite ?? null} ELSE nationalite END,
        nin = CASE WHEN ${change("nin")}::boolean THEN ${maj.nin ?? null} ELSE nin END,
        telephone = CASE WHEN ${change("telephone")}::boolean THEN ${maj.telephone ?? null} ELSE telephone END,
        adresse = CASE WHEN ${change("adresse")}::boolean THEN ${maj.adresse ?? null} ELSE adresse END,
        ville = CASE WHEN ${change("ville")}::boolean THEN ${maj.ville ?? null} ELSE ville END,
        wilaya = CASE WHEN ${change("wilaya")}::boolean THEN ${maj.wilaya ?? null} ELSE wilaya END,
        situation_familiale = CASE WHEN ${change("situation_familiale")}::boolean THEN ${maj.situation_familiale ?? null} ELSE situation_familiale END,
        numero_ss = CASE WHEN ${change("numero_ss")}::boolean THEN ${maj.numero_ss ?? null} ELSE numero_ss END,
        numero_compte = CASE WHEN ${change("numero_compte")}::boolean THEN ${maj.numero_compte ?? null} ELSE numero_compte END
      WHERE id = ${moi.id}`;
    return json({ ok: true });
  });

  r.ajouter("POST", "profil/mot-de-passe", async ({ req }) => {
    const moi = await exigerProfil(req);
    const b = await readBody<{ actuel?: unknown; nouveau?: unknown }>(req);
    const actuel = typeof b.actuel === "string" ? b.actuel : "";
    const nouveau = typeof b.nouveau === "string" ? b.nouveau : "";
    if (nouveau.length < MOT_DE_PASSE_MIN) throw new HttpError(400, `Le nouveau mot de passe doit faire au moins ${MOT_DE_PASSE_MIN} caractères.`);
    if (nouveau.length > 200) throw new HttpError(400, "Mot de passe trop long.");
    const [p] = await sql`SELECT mot_de_passe_hash FROM profils WHERE id = ${moi.id}`;
    if (!p?.mot_de_passe_hash || !(await bcrypt.compare(actuel, p.mot_de_passe_hash))) throw new HttpError(400, "Mot de passe actuel incorrect.");
    const [maj] = await sql`
      UPDATE profils SET mot_de_passe_hash = ${await bcrypt.hash(nouveau, 10)}, mot_de_passe_le = now(), version_session = version_session + 1
      WHERE id = ${moi.id} RETURNING version_session`;
    // Les autres sessions sont fermées ; celle-ci reçoit un nouveau cookie.
    return json({ ok: true }, { headers: { "Set-Cookie": await cookieSession(moi.id, maj!.version_session) } });
  });
}
