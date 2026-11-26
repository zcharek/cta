-- Espace client : vérification de l'adresse e-mail à l'inscription.
-- Les comptes existants sont considérés comme vérifiés (ils ont été créés avant cette règle).
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verifie_le timestamptz;
UPDATE users SET email_verifie_le = created_at WHERE email_verifie_le IS NULL;

-- Liens de vérification : seule l'empreinte SHA-256 est stockée, usage unique, 24 heures.
CREATE TABLE verifications_email (
  empreinte  text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expire_le  timestamptz NOT NULL,
  utilise_le timestamptz
);
CREATE INDEX verifications_email_user_idx ON verifications_email(user_id);

-- Journal des accès : qui a changé quoi sur quel compte. Les noms sont copiés pour survivre à une suppression.
CREATE TABLE journal_acces (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  le         timestamptz NOT NULL DEFAULT now(),
  auteur_id  uuid REFERENCES profils(id) ON DELETE SET NULL,
  auteur_nom text,
  cible_id   uuid REFERENCES profils(id) ON DELETE SET NULL,
  cible_nom  text,
  action     text NOT NULL,
  details    jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX journal_acces_le_idx ON journal_acces(le DESC);
CREATE INDEX journal_acces_cible_idx ON journal_acces(cible_id, le DESC);
