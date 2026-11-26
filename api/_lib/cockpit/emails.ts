import { HttpError } from "../web.js";

export type Email = { a: string; sujet: string; html: string; texte: string };
export type Envoyeur = (e: Email) => Promise<void>;

const enProduction = () => process.env.VERCEL_ENV === "production";
/** Déploiement accessible en ligne (production ou preview), par opposition au poste de développement. */
const enLigne = () => process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview";

/** Envoi par l'API Resend. EMAIL_REPLY_TO (facultatif) reçoit les réponses des destinataires. */
export async function envoyerParResend(e: Email) {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    if (enLigne()) throw new HttpError(500, "L'envoi d'e-mails n'est pas configuré (RESEND_API_KEY).");
    console.info(`[cockpit] E-mail non envoyé (RESEND_API_KEY absent) à ${e.a} : ${e.sujet}\n${e.texte}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "Cockpit CTA <cockpit@centraltestagency.com>",
      to: [e.a],
      subject: e.sujet,
      html: e.html,
      text: e.texte,
      ...(process.env.EMAIL_REPLY_TO?.trim() ? { reply_to: process.env.EMAIL_REPLY_TO.trim() } : {}),
    }),
  });
  if (!res.ok) {
    console.error("[cockpit] Resend a refusé l'e-mail", res.status, await res.text().catch(() => ""));
    throw new HttpError(502, "L'e-mail n'a pas pu être envoyé. Réessayez dans un instant.");
  }
}

let envoyeur: Envoyeur = envoyerParResend;

/** Les tests remplacent l'envoi réel par une boîte aux lettres en mémoire. */
export function brancherEnvoyeur(e: Envoyeur | null) {
  envoyeur = e ?? envoyerParResend;
}

export const envoyerEmail = (e: Email) => envoyeur(e);

/** Sans clé Resend sur un poste de développement, l'API renvoie le lien pour tester sans e-mail. Jamais en ligne (preview comprise). */
export const lienVisibleEnReponse = () => !process.env.RESEND_API_KEY && !enLigne();

/** Adresse publique de l'application. En production, jamais déduite de la requête (en-tête Host falsifiable). */
export function urlApplication(req: Request) {
  const configuree = process.env.APP_URL?.replace(/\/$/, "");
  if (configuree) return configuree;
  if (enProduction()) throw new HttpError(500, "APP_URL n'est pas configurée.");
  return new URL(req.url).origin;
}

const echapper = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function gabarit({ titre, intro, bouton, lien, note, produit = "Cockpit" }: { titre: string; intro: string; bouton: string; lien: string; note: string; produit?: string }) {
  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;padding:0;background:#E6F4FC;font-family:Outfit,Segoe UI,Helvetica,Arial,sans-serif;color:#0A1838">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(#E6F4FC,#F6F9FC);padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 18px rgba(7,21,56,.08)">
<tr><td style="background:#071538;padding:20px 28px;color:#FFFFFF;font-size:18px;font-weight:800;letter-spacing:-.01em">
${echapper(produit)} <span style="color:#DC5A2E">·</span> <span style="font-weight:500;opacity:.85">Central Test Agency</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 12px;font-size:22px;font-weight:800;letter-spacing:-.02em;color:#071538">${echapper(titre)}</h1>
<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5B6782">${echapper(intro)}</p>
<a href="${echapper(lien)}" style="display:inline-block;background:#071538;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:10px">${echapper(bouton)}</a>
<p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#5B6782">${echapper(note)}</p>
<p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#5B6782;word-break:break-all">Si le bouton ne fonctionne pas, copiez ce lien :<br><a href="${echapper(lien)}" style="color:#DC5A2E">${echapper(lien)}</a></p>
</td></tr>
<tr><td style="border-top:1px solid #E2E8F1;padding:16px 28px;font-size:12px;color:#5B6782">Designed by <strong style="color:#071538">Central Test Agency</strong></td></tr>
</table></td></tr></table></body></html>`;
  const texte = `${titre}\n\n${intro}\n\n${bouton} : ${lien}\n\n${note}\n\n— Central Test Agency`;
  return { html, texte };
}

export function emailInvitation(a: string, nom: string, invitePar: string, lien: string): Email {
  const { html, texte } = gabarit({
    titre: `Bienvenue sur Cockpit, ${nom.split(/\s+/)[0]}`,
    intro: `${invitePar} vous a créé un accès à Cockpit, l'outil interne de Central Test Agency. Choisissez votre mot de passe pour activer votre compte.`,
    bouton: "Définir mon mot de passe",
    lien,
    note: "Ce lien est valable 7 jours et ne peut servir qu'une fois. Si vous n'attendiez pas cette invitation, ignorez simplement cet e-mail.",
  });
  return { a, sujet: "Votre accès à Cockpit – Central Test Agency", html, texte };
}

export function emailReinitialisation(a: string, lien: string): Email {
  const { html, texte } = gabarit({
    titre: "Réinitialiser votre mot de passe",
    intro: "Vous avez demandé à changer votre mot de passe Cockpit. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.",
    bouton: "Choisir un nouveau mot de passe",
    lien,
    note: "Ce lien est valable 1 heure et ne peut servir qu'une fois. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe actuel reste valable.",
  });
  return { a, sujet: "Réinitialisation de votre mot de passe Cockpit", html, texte };
}

// ——— Espace client du site ———

export function emailVerification(a: string, nom: string, lien: string): Email {
  const { html, texte } = gabarit({
    produit: "Espace client",
    titre: `Confirmez votre adresse, ${nom.split(/\s+/)[0]}`,
    intro: "Vous venez de créer votre espace client Central Test Agency. Confirmez votre adresse e-mail pour y accéder.",
    bouton: "Confirmer mon adresse",
    lien,
    note: "Ce lien est valable 24 heures et ne peut servir qu'une fois. Si vous n'avez pas créé de compte, ignorez simplement cet e-mail.",
  });
  return { a, sujet: "Confirmez votre adresse – Central Test Agency", html, texte };
}

/** Inscription avec une adresse déjà utilisée : on prévient le titulaire au lieu de le dire à l'écran (rien n'est révélé). */
export function emailCompteExistant(a: string, lien: string): Email {
  const { html, texte } = gabarit({
    produit: "Espace client",
    titre: "Vous avez déjà un compte",
    intro: "Quelqu'un (sans doute vous) a essayé de créer un espace client avec cette adresse, mais un compte existe déjà. Connectez-vous avec votre mot de passe habituel.",
    bouton: "Me connecter",
    lien,
    note: "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre compte n'a pas été modifié.",
  });
  return { a, sujet: "Votre espace client Central Test Agency", html, texte };
}
