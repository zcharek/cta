-- Type Founder (compte fondateur, unique et non archivable), onglets activables par utilisateur
-- et coordonnées que chacun renseigne dans « Mon profil ».

ALTER TABLE profils DROP CONSTRAINT IF EXISTS profils_role_check;
ALTER TABLE profils ADD CONSTRAINT profils_role_check
  CHECK (role IN ('collaborateur', 'assistant', 'qa_manager', 'cofounder', 'founder'));

-- Onglets choisis pour la personne. NULL = onglets par défaut de son type.
ALTER TABLE profils ADD COLUMN onglets text[];

-- Coordonnées
ALTER TABLE profils ADD COLUMN telephone text;
ALTER TABLE profils ADD COLUMN adresse text;

-- Un seul Founder, toujours actif.
CREATE UNIQUE INDEX profils_un_seul_founder ON profils ((true)) WHERE role = 'founder';
ALTER TABLE profils ADD CONSTRAINT profils_founder_actif CHECK (role <> 'founder' OR actif);

UPDATE profils SET role = 'founder', actif = true, onglets = NULL WHERE email = 'centraltestagency@gmail.com';
UPDATE users SET role = 'admin' WHERE email = 'centraltestagency@gmail.com';
