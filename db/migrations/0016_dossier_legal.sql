-- Dossier légal de CTA : chaque fichier peut occuper une « pièce » attendue (registre de commerce, NIF, attestation CNAS…).
-- La version actuelle d'une pièce est la dernière de sa chaîne de versions (precedent_id), comme pour les autres documents.
ALTER TABLE documents ADD COLUMN piece text CHECK (piece IN ('registre_commerce', 'nif', 'nis', 'article_imposition', 'statuts', 'rib', 'cnas', 'casnos', 'extrait_role'));
CREATE INDEX documents_piece_idx ON documents(piece) WHERE piece IS NOT NULL;
