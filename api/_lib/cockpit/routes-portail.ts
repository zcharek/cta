import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { exigerAdmin } from "./session.js";

// Espace client (portail public des prospects et clients) piloté depuis Cockpit : comptes, questionnaires envoyés, réponses.
// Mêmes tables que l'espace client (users, questionnaires, assignments) ; réservé aux admins de Cockpit.
export function routesPortail(r: Routeur) {
  r.ajouter("GET", "portail", async ({ req }) => {
    await exigerAdmin(req);
    const [comptes, questionnaires] = await Promise.all([
      sql`
        SELECT u.id, u.name AS nom, u.email, u.company AS societe, u.phone AS telephone, u.created_at::text AS inscrit_le,
          COALESCE(json_agg(json_build_object('id', a.id, 'titre', a.title, 'statut', a.status, 'envoye_le', a.sent_at, 'repondu_le', a.submitted_at)
            ORDER BY a.sent_at DESC) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS envois
        FROM users u LEFT JOIN assignments a ON a.user_id = u.id
        WHERE u.role = 'client'
        GROUP BY u.id ORDER BY u.created_at DESC`,
      sql`SELECT id, slug, title AS titre, description FROM questionnaires ORDER BY created_at`,
    ]);
    return json({ comptes, questionnaires });
  });

  r.ajouter("POST", "portail/envois", async ({ req }) => {
    await exigerAdmin(req);
    const b = await readBody<{ compteId?: unknown; questionnaireId?: unknown; message?: unknown }>(req);
    const compteId = uuid(b.compteId, "Compte client");
    const questionnaireId = uuid(b.questionnaireId, "Questionnaire");
    const message = typeof b.message === "string" && b.message.trim() ? b.message.trim().slice(0, 2000) : null;
    const rows = await sql`
      INSERT INTO assignments (user_id, questionnaire_id, questionnaire_snapshot, title, message)
      SELECT u.id, q.id, jsonb_build_object('description', q.description) || q.schema, q.title, ${message}
      FROM users u, questionnaires q
      WHERE u.id = ${compteId} AND u.role = 'client' AND q.id = ${questionnaireId}
      RETURNING id`;
    if (!rows.length) throw new HttpError(404, "Compte client ou questionnaire introuvable.");
    return json({ id: rows[0]!.id }, { status: 201 });
  });

  r.ajouter("GET", "portail/envois/:id", async ({ req, params }) => {
    await exigerAdmin(req);
    const id = uuid(params.id, "Questionnaire");
    const [envoi] = await sql`
      SELECT a.id, a.title AS titre, a.message, a.status AS statut, a.sent_at::text AS envoye_le, a.submitted_at::text AS repondu_le,
        a.updated_at::text AS maj_le, a.questionnaire_snapshot AS questionnaire, a.answers AS reponses,
        u.id AS compte_id, u.name AS nom, u.email, u.company AS societe
      FROM assignments a JOIN users u ON u.id = a.user_id
      WHERE a.id = ${id}`;
    if (!envoi) throw new HttpError(404, "Questionnaire introuvable.");
    return json({ envoi });
  });
}
