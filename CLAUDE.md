# CLAUDE.md

Ce fichier donne à Claude Code le contexte complet du projet. Il doit être lu
intégralement avant toute modification de code. Garde-le à jour quand des
décisions changent — c'est la mémoire persistante du projet.

---

## Vue d'ensemble du projet

**Nom** : Cotonou.events
**Pitch** : Plateforme web de découverte d'événements à Cotonou (Bénin), avec
pour fonctionnalité différenciante une alerte WhatsApp hebdomadaire
personnalisée envoyée chaque vendredi à 18h.

**Problème résolu** : les événements à Cotonou sont éparpillés entre Facebook,
groupes WhatsApp privés et sites de médias locaux. Aucun endroit centralisé
n'existe pour les découvrir.

**Utilisateur principal** : habitant de Cotonou, 20-40 ans, utilise Facebook
et WhatsApp quotidiennement, ne va pas installer une nouvelle app mais
s'abonnera à un canal WhatsApp utile.

**Utilisateur secondaire** : organisateurs d'événements (associations, clubs,
hôtels, instituts culturels) qui soumettent leurs événements via un
formulaire.

**Objectif de succès V1 (3 mois)** : 50+ événements publiés, 100+ abonnés
WhatsApp, moins d'1h/semaine d'intervention manuelle de ma part.

---

## État actuel du projet

Le frontend est déjà implémenté avec des données mockées et fonctionnel
visuellement (toutes les interfaces ci-dessous existent en mock). L'étape en
cours est de connecter la partie fonctionnelle réelle : base de données,
automatisation, WhatsApp.

**Prochaines étapes dans l'ordre** :

1. Créer le schéma Supabase et brancher le frontend dessus (remplacer les mocks)
2. Déployer n8n sur Railway
3. Construire le workflow Apify → Supabase
4. Configurer Meta WhatsApp Business API (templates + token)
5. Construire les workflows WhatsApp (digest vendredi + gestion STOP/START)
6. Connecter les formulaires (soumission événement + inscription alertes)
7. Tests end-to-end

Ne pas reconstruire les interfaces déjà faites sans demande explicite — se
concentrer sur la connexion des données réelles.

---

## Périmètre V1 — ce qui est inclus / exclu

### Inclus

- Scraping automatique Facebook Events via Apify (Actor
  `apify/facebook-events-scraper`), exécution nocturne
- Formulaire de soumission d'événement par les organisateurs
- Site web public : liste filtrée, recherche, détail de chaque événement
- Inscription aux alertes WhatsApp (numéro +229 + catégories favorites)
- Envoi hebdomadaire automatique chaque vendredi 18h via WhatsApp (messages
  individuels personnalisés, PAS un canal de diffusion groupé)
- Gestion des réponses STOP/START WhatsApp (désabonnement/réabonnement)
- Dashboard admin minimal (validation, stats, monitoring système)
- Modération semi-automatique : règles simples (date future + titre + lieu
  présents) publient automatiquement, sinon statut "en_attente" pour
  validation manuelle

### Explicitement hors scope V1 — ne pas implémenter sans demande explicite

- App mobile native
- Comptes utilisateurs avec authentification, favoris ou historique
- Commentaires ou système d'avis
- Scraping Instagram ou sites de médias locaux (V2)
- Système de billetterie ou paiement en ligne
- Notifications push
- Recommandations personnalisées par IA
- Canal de diffusion WhatsApp groupé (décision prise : messages individuels
  uniquement, pour permettre la personnalisation par catégorie et construire
  un actif propriétaire de données abonnés)
- Édition complète d'un événement déjà soumis (en V1 : rejeter et laisser
  l'organisateur resoumettre)
- Gestion de rôles multi-administrateurs (un seul admin : moi)

---

## Décisions d'architecture déjà prises (ne pas remettre en question sans raison forte)

- **Aucun backend custom Node/Express/Django.** Supabase fournit l'API REST
  auto-générée + l'authentification. Next.js Server Actions gèrent les
  mutations ponctuelles (formulaires). n8n gère toute l'automatisation
  planifiée et événementielle.
- **n8n est hébergé sur Railway**, pas n8n Cloud (trop cher à $20/mois pour
  une V1), pas Render (le free tier dort après 15 min d'inactivité, ce qui
  casse les crons).
- **Apify Facebook Events Scraper** (`apify/facebook-events-scraper`) est la
  source principale de scraping, pas de Playwright custom — l'Actor est
  maintenu par Apify directement, ce qui évite la maintenance face aux
  changements de HTML Facebook.
- **WhatsApp = messages individuels via Meta Cloud API**, jamais un canal de
  diffusion groupé. Cette décision a été prise consciemment : un canal serait
  plus simple mais empêche la personnalisation par catégorie et ne construit
  pas de liste d'abonnés propriétaire.
- **Pas d'authentification utilisateur côté public.** Les abonnés WhatsApp
  sont identifiés uniquement par leur numéro de téléphone, pas de compte.
- **Le dashboard admin est protégé par Supabase Auth** (email + mot de passe
  simple), un seul rôle admin, pas de système de permissions complexe.

---

## Stack technique

| Composant            | Technologie                             | Rôle                                         |
| -------------------- | --------------------------------------- | -------------------------------------------- |
| Frontend             | Next.js + TypeScript                    | Site public + dashboard admin                |
| Styling              | Tailwind CSS                            | Tous les styles, pas de CSS-in-JS            |
| Animations           | Motion (anciennement Framer Motion)     | Micro-interactions, transitions              |
| Icônes               | Lucide React                            | Iconographie exclusive                       |
| Formulaires          | React Hook Form + Zod                   | Validation et gestion d'état des formulaires |
| Base de données      | Supabase (PostgreSQL)                   | Données + API auto-générée + Auth + Storage  |
| Orchestration        | n8n (auto-hébergé)                      | Crons, webhooks, logique d'automatisation    |
| Hébergement n8n      | Railway                                 | Serveur persistant pour n8n                  |
| Scraping             | Apify (`apify/facebook-events-scraper`) | Collecte événements Facebook                 |
| Messagerie           | Meta WhatsApp Business Cloud API        | Envoi et réception des messages WhatsApp     |
| Hébergement frontend | Vercel                                  | Déploiement Next.js                          |
| Stockage fichiers    | Supabase Storage                        | Images des événements                        |

**Interdiction explicite** : ne pas utiliser de librairie de composants UI
(shadcn/ui, Material-UI, Chakra UI, Radix, Ant Design, etc.). Tous les
composants sont custom, écrits à la main, réutilisables dans
`components/ui/`.

---

## Schéma de base de données (Supabase / PostgreSQL)

```sql
-- Lieux
create table venues (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  adresse text,
  quartier text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz default now()
);

-- Evenements
create table events (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  description text,
  date_debut timestamptz not null,
  date_fin timestamptz,
  lieu_id uuid references venues(id),
  lieu_texte text,
  categorie text check (categorie in (
    'concert','culture','sport','business',
    'formation','religieux','gastronomie',
    'nightlife','mode_beaute','famille','communautaire',
    'autre'
  )),
  prix text check (prix in ('gratuit','payant','donation')),
  montant integer,
  quartier text,
  image_url text,
  url_source text,
  source_type text check (source_type in ('apify','formulaire')),
  statut text default 'en_attente' check (statut in (
    'en_attente','publie','rejete'
  )),
  organisateur_nom text,
  organisateur_contact text,
  organisateur_email text,
  organisateur_contact_fb text,
  apify_id text unique,
  created_at timestamptz default now()
);

-- Abonnes WhatsApp
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  telephone text not null unique,
  prenom text,
  categories text[] default '{"concert","culture","sport"}',
  actif boolean default true,
  opt_in_at timestamptz default now(),
  dernier_envoi timestamptz
);

-- Logs des envois WhatsApp
create table whatsapp_logs (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references subscribers(id),
  contenu text,
  statut text,
  sent_at timestamptz default now()
);

create index on events(date_debut);
create index on events(statut);
create index on events(categorie);
create index on events(source_type);
```

**`montant`** : valeur numérique en FCFA, renseignée quand `prix` vaut
`payant` ou `donation` (`null` si `gratuit`). Ajoutée car le formulaire de
soumission collecte déjà ce montant et le frontend l'affiche directement
("5 000 FCFA").

**`quartier` (sur `events`)** : dénormalisé depuis `venues.quartier` plutôt
que de dépendre uniquement de la jointure `lieu_id` → `venues`. La majorité
des événements scrapés via Apify n'auront qu'un `lieu_texte` libre, sans
`venue` propre — sans cette colonne, le filtre "Quartier" du site ne
fonctionnerait pour aucun événement scrapé.

**`organisateur_email` / `organisateur_contact_fb`** : le formulaire de
soumission collecte déjà ces deux champs optionnels (email de contact, page
Facebook de l'organisateur) pour permettre à l'admin de recontacter
l'organisateur ; ajoutés pour ne pas perdre cette donnée à l'insertion.

**Row Level Security** :

```sql
alter table venues enable row level security;
alter table events enable row level security;
alter table subscribers enable row level security;
alter table whatsapp_logs enable row level security;

create policy "Lecture publique des venues" on venues
  for select using (true);

create policy "Lecture publique des evenements publies" on events
  for select using (statut = 'publie');

-- Pas de policy sur subscribers / whatsapp_logs : aucun accès anonyme,
-- ni en lecture ni en écriture. Seul service_role (qui contourne RLS)
-- peut y accéder, depuis n8n ou les Server Actions.
```

Toute écriture (sur `events` comme sur `subscribers`/`whatsapp_logs`) passe
par le rôle `service_role` (depuis n8n ou les Server Actions), jamais depuis
le client anonyme directement. Les formulaires publics (soumission
d'événement, inscription aux alertes) écrivent via des **Server Actions**
Next.js qui utilisent `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement.

**Storage** : bucket `event-images` (public en lecture), pour les affiches
uploadées via le formulaire de soumission. Upload fait exclusivement côté
serveur (Server Action), donc aucune policy d'écriture n'est nécessaire.

**Catégories valides** (utilisées partout dans l'UI et la DB) : concert,
culture, sport, business, formation, religieux, gastronomie, nightlife
(« Vie nocturne »), mode_beaute (« Mode & Beauté »), famille, communautaire,
autre.

**Quartiers de Cotonou** (liste de référence pour les selects) : Haie-Vive,
Cadjèhoun, Akpakpa, Fidjrossè, Centre-ville, Dantokpa, Gbèdjromèdji, Agla,
Zogbo, Autre.

---

## Flux de données et automatisations

```
[Apify Actor - cron nocturne 2h00]
    -> webhook completion -> [n8n]
    -> deduplication via apify_id -> [Supabase insert]
    -> regle auto-publication (date future + titre + lieu => publie,
       sinon en_attente)

[Formulaire de soumission organisateur]
    -> Next.js Server Action
    -> validation Zod
    -> upload image vers Supabase Storage
    -> insert Supabase, statut = en_attente
    -> notification admin

[Vendredi 18h00 - n8n cron]
    -> requete Supabase top 7 evenements du week-end
    -> pour chaque subscriber actif, filtre par categories
    -> formatage message template Meta
    -> envoi individuel via Meta Cloud API
    -> log dans whatsapp_logs

[Webhook WhatsApp entrant - n8n, ecoute permanente]
    -> detection STOP/ARRET/DESABONNER -> subscribers.actif = false
       + message de confirmation libre (fenetre 24h)
    -> detection START/OUI -> subscribers.actif = true
       + message de bienvenue
```

---

## Conventions de code

**Taille des fichiers** : aucun fichier ne doit dépasser 300 lignes. Si une
implémentation dépasse cette limite, décomposer en sous-composants ou
extraire la logique dans un hook/utilitaire séparé.

**Nommage des fichiers** : PascalCase pour les composants React
(`EventCard.tsx`), camelCase pour les utilitaires et hooks
(`formatDate.ts`, `useEventFilters.ts`), kebab-case pour les routes Next.js.

**Composants** : tous dans `components/`, organisés par domaine
(`components/ui/`, `components/events/`, `components/forms/`,
`components/admin/`, `components/layout/`, `components/sections/`). Chaque
composant est typé strictement (props interface explicite, jamais `any`).
Principe DRY strict : pas de duplication, extraire un composant réutilisable
dès qu'un pattern UI apparaît 2 fois.

**Validation** : tous les formulaires utilisent React Hook Form + un schéma
Zod correspondant dans `lib/validations/`. La validation se fait au blur, pas
seulement au submit.

**Rendu Next.js** : choisir le mode de rendu selon la page :

- `/` (landing) : SSG
- `/evenements` (liste) : SSR avec revalidation 1h
- `/evenements/[id]` (détail) : SSR avec generateStaticParams pour les plus
  populaires
- Pages avec formulaires (`/soumettre`, `/alertes`) : CSR
- `/admin/*` : CSR, protégé par Supabase Auth

**Gestion des états asynchrones** : chaque fetch de données doit avoir un
état loading (skeleton, jamais de spinner plein écran), un état error
(message clair + action de retry si pertinent), et un état empty (illustration
légère + texte explicatif). Ne jamais laisser un écran vide sans feedback.

**Logs et erreurs** : erreurs catchées et loggées de façon structurée (pas de
`console.log` brut en production). Les erreurs utilisateur affichent un
message clair en français, jamais la stack trace brute.

**Accessibilité** : contraste WCAG AA minimum, tous les inputs ont un label
associé, tous les éléments interactifs sont focusables au clavier avec un
focus ring visible, les icônes décoratives ont `aria-hidden`, les icônes
seules ont un `aria-label`.

**Mobile first** : toute interface est conçue et testée d'abord en mobile
(375px), puis adaptée en tablette puis desktop. La majorité des utilisateurs
attendus sont sur téléphone.

**Style de code** : pas d'emojis dans le code, les commits, ou les commentaires.
Code commenté de façon utile (le pourquoi, pas le quoi évident). README.md
simple et direct, pensé pour qu'un autre développeur reprenne le projet sans
friction.

**Sécurité frontend** : aucune clé secrète (`SUPABASE_SERVICE_ROLE_KEY`,
tokens Meta, tokens Apify) ne doit jamais apparaître côté client. Ces clés
restent dans les variables d'environnement serveur ou dans n8n credentials,
jamais dans `NEXT_PUBLIC_*`.

---

## Variables d'environnement attendues

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Les tokens Apify et Meta WhatsApp vivent dans les credentials n8n, pas dans
l'environnement Next.js (n8n appelle ces APIs directement, pas le frontend).

---

## Identité visuelle (design déjà figé, ne pas réinventer)

Direction : minimaliste, inspirée des standards WhatsForm-like (fond blanc,
accents verts naturels, typographie sans-serif bold pour les titres).

- Background principal : `#FFFFFF`, sections alternées `#F9FAFB`
- Texte principal : `#111827`, secondaire `#6B7280`
- Accent : `#16A34A` (vert), hover `#15803D`, accent light `#DCFCE7`
- Border-radius : 8px (inputs), 12-16px (cards), 100px (pills/CTA)
- Icônes : Lucide uniquement, stroke 1.5px
- Badges catégorie : couleur dédiée par catégorie (voir maquette Figma /
  fichiers de design pour le détail exact des couleurs par catégorie)

Si un écran ou composant n'est pas couvert par ce fichier, se référer aux
maquettes déjà produites avant d'inventer un nouveau pattern visuel.

---

## Comment travailler sur ce projet

- Toujours lire ce fichier avant de commencer une tâche.
- Si une décision prise ici semble sous-optimale au vu du code actuel, le
  signaler et demander confirmation avant de la contourner silencieusement.
- Préférer des changements petits et testables plutôt que des refactors
  larges non demandés.
- Ne jamais introduire de librairie de composants UI (shadcn, MUI, Chakra,
  Radix, Ant Design) — composants custom uniquement.
- Mettre à jour ce fichier si une décision d'architecture change en cours de
  route, pour que le contexte reste fiable dans le temps.
