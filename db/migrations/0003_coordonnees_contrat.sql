-- Coordonnées complètes, utiles à la génération de contrats : naissance, ville et wilaya.
ALTER TABLE profils ADD COLUMN date_naissance date;
ALTER TABLE profils ADD COLUMN lieu_naissance text;
ALTER TABLE profils ADD COLUMN ville text;
ALTER TABLE profils ADD COLUMN wilaya text;
