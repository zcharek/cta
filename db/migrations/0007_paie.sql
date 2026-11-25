-- Bulletins de paie : informations du salarié et bulletins émis (copie figée de ce qui est imprimé).

-- Renseignées par le salarié dans « Mon profil »
ALTER TABLE profils ADD COLUMN situation_familiale text CHECK (situation_familiale IN ('C', 'M', 'D', 'V'));
ALTER TABLE profils ADD COLUMN numero_ss text;      -- N° de sécurité sociale
ALTER TABLE profils ADD COLUMN numero_compte text;  -- compte bancaire / CCP du virement du salaire

-- Renseignées par l'employeur à la première génération d'un bulletin, puis reprises
ALTER TABLE profils ADD COLUMN matricule text UNIQUE;
ALTER TABLE profils ADD COLUMN fonction text;
ALTER TABLE profils ADD COLUMN affectation text;
ALTER TABLE profils ADD COLUMN date_entree date;
ALTER TABLE profils ADD COLUMN salaire_net numeric(12,2) CHECK (salaire_net > 0);

CREATE TABLE bulletins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id   uuid NOT NULL REFERENCES profils(id),
  mois        text NOT NULL CHECK (mois ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  brut        numeric(12,2) NOT NULL,
  retenue_ss  numeric(12,2) NOT NULL,
  irg         numeric(12,2) NOT NULL,
  net         numeric(12,2) NOT NULL,
  donnees     jsonb NOT NULL,
  cree_par    uuid REFERENCES profils(id),
  cree_le     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (profil_id, mois)   -- regénérer un mois remplace son bulletin
);

-- N° adhérent CNAS de l'employeur : demandé à la première génération d'un bulletin.
UPDATE parametres SET valeur = valeur || '{"numero_adherent": null}'::jsonb
WHERE cle = 'entreprise' AND NOT valeur ? 'numero_adherent';
