-- Chaque utilisateur reçoit à la création de son compte un matricule unique (001, 002…), définitif,
-- et une date d'entrée égale au jour de création (modifiable ensuite sur le bulletin de paie).

-- Comptes existants : matricules attribués dans l'ordre de création, à la suite des matricules déjà donnés.
WITH sans AS (
  SELECT id, row_number() OVER (ORDER BY cree_le, id) AS rang FROM profils WHERE matricule IS NULL
), base AS (
  SELECT COALESCE(max(matricule::int), 0) AS max FROM profils WHERE matricule ~ '^[0-9]+$'
)
UPDATE profils p SET matricule = lpad((base.max + sans.rang)::text, 3, '0')
FROM sans, base WHERE p.id = sans.id;

UPDATE profils SET date_entree = (cree_le AT TIME ZONE 'Africa/Algiers')::date WHERE date_entree IS NULL;

CREATE FUNCTION profils_matricule_date_entree() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.matricule IS NULL THEN
    NEW.matricule := lpad((SELECT COALESCE(max(matricule::int), 0) + 1 FROM profils WHERE matricule ~ '^[0-9]+$')::text, 3, '0');
  END IF;
  IF NEW.date_entree IS NULL THEN
    NEW.date_entree := (now() AT TIME ZONE 'Africa/Algiers')::date;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER profils_matricule_date_entree BEFORE INSERT ON profils
  FOR EACH ROW EXECUTE FUNCTION profils_matricule_date_entree();

-- Le matricule ne change plus une fois attribué.
CREATE FUNCTION profils_matricule_fige() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.matricule IS DISTINCT FROM OLD.matricule THEN
    RAISE EXCEPTION 'Le matricule ne peut pas être modifié.' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER profils_matricule_fige BEFORE UPDATE OF matricule ON profils
  FOR EACH ROW EXECUTE FUNCTION profils_matricule_fige();

ALTER TABLE profils ALTER COLUMN matricule SET NOT NULL;
