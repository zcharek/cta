-- Suivi du paiement des factures : envoyée, payée, ou en retard (non payée 30 jours après l'émission).
ALTER TABLE factures ADD COLUMN payee_le date;
