# Central Test Agency

Ce dépôt contient trois choses, servies par un seul projet Vercel :

| Partie | Adresse | Code |
| --- | --- | --- |
| Site vitrine | `/` | `client/src/pages` |
| Espace client (questionnaires de cadrage) | `/#/espace`, `/#/admin` | `client/src/portal`, `api/auth`, `api/assignments`, `api/admin` |
| **Cockpit**, l'outil interne (prospection VetCare et suivi des temps) | `/cockpit` | `client/cockpit`, `api/cockpit.ts`, `api/_lib/cockpit` |

Stack : Vite + React + TypeScript + Tailwind pour l'interface, fonctions serverless Vercel pour l'API, Postgres chez Neon, authentification maison (bcrypt + JWT en cookie HttpOnly), e-mails par Resend.

## Installation

```bash
npm install
cp .env.example .env      # puis remplir les valeurs
npm run db:setup          # tables, migrations Cockpit, questionnaires
npm run cockpit:seed      # premier compte Co-Founder de Cockpit
npm run dev:full          # site + API en local (vercel dev), sur http://localhost:3000
```

`npm run dev` lance seulement l'interface (sans API) ; utilisez `npm run dev:full` pour tester Cockpit.

### Essayer Cockpit sans base de données

```bash
npm run dev:demo          # http://localhost:5199/cockpit/
```

Lance l'interface et l'API sur un Postgres en mémoire, avec des données d'exemple (collaborateurs, clients, cabinets). Comptes : `admin@cta.test` (Co-Founder) et `yasmine@cta.test` (Collaborateur), mot de passe `demo1234`. Les données disparaissent à l'arrêt ; rien n'est écrit dans Neon.

## Variables d'environnement

Voir `.env.example`. Aucune clé ne doit être commitée : `.env` est ignoré par git.

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Chaîne de connexion Neon |
| `AUTH_SECRET` | Secret de signature des sessions, 32 caractères minimum |
| `APP_URL` | Adresse publique, utilisée dans les liens des e-mails. Obligatoire en production |
| `RESEND_API_KEY`, `EMAIL_FROM` | Envoi des e-mails d'invitation et de réinitialisation |
| `COCKPIT_SEED_EMAIL`, `COCKPIT_SEED_NOM`, `COCKPIT_SEED_MOT_DE_PASSE` | Premier compte Co-Founder (seed) |

## Base de données

- `db/schema.sql` : tables de l'espace client, rejouable sans risque.
- `db/migrations/*.sql` : migrations versionnées de Cockpit. `npm run db:setup` applique, dans l'ordre et dans une transaction, celles qui ne figurent pas encore dans la table `schema_migrations`. **Un changement de schéma = un nouveau fichier**, jamais la modification d'une migration déjà appliquée.

## Cockpit : accès et sécurité

Quatre types d'utilisateur : **Collaborateur** (uniquement sa propre saisie des temps, sur ses clients assignés, sans jamais voir de TJM ni de montant), **Assistant**, **QA Manager** et **Co-Founder** (accès complet).

Le navigateur n'accède jamais directement à la base : toutes les données passent par l'API `/api/cockpit/*`, qui vérifie les droits à chaque requête.

- Le profil est relu en base à chaque appel : archiver un compte ou changer son type prend effet immédiatement, même sur une session ouverte.
- `estAdmin()` (`shared/cockpit.ts`) : profil actif et de type Assistant, QA Manager ou Co-Founder.
- Les règles d'accès (cabinets, TJM, semaines des autres, validation) sont couvertes par `tests/cockpit/acces.test.ts`.
- Les liens d'invitation (7 jours) et de réinitialisation (1 heure) sont à usage unique ; seule leur empreinte SHA-256 est stockée.
- Changer de mot de passe ferme toutes les autres sessions.

### Inviter un collaborateur

1. Dans Cockpit, **Réglages › Clients et collaborateurs › Inviter un collaborateur** : nom, e-mail, type, clients.
2. Le collaborateur reçoit un e-mail et définit son mot de passe sur `/cockpit/definir-mot-de-passe`.
3. Il arrive sur sa saisie (Collaborateur) ou sur l'accueil (autres types). Ensuite il se connecte sur `/cockpit/connexion`.

Sans `RESEND_API_KEY` en local, l'e-mail n'est pas envoyé : le lien s'affiche dans Cockpit et dans la console.

## Cockpit : modules

| Page | Accès | Contenu |
| --- | --- | --- |
| Aujourd'hui | admins | Relances dues, cabinets jamais contactés, semaines à valider, saisies manquantes, prospection, temps du mois |
| Cabinets | admins | Kanban VetCare (glisser-déposer ou menu « Déplacer vers… »), filtres, fiche, WhatsApp, import Excel/CSV |
| Saisie des temps | tous | Grille lundi → vendredi par client ; un Collaborateur ne voit que la sienne, sans TJM |
| Validation | admins | Semaines soumises à valider ou renvoyer, 8 dernières validées |
| Récap mensuel | admins | Jours et montants HT par client et collaborateur, export CSV (UTF-8 avec BOM, « ; », virgule décimale) |
| Clients et collaborateurs | admins | Clients (TJM, équipe), invitations, types, archivage |
| Message WhatsApp | admins | Modèle de message avec aperçu |

Règles métier principales : `shared/prospection.ts` (relances, WhatsApp, recherche, tri), `shared/import.ts` (lecture des fichiers, rapprochement, mise à jour), `shared/cockpit.ts` (temps, récap, CSV).

### Import des cabinets

Le fichier est lu dans le navigateur (SheetJS), comparé par le serveur (prévisualisation : nouveaux, à mettre à jour, identiques), puis écrit par lots de 50. Un réimport ne crée jamais de doublon (clé : nom + commune, sans accents ni ponctuation) et ne modifie jamais le statut, les dates ni l'historique.

Le test de référence (`tests/cockpit/import.test.ts`) attend `fixtures/Veterinaires_Alger.xlsx` : 362 cabinets dont 334 À contacter et 28 Hors cible, 3 doublons fusionnés, 1 ligne de test ignorée. Déposez ce fichier (et son export `fixtures/Veterinaires_Alger.csv`) pour l'activer ; tant qu'il est absent, ce test est ignoré.

## Configurer Resend

1. Créez un compte sur resend.com et ajoutez votre domaine (par exemple `centraltestagency.com`).
2. Ajoutez chez votre registrar les enregistrements DNS (SPF, DKIM) indiqués par Resend, puis attendez la vérification.
3. Créez une clé d'API (« Sending access ») et renseignez `RESEND_API_KEY`.
4. Renseignez `EMAIL_FROM` avec une adresse de ce domaine, par exemple `Cockpit CTA <cockpit@centraltestagency.com>`.

Les modèles d'e-mails (français, couleurs CTA) sont dans `api/_lib/cockpit/emails.ts`.

## Déploiement Vercel

Le projet est déjà relié à Vercel (`vercel.json`). À faire une fois :

1. Dans Vercel › Settings › Environment Variables, ajoutez toutes les variables ci-dessus (avec `APP_URL` = l'adresse de production).
2. `npm run db:setup` avec la `DATABASE_URL` de production, puis `npm run cockpit:seed`.
3. `npm run deploy` (ou un push sur `main` si le déploiement Git est activé).

`vercel.json` réécrit `/cockpit/*` vers la page Cockpit et `/api/cockpit/*` vers une fonction unique (`api/cockpit.ts`), ce qui reste sous la limite de 12 fonctions du plan Hobby.

## Tests

```bash
npm test                          # Vitest : règles métier, règles d'accès, import
npx playwright install chromium   # une fois
npm run test:e2e                  # Playwright : parcours clés dans un vrai navigateur
npx tsc                           # vérification des types
```

Vitest tourne sur un vrai Postgres en mémoire (PGlite) avec les migrations du dépôt ; Playwright démarre le serveur de démonstration. Aucune base ni aucun secret n'est nécessaire. Les deux s'exécutent dans GitHub Actions (`.github/workflows/tests.yml`).
