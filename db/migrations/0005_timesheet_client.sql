-- Timesheet mensuel envoyé au client : identité de facturation, contrat et tarif au forfait.

ALTER TABLE clients ADD COLUMN raison_sociale text;            -- nom affiché sur les documents (sinon : nom)
ALTER TABLE clients ADD COLUMN adresse text;
ALTER TABLE clients ADD COLUMN numero_contrat text;
ALTER TABLE clients ADD COLUMN mission text;                   -- colonne « Projet/Mission » du timesheet
-- Forfait mensuel : tarif journalier de référence = forfait / jours_forfait (ex. 160 000 / 22). NULL = TJM.
ALTER TABLE clients ADD COLUMN forfait_mensuel_dzd integer CHECK (forfait_mensuel_dzd > 0);
ALTER TABLE clients ADD COLUMN jours_forfait integer NOT NULL DEFAULT 22 CHECK (jours_forfait BETWEEN 1 AND 31);

-- Identité légale du prestataire, en tête des timesheets.
INSERT INTO parametres (cle, valeur) VALUES (
  'prestataire',
  '{"nom": "Central Test Application - CTA", "adresse": "N°384 Lotissement Guessas, 1er étage N°2 BIS, Draria, Alger – ALGERIE"}'::jsonb
) ON CONFLICT (cle) DO NOTHING;
