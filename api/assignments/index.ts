import { handler, json, readBody, requireAdmin, requireUser, sql, uuid } from "../_lib/http.js";

// GET : le client voit ses questionnaires ; l'admin peut filtrer par client (?userId=).
export const GET = handler(async (req) => {
  const s = await requireUser(req);
  const param = new URL(req.url).searchParams.get("userId");
  const userId = s.role === "admin" && param ? uuid(param, "Client") : s.id;
  const rows = await sql`
    SELECT id, title, message, status, sent_at, updated_at, submitted_at
    FROM assignments WHERE user_id = ${userId} ORDER BY sent_at DESC`;
  return json({ assignments: rows });
});

// POST (admin) : envoie un questionnaire à un client.
export const POST = handler(async (req) => {
  await requireAdmin(req);
  const b = await readBody<{ userId?: string; questionnaireId?: string; message?: string }>(req);
  const userId = uuid(b.userId, "Client");
  const questionnaireId = uuid(b.questionnaireId, "Questionnaire");

  const rows = await sql`
    INSERT INTO assignments (user_id, questionnaire_id, questionnaire_snapshot, title, message)
    SELECT u.id, q.id, jsonb_build_object('description', q.description) || q.schema, q.title, ${b.message?.trim().slice(0, 2000) || null}
    FROM users u, questionnaires q
    WHERE u.id = ${userId} AND q.id = ${questionnaireId}
    RETURNING id`;
  if (!rows.length) return json({ error: "Client ou questionnaire introuvable." }, { status: 404 });
  return json({ id: rows[0].id }, { status: 201 });
});
