-- Prospection VetCare : la personne qui suit un cabinet, et une date de modification fiable pour le rafraîchissement
-- automatique du Kanban (chaque écran ouvert vérifie toutes les quelques secondes si quelque chose a changé).
ALTER TABLE cabinets ADD COLUMN assigne_a uuid REFERENCES profils(id) ON DELETE SET NULL;
CREATE INDEX cabinets_assigne_idx ON cabinets(assigne_a);

CREATE OR REPLACE FUNCTION cabinets_maj_le() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.maj_le := clock_timestamp();
  RETURN NEW;
END $$;
CREATE TRIGGER cabinets_maj_le BEFORE UPDATE ON cabinets FOR EACH ROW EXECUTE FUNCTION cabinets_maj_le();
