-- Type Comptable : récap mensuel, factures et bulletins de paie par défaut (onglets modifiables).

ALTER TABLE profils DROP CONSTRAINT IF EXISTS profils_role_check;
ALTER TABLE profils ADD CONSTRAINT profils_role_check
  CHECK (role IN ('collaborateur', 'comptable', 'assistant', 'qa_manager', 'cofounder', 'founder'));
