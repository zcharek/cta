import { handler, json, requireAdmin, sql } from "../_lib/http.js";

// Tout ce dont la page admin a besoin en un appel : clients (avec l'état de leurs questionnaires) et modèles disponibles.
export const GET = handler(async (req) => {
  await requireAdmin(req);
  const [clients, questionnaires] = await Promise.all([
    sql`
      SELECT u.id, u.name, u.email, u.company, u.phone, u.created_at,
        COALESCE(json_agg(json_build_object('id', a.id, 'title', a.title, 'status', a.status, 'sent_at', a.sent_at, 'submitted_at', a.submitted_at)
          ORDER BY a.sent_at DESC) FILTER (WHERE a.id IS NOT NULL), '[]') AS assignments
      FROM users u LEFT JOIN assignments a ON a.user_id = u.id
      WHERE u.role = 'client'
      GROUP BY u.id ORDER BY u.created_at DESC`,
    sql`SELECT id, slug, title, description FROM questionnaires ORDER BY created_at`,
  ]);
  return json({ clients, questionnaires });
});
