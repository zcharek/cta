-- Coffre de documents : contrats, NDA, documents légaux de CTA, et factures émises avant Cockpit.
-- Les fichiers sont dans Vercel Blob (store privé) ; la base ne garde que leur chemin et leurs informations.

-- Factures importées : le PDF d'origine remplace la copie figée (donnees).
ALTER TABLE factures ADD COLUMN fichier text UNIQUE;
ALTER TABLE factures ALTER COLUMN donnees DROP NOT NULL;
ALTER TABLE factures ALTER COLUMN jours DROP NOT NULL;
ALTER TABLE factures ADD CONSTRAINT factures_contenu CHECK (donnees IS NOT NULL OR fichier IS NOT NULL);

CREATE TABLE documents (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie     text NOT NULL CHECK (categorie IN ('contrat', 'nda', 'bon_commande', 'statuts', 'registre_commerce', 'fiscal', 'social', 'bilan', 'banque', 'autre')),
  titre         text NOT NULL CHECK (length(titre) BETWEEN 1 AND 200),
  client_id     uuid REFERENCES clients(id) ON DELETE SET NULL,
  date_document date,
  expire_le     date,
  fichier       text NOT NULL UNIQUE,
  nom_fichier   text NOT NULL,
  type_mime     text NOT NULL,
  taille        integer NOT NULL CHECK (taille > 0),
  precedent_id  uuid REFERENCES documents(id) ON DELETE SET NULL, -- version remplacée par celle-ci
  ajoute_par    uuid REFERENCES profils(id) ON DELETE SET NULL,
  ajoute_le     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX documents_client_idx ON documents(client_id);
CREATE INDEX documents_precedent_idx ON documents(precedent_id);

-- Qui a ouvert quel document, et quand.
CREATE TABLE documents_consultations (
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  profil_id   uuid REFERENCES profils(id) ON DELETE SET NULL,
  le          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX documents_consultations_idx ON documents_consultations(document_id, le DESC);

-- Nouvel onglet « Documents » : par défaut pour le Founder, les Co-Founders et les Comptables.
-- Ceux dont les onglets sont personnalisés le reçoivent ici.
UPDATE profils SET onglets = array_append(onglets, 'documents')
WHERE onglets IS NOT NULL AND role IN ('cofounder', 'comptable') AND NOT ('documents' = ANY (onglets));
