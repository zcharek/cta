-- Limitation des tentatives (connexion, mot de passe oublié, inscription) : une ligne par tentative comptée.
-- La clé combine l'action et l'e-mail ou l'adresse IP, par exemple « connexion:ip:203.0.113.4 ».
CREATE TABLE tentatives (
  cle text NOT NULL,
  le  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX tentatives_cle_idx ON tentatives(cle, le DESC);
CREATE INDEX tentatives_le_idx ON tentatives(le);

-- Espace client : la déconnexion invalide le jeton de session (jusqu'ici seul le cookie était effacé).
ALTER TABLE users ADD COLUMN IF NOT EXISTS version_session integer NOT NULL DEFAULT 0;
