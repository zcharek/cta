-- Attestation et certificat de travail : civilité (accords « né / née ») et date de sortie (certificat).
ALTER TABLE profils ADD COLUMN civilite text CHECK (civilite IN ('M', 'Mme'));
ALTER TABLE profils ADD COLUMN date_sortie date;
