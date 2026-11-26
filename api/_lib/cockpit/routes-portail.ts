import { HttpError, json, readBody, uuid } from "../web.js";
import { sql } from "./db.js";
import type { Routeur } from "./router.js";
import { exigerOnglet } from "./session.js";

// Comptes de l'espace client du site (des personnes : prospects et contacts clients), dans l'onglet Clients de Cockpit.
// Un compte rattaché à un client apparaît dans le dossier de ce client ; sinon c'est un prospect.
// Mêmes tables que l'espace client (users, questionnaires, assignments).
export function routesPortail(r: Routeur) {
  r.ajouter("GET", "portail", async ({ req }) => {
    await exigerOnglet(req, "clients");
    const [comptes, questionnaires, clients] = await Promise.all([
      sql`
        SELECT u.id, u.name AS nom, u.email, u.company AS societe, u.phone AS telephone, u.created_at::text AS inscrit_le,
          u.client_id, c.nom AS client_nom,
          COALESCE(json_agg(json_build_object('id', a.id, 'titre', a.title, 'statut', a.status, 'envoye_le', a.sent_at, 'repondu_le', a.submitted_at)
            ORDER BY a.sent_at DESC) FILTER (WHERE a.id IS NOT NULL), '[]'::json) AS envois
        FROM users u LEFT JOIN assignments a ON a.user_id = u.id LEFT JOIN clients c ON c.id = u.client_id
        WHERE u.role = 'client'
        GROUP BY u.id, c.nom ORDER BY u.created_at DESC`,
      sql`SELECT id, slug, title AS titre, description FROM questionnaires ORDER BY created_at`,
      sql`SELECT id, nom, actif FROM clients ORDER BY actif DESC, nom`,
    ]);
    return json({ comptes, questionnaires, clients });
  });

  // Rattacher un compte à un client existant ({ clientId }), le détacher ({ clientId: null }),
  // ou créer le client à partir de la société saisie à l'inscription ({ creerClient: true }).
  r.ajouter("PATCH", "portail/comptes/:id", async ({ req, params }) => {
    await exigerOnglet(req, "clients");
    const id = uuid(params.id, "Compte client");
    const b = await readBody<{ clientId?: unknown; creerClient?: unknown }>(req);
    const [compte] = await sql`SELECT name, company FROM users WHERE id = ${id} AND role = 'client'`;
    if (!compte) throw new HttpError(404, "Compte client introuvable.");

    let clientId: string | null;
    let cree = false;
    if (b.creerClient === true) {
      const nom = String(compte.company ?? "").trim() || String(compte.name).trim();
      // Un client du même nom est réutilisé plutôt que dupliqué.
      const [existant] = await sql`
        SELECT id FROM clients WHERE lower(nom) = lower(${nom}) OR lower(raison_sociale) = lower(${nom}) ORDER BY actif DESC, cree_le LIMIT 1`;
      if (existant) clientId = existant.id;
      else {
        const [c] = await sql`INSERT INTO clients (nom, raison_sociale) VALUES (${nom.slice(0, 200)}, ${nom.slice(0, 200)}) RETURNING id`;
        clientId = c!.id;
        cree = true;
      }
    } else if (b.clientId === null) {
      clientId = null;
    } else {
      clientId = uuid(b.clientId, "Client");
      const [c] = await sql`SELECT id FROM clients WHERE id = ${clientId}`;
      if (!c) throw new HttpError(404, "Client introuvable.");
    }
    await sql`UPDATE users SET client_id = ${clientId} WHERE id = ${id}`;
    return json({ clientId, clientCree: cree });
  });

  r.ajouter("POST", "portail/envois", async ({ req }) => {
    await exigerOnglet(req, "clients");
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
    await exigerOnglet(req, "clients");
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
