-- Nationalité et numéro d'identification nationale (NIN, 18 chiffres), pour les contrats.
ALTER TABLE profils ADD COLUMN nationalite text;
ALTER TABLE profils ADD COLUMN nin text CHECK (nin ~ '^[0-9]{18}$');
