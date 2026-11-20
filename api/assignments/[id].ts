import { HttpError, handler, json, readBody, requireUser, sql, uuid, type Session } from "../_lib/http.js";

const idFrom = (req: Request) => uuid(new URL(req.url).pathname.split("/").pop(), "Questionnaire");

async function load(id: string, s: Session) {
  const rows = await sql`
    SELECT a.*, u.name AS client_name, u.email AS client_email, u.company AS client_company
    FROM assignments a JOIN users u ON u.id = a.user_id
    WHERE a.id = ${id} AND (a.user_id = ${s.id} OR ${s.role} = 'admin')`;
  if (!rows.length) throw new HttpError(404, "Questionnaire introuvable.");
  return rows[0];
}

export const GET = handler(async (req) => {
  const s = await requireUser(req);
  return json({ assignment: await load(idFrom(req), s) });
});

// PATCH (client propriétaire) : enregistre les réponses ; `submit: true` envoie définitivement.
export const PATCH = handler(async (req) => {
  const s = await requireUser(req);
  const id = idFrom(req);
  const b = await readBody<{ answers?: Record<string, unknown>; submit?: boolean }>(req);
  if (!b.answers || typeof b.answers !== "object" || Array.isArray(b.answers)) throw new HttpError(400, "Réponses invalides.");
  const answers = JSON.stringify(b.answers);
  if (answers.length > 200_000) throw new HttpError(413, "Réponses trop volumineuses.");

  const rows = await sql`
    UPDATE assignments
    SET answers = ${answers}::jsonb,
        status = ${b.submit ? "submitted" : "in_progress"},
        submitted_at = ${b.submit ? new Date().toISOString() : null},
        updated_at = now()
    WHERE id = ${id} AND user_id = ${s.id} AND status <> 'submitted'
    RETURNING id, status, updated_at, submitted_at`;
  if (!rows.length) throw new HttpError(409, "Ce questionnaire a déjà été envoyé et ne peut plus être modifié.");
  return json({ assignment: rows[0] });
});
