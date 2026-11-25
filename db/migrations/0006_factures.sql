-- Factures clients : numérotation annuelle (ex. 011-26), montants figés et copie des données imprimées.

ALTER TABLE clients ADD COLUMN raison_sociale_facture text; -- ex. « SARL Algeria E-Banking Services » (sinon : raison sociale, puis nom)
ALTER TABLE clients ADD COLUMN rc text;
ALTER TABLE clients ADD COLUMN nif text;

CREATE TABLE factures (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annee         integer NOT NULL,
  numero        integer NOT NULL CHECK (numero > 0),
  client_id     uuid NOT NULL REFERENCES clients(id),
  mois          text NOT NULL CHECK (mois ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  date_emission date NOT NULL,
  jours         numeric(6,1) NOT NULL,
  montant_ht    numeric(14,2) NOT NULL,
  montant_tva   numeric(14,2) NOT NULL,
  montant_ttc   numeric(14,2) NOT NULL,
  donnees       jsonb NOT NULL, -- tout ce qui est imprimé, pour retélécharger la facture à l'identique
  cree_par      uuid REFERENCES profils(id),
  cree_le       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (annee, numero)
);
CREATE INDEX factures_client_mois_idx ON factures(client_id, mois);

-- Identité légale imprimée en tête des factures. Les identifiants (RC, NIF, NIS, AI, RIB…) ne sont pas versionnés
-- (dépôt public) : ils se saisissent dans Cockpit, page Factures, carte « Identité de l'entreprise ».
INSERT INTO parametres (cle, valeur) VALUES (
  'entreprise',
  '{"raison_sociale": "SARL CENTRAL TEST APPLICATION", "siege": "", "rc": "", "nif": "", "nis": "", "ai": "", "rib": "", "banque": "", "email": "", "ville": "Alger"}'::jsonb
) ON CONFLICT (cle) DO NOTHING;

-- TVA et dernière facture émise hors Cockpit (pour continuer la numérotation).
-- Dernière facture envoyée avant Cockpit : 012-26 (la suivante sera 013-26).
INSERT INTO parametres (cle, valeur) VALUES ('facturation', '{"tva": 19, "derniere": {"numero": 12, "annee": 2026}}'::jsonb) ON CONFLICT (cle) DO NOTHING;
