-- Cockpit, phase 1 : utilisateurs, accès, suivi des temps et prospection.
-- Appliquée une seule fois par scripts/db-setup.mjs (table schema_migrations).

-- Collaborateurs de CTA (distincts des comptes de l'espace client, table users).
CREATE TABLE profils (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom                text NOT NULL,
  email              text NOT NULL UNIQUE,
  role               text NOT NULL CHECK (role IN ('collaborateur', 'assistant', 'qa_manager', 'cofounder')),
  actif              boolean NOT NULL DEFAULT true,
  mot_de_passe_hash  text,
  mot_de_passe_le    timestamptz,
  version_session    integer NOT NULL DEFAULT 0, -- incrémentée à chaque changement de mot de passe : invalide les anciennes sessions
  invite_le          timestamptz NOT NULL DEFAULT now(),
  active_le          timestamptz,
  cree_le            timestamptz NOT NULL DEFAULT now(),
  CHECK (email = lower(email))
);

-- Liens d'invitation et de réinitialisation. Seule l'empreinte SHA-256 du jeton est stockée.
CREATE TABLE jetons (
  empreinte  text PRIMARY KEY,
  profil_id  uuid NOT NULL REFERENCES profils(id) ON DELETE CASCADE,
  type       text NOT NULL CHECK (type IN ('invitation', 'reinitialisation')),
  expire_le  timestamptz NOT NULL,
  utilise_le timestamptz,
  cree_le    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX jetons_profil_idx ON jetons(profil_id);

CREATE TABLE clients (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom      text NOT NULL,
  tjm_dzd  integer NOT NULL DEFAULT 0 CHECK (tjm_dzd >= 0),
  actif    boolean NOT NULL DEFAULT true,
  cree_le  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE affectations (
  profil_id uuid NOT NULL REFERENCES profils(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  PRIMARY KEY (profil_id, client_id)
);

CREATE TABLE semaines (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profil_id   uuid NOT NULL REFERENCES profils(id) ON DELETE CASCADE,
  lundi       date NOT NULL CHECK (extract(isodow FROM lundi) = 1),
  statut      text NOT NULL DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'soumise', 'validee')),
  soumise_le  timestamptz,
  validee_le  timestamptz,
  validee_par uuid REFERENCES profils(id),
  UNIQUE (profil_id, lundi)
);

CREATE TABLE temps (
  semaine_id uuid NOT NULL REFERENCES semaines(id) ON DELETE CASCADE,
  client_id  uuid NOT NULL REFERENCES clients(id),
  jour       date NOT NULL,
  valeur     numeric(2,1) NOT NULL CHECK (valeur IN (0.5, 1)),
  PRIMARY KEY (semaine_id, client_id, jour)
);

CREATE TABLE cabinets (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cle               text NOT NULL UNIQUE,
  numero            text,
  nom               text NOT NULL,
  commune           text,
  veterinaire       text,
  type              text,
  adresse           text,
  adresse2          text,
  telephone         text,
  telephone2        text,
  email             text,
  site              text,
  facebook          text,
  instagram         text,
  tiktok            text,
  lat               double precision,
  lng               double precision,
  lien_carte        text,
  horaires          text,
  urgences          text,
  note_google       text,
  etat_google       text,
  sources           text,
  segment           text,
  semaine_plan      text,
  canal1            text,
  contact_canal1    text,
  canal_relance     text,
  contact_relance   text,
  message           text,
  ensuite           text,
  statut            text NOT NULL DEFAULT 'a_contacter' CHECK (statut IN (
                      'a_contacter', 'message_envoye', 'relance', 'en_discussion',
                      'demo_planifiee', 'client_signe', 'pas_interesse', 'hors_cible')),
  raison_hors_cible text,
  premier_contact   date,
  relance_le        date,
  demo_le           date,
  notes             text,
  extra             jsonb NOT NULL DEFAULT '{}'::jsonb,
  cree_le           timestamptz NOT NULL DEFAULT now(),
  maj_le            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cabinets_statut_idx ON cabinets(statut);
CREATE INDEX cabinets_relance_idx ON cabinets(relance_le);

CREATE TABLE historique_cabinet (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cabinet_id uuid NOT NULL REFERENCES cabinets(id) ON DELETE CASCADE,
  le         timestamptz NOT NULL DEFAULT now(),
  auteur_id  uuid REFERENCES profils(id) ON DELETE SET NULL,
  statut     text,
  action     text NOT NULL,
  note       text
);
CREATE INDEX historique_cabinet_idx ON historique_cabinet(cabinet_id, le DESC);

CREATE TABLE parametres (
  cle    text PRIMARY KEY,
  valeur jsonb NOT NULL
);

INSERT INTO parametres (cle, valeur) VALUES (
  'modele_whatsapp',
  to_jsonb('Bonjour {veterinaire}, je me permets de vous contacter au sujet du cabinet {cabinet}. Nous avons conçu VetCare, une application qui simplifie la gestion des rendez-vous et le suivi des patients. Seriez-vous disponible pour une courte démonstration ?'::text)
);
