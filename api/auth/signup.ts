import bcrypt from "bcryptjs";
import { HttpError, handler, isAdminEmail, json, readBody, sessionCookie, sql, type Session } from "../_lib/http.js";

type Body = { email?: string; password?: string; name?: string; company?: string; phone?: string };

export const POST = handler(async (req) => {
  const b = await readBody<Body>(req);
  const email = b.email?.trim().toLowerCase() ?? "";
  const name = b.name?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Adresse email invalide.");
  if (!name) throw new HttpError(400, "Merci d'indiquer votre nom.");
  if (!b.password || b.password.length < 8) throw new HttpError(400, "Le mot de passe doit faire au moins 8 caractères.");

  const hash = await bcrypt.hash(b.password, 10);
  const role = isAdminEmail(email) ? "admin" : "client";
  const rows = await sql`
    INSERT INTO users (email, password_hash, name, company, phone, role)
    VALUES (${email}, ${hash}, ${name.slice(0, 120)}, ${b.company?.trim().slice(0, 120) || null}, ${b.phone?.trim().slice(0, 40) || null}, ${role})
    ON CONFLICT (email) DO NOTHING
    RETURNING id, email, role`;
  if (!rows.length) throw new HttpError(409, "Un compte existe déjà avec cet email. Connectez-vous.");

  const user = rows[0] as Session;
  return json({ user }, { status: 201, headers: { "Set-Cookie": await sessionCookie(user) } });
});
