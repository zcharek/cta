-- Fusion de « Clients et questionnaires » dans « Clients » : un compte de l'espace client du site
-- (une personne) peut être rattaché au client (l'entreprise) pour lequel il travaille.
-- Non rattaché = prospect. Supprimer le client détache ses comptes sans les supprimer.
ALTER TABLE users ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES clients(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS users_client_idx ON users(client_id);

-- L'onglet « espace_client » disparaît : son contenu est dans l'onglet « clients ».
-- On le retire des onglets personnalisés sans rien ajouter (pas d'élargissement de droits) :
-- ceux qui avaient l'espace client sans les clients perdent cet accès, à rétablir si besoin dans Collaborateurs.
UPDATE profils SET onglets = array_remove(onglets, 'espace_client') WHERE 'espace_client' = ANY (onglets);
