-- Espace client Central Test Agency
-- Idempotent : peut être rejoué sans casser les données existantes.

CREATE TABLE IF NOT EXISTS users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name          text NOT NULL,
  company       text,
  phone         text,
  role          text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Modèles de questionnaires. `schema` décrit les sections et questions (voir db/questionnaires/*.json).
CREATE TABLE IF NOT EXISTS questionnaires (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text,
  schema      jsonb NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Un questionnaire envoyé à un client, avec ses réponses.
-- `questionnaire_snapshot` fige la version envoyée : modifier le modèle plus tard ne change pas ce que le client a reçu.
CREATE TABLE IF NOT EXISTS assignments (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questionnaire_id       uuid NOT NULL REFERENCES questionnaires(id),
  questionnaire_snapshot jsonb NOT NULL,
  title                  text NOT NULL,
  message                text,
  status                 text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'in_progress', 'submitted')),
  answers                jsonb NOT NULL DEFAULT '{}'::jsonb,
  sent_at                timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  submitted_at           timestamptz
);

CREATE INDEX IF NOT EXISTS assignments_user_id_idx ON assignments(user_id);
