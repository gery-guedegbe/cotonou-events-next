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
visuellement. La base Supabase est créée avec son schéma initial. n8n est
déployé sur Railway (instance avec PostgreSQL et Redis, mode queue) et
opérationnel. L'étape en cours est la conception détaillée des workflows
n8n avant leur construction réelle dans l'interface.

**Prochaines étapes dans l'ordre** :

1. Appliquer les migrations SQL listées dans ce fichier (colonnes
   manquantes, table `events_rejetes_auto`, colonne générée
   `titre_normalise`)
2. Construire WF1 (scraping Apify) dans l'interface n8n avec le Code Node
   de normalisation et filtrage déjà spécifié ci-dessous
3. Construire WF2 (formulaire de soumission)
4. Configurer Meta WhatsApp Business API (templates + token + webhook)
5. Construire WF3 (digest vendredi) et WF4 (gestion STOP/START)
6. Construire WF5 (monitoring partagé)
7. Connecter les formulaires Next.js aux webhooks n8n correspondants
8. Tests end-to-end

Ne pas reconstruire les interfaces déjà faites sans demande explicite — se
concentrer sur la connexion des données réelles et la construction des
workflows.

---

## Périmètre V1 — ce qui est inclus / exclu

### Inclus

- Scraping automatique Facebook Events via Apify (Actor
  `apify/facebook-events-scraper`), **deux fois par semaine** (lundi et
  jeudi, pas plus fréquent — voir section Budget Apify)
- Formulaire de soumission d'événement par les organisateurs
- Site web public : liste filtrée, recherche, détail de chaque événement
- Inscription aux alertes WhatsApp (numéro +229 + catégories favorites)
- Envoi hebdomadaire automatique chaque vendredi 18h via WhatsApp (messages
  individuels personnalisés, PAS un canal de diffusion groupé)
- Gestion des réponses STOP/START WhatsApp (désabonnement/réabonnement)
- Dashboard admin minimal (validation, stats, monitoring système)
- Modération semi-automatique différenciée par source (voir section
  Règles de publication automatique)
- Filtrage qualité des données scrapées (exclusion spam commercial,
  événements récurrents, doublons inter-pages) avec table d'audit dédiée

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
- Gestion des événements récurrents Facebook (`eventFrequency` DAILY,
  WEEKLY, MONTHLY) : exclus systématiquement du scraping en V1, trop
  complexes à représenter proprement (un seul événement avec des dizaines
  de `childEvents`). Pourra être traité en V2 avec un vrai modèle de
  récurrence.

---

## Décisions d'architecture déjà prises (ne pas remettre en question sans raison forte)

- **Aucun backend custom Node/Express/Django.** Supabase fournit l'API REST
  auto-générée + l'authentification. Next.js Server Actions gèrent les
  mutations ponctuelles (formulaires). n8n gère toute l'automatisation
  planifiée et événementielle.
- **n8n est hébergé sur Railway**, pas n8n Cloud (trop cher à $20/mois pour
  une V1), pas Render (le free tier dort après 15 min d'inactivité, ce qui
  casse les crons). Instance Railway actuelle : n8n + PostgreSQL + Redis,
  mode queue (`EXECUTIONS_MODE=queue`), timezone `Africa/Porto-Novo`.
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
- **Utiliser les modules n8n natifs plutôt que des HTTP Request génériques**
  partout où ils existent (voir section Modules n8n). Le HTTP Request brut
  est réservé aux cas où aucun module natif ne couvre le besoin (ex :
  upsert conditionnel Postgres).

---

## Modules n8n natifs à utiliser

| Besoin                                                  | Module n8n                                           | Détail                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lancer un Actor Apify et récupérer le dataset           | Node Apify (community node `@apify/n8n-nodes-apify`) | Opération "Run Actor and get dataset items" : exécute, attend la fin, retourne les résultats en un seul nœud. À installer via Settings → Community Nodes si pas déjà fait.                                                                                                                     |
| Écrire/upsert dans Supabase avec logique conditionnelle | Node Postgres (pas le node Supabase natif)           | Le node Supabase natif ne supporte pas l'upsert nativement (limitation connue de la communauté n8n). Se connecter directement à la base PostgreSQL Supabase via Project Settings puis Database puis Connection string.                                                                         |
| Lire des lignes Supabase simples                        | Node Supabase natif                                  | Suffisant pour les lectures (SELECT) sans logique conditionnelle complexe.                                                                                                                                                                                                                     |
| Envoyer des messages WhatsApp                           | Node WhatsApp Business Cloud                         | Gère l'envoi de templates et de messages libres (fenêtre 24h), ainsi que l'upload/téléchargement de médias.                                                                                                                                                                                    |
| Écouter les messages WhatsApp entrants                  | Node WhatsApp Trigger (pas Facebook Trigger)         | n8n recommande explicitement ce node plutôt que le Facebook Trigger générique : il couvre deux fois plus de types d'événements. Point de vigilance : WhatsApp n'autorise qu'un seul webhook actif par app — basculer entre URL de test et URL de production écrase l'enregistrement précédent. |

---

## Architecture des workflows n8n

Cinq workflows indépendants, Supabase comme hub central. Chaque nœud à
partir du nœud Apify/webhook a l'option Continue On Fail activée — une
erreur sur un item ne doit jamais arrêter tout le run.

### WF1 — Scraping Apify

Déclencheur : Schedule Trigger, cron `0 5 * * 1,4` (lundi et jeudi à
5h00, timezone Africa/Porto-Novo).

Pourquoi cette fréquence et pas plus : voir section Budget Apify
ci-dessous. Le digest WhatsApp du vendredi n'a pas besoin de données
détectées à la minute — un run le jeudi matin suffit largement à jour la
base avant l'envoi du vendredi 18h.

Séquence des nœuds :

1. Node Apify, opération "Run Actor and get dataset items", Actor
   `apify/facebook-events-scraper`, input avec l'URL d'exploration Cotonou
2. Code Node de normalisation et filtrage (voir section dédiée
   ci-dessous pour le détail complet)
3. IF : route selon `_rejete` — si vrai, vers `events_rejetes_auto` ;
   si faux, continue
4. Node Postgres, Check 1 : recherche par `apify_id` exact
5. IF : si trouvé, UPDATE (popularité, description) sur la ligne
   existante et fin de branche ; si absent, continue vers Check 2
6. Node Postgres, Check 2 : recherche par `titre_normalise` +
   `date_debut::date` (détecte les doublons inter-pages Facebook, où le
   même événement réel existe sous deux `apify_id` différents)
7. IF : si trouvé, UPDATE pour ajouter le nouvel `apify_id` dans
   `apify_id_alternatif` (pas de nouvelle ligne) ; si absent, INSERT
   réel dans `events`
8. Node Postgres, purge : `DELETE FROM events WHERE date_debut < now() -
   interval '30 days' AND source_type = 'apify' RETURNING id`. Sans cette
   étape la table accumule indéfiniment des événements passés. Restreint à
   `apify` volontairement : les soumissions formulaire portent les
   coordonnées des organisateurs (`organisateur_email`,
   `organisateur_contact`, `organisateur_contact_fb`), qui sont un actif à
   conserver. Détail complet dans `docs/n8n-wf1-purge.md`.
9. Aggregate / Code Node : compteurs (ajoutés, mis à jour, rejetés
   par filtre, doublons, purgés)
10. Execute Workflow vers WF5 (monitoring partagé)

### WF2 — Soumission formulaire

Déclencheur : Webhook, appelé par la Server Action Next.js après
upload de l'image vers Supabase Storage.

Séquence : validation serveur stricte (ne jamais faire confiance au
client) puis Node Postgres INSERT avec `source_type = 'formulaire'` puis
peut être `statut = 'publie'` directement si tous les champs sont complets
(contrairement à Apify, l'organisateur déclare lui-même le prix, donc pas
besoin du filet de sécurité prix) puis notification admin puis Respond to
Webhook vers Next.js pour la page de confirmation.

### WF3 — Digest hebdomadaire WhatsApp

Déclencheur : Schedule Trigger, cron `0 18 * * 5` (vendredi 18h00).

Séquence : requête Supabase top événements publiés du week-end, puis pour
chaque `subscriber` actif, filtrer par `categories`, puis formater le
message, puis Node WhatsApp Business Cloud (template pré-approuvé Meta),
puis logger dans `whatsapp_logs` (succès ou échec par destinataire, sans
bloquer la boucle), puis Wait 1 seconde entre chaque envoi (respect du
rate limit Meta), puis Execute Workflow vers WF5.

### WF4 — Webhook entrant WhatsApp

Déclencheur : Node WhatsApp Trigger natif, écoute permanente,
événement "Messages".

Séquence : extraction du numéro et du texte, puis détection d'intention
(STOP/ARRET/DESABONNER vs START/OUI), puis branche STOP : `subscribers.actif
= false` + message de confirmation libre (fenêtre 24h, pas de template
requis puisque c'est l'utilisateur qui a initié), puis branche START :
`subscribers.actif = true` + message de bienvenue.

### WF5 — Monitoring et notifications (sous-workflow partagé)

Appelé depuis WF1 et WF3 via Execute Workflow, reçoit les compteurs en
entrée. Formate un résumé et envoie une notification (email ou Slack)
uniquement s'il y a eu des erreurs — pas de notification systématique
à chaque run réussi, pour éviter la fatigue d'alerte.

---

## Règles de publication automatique (différenciées par source)

Source `formulaire` : l'organisateur déclare lui-même le prix de façon
fiable. Peut être `statut = 'publie'` automatiquement si tous les champs
obligatoires sont présents.

Source `apify` : Apify ne fournit aucun champ prix fiable (`isFree`
n'existe pas dans les données réelles, `ticketsInfo.price` est
systématiquement `null`). Le prix est donc extrait par regex depuis la
description (recherche de montants suivis de "FCFA"/"francs"). Trois cas :

1. Montant FCFA détecté par regex : `prix = 'payant'`, `montant` =
   le montant le plus élevé trouvé (cas de plusieurs frais, ex.
   inscription + participation), `statut = 'publie'`
2. Aucune mention d'argent dans la description : `prix = 'gratuit'`,
   `statut = 'publie'` (publié en confiance)
3. Mention d'argent détectée mais regex n'a pas extrait de montant net
   (prix mal formaté, ambigu) : `prix = 'gratuit'` par défaut MAIS
   `statut = 'en_attente'` — filet de sécurité explicite : on ne publie
   jamais un événement comme gratuit si une mention d'argent existe
   sans certitude sur le montant. Décision prise consciemment après avoir
   observé des cas réels (tournoi sportif, formation professionnelle) où
   le prix existe mais n'est pas capturé proprement par la regex.

---

## Filtres de qualité appliqués avant insertion (WF1)

Quatre filtres successifs dans le Code Node de normalisation, chacun
loggant sa raison de rejet plutôt que de rejeter silencieusement :

1. Récurrence : `eventFrequency` dans `['DAILY', 'WEEKLY', 'MONTHLY']`
   donc rejeté (raison `recurrence`). Ces événements ont des dizaines de
   `childEvents` et représentent presque toujours du contenu commercial
   récurrent (promotions boutique, programmes hebdomadaires) plutôt que
   de vrais événements ponctuels, observé sur les données réelles
   scrapées.
2. Annulation : `isCanceled = true` donc rejeté (raison `annule`)
3. Champs manquants : `name` ou `utcStartDate` absents donc rejeté
   (raison `champs_manquants`)
4. Spam commercial : détection par mots-clés sur le titre
   (promotion, solde, vente flash) ou sur la combinaison description
   courte + mention prix + livraison à domicile, donc rejeté (raison
   `spam_commercial`). Observé sur les données réelles : des fiches
   produits (téléviseurs, etc.) publiées comme "événements" Facebook.
5. Liste de noms : description constituée presque exclusivement de
   noms propres séparés par des virgules sans aucune mention de date/heure,
   donc rejeté (raison `liste_noms`). Cas observé : posts de remerciement
   aux followers ("Thank You All").

Tous les items rejetés par ces filtres sont insérés dans
`events_rejetes_auto` avec la raison et les données brutes complètes, pour
permettre un audit et un ajustement des règles après usage réel — jamais
perdus silencieusement.

### Normalisation des valeurs nulles (à respecter dans le Code Node)

Constat sur les données réellement en base au 31 juillet 2026 : sur 47
événements publiés, 44 n'ont aucune image et les 3 restants portent la
**chaîne de caractères `"null"`** dans `image_url`, pas un `NULL` SQL. C'est
la signature d'une expression qui sérialise une valeur nulle en texte
(`String(valeur)` ou `{{ $json.image }}` côté n8n).

Le Code Node de WF1 doit émettre de vrais `null` JavaScript, jamais les
littéraux `"null"` / `"undefined"` / `""`. Vérifier chaque champ optionnel
(`image_url`, `url_source`, `lieu_texte`, `quartier`, `montant`).

Le frontend s'en protège déjà (`isDisplayableImageUrl` écarte explicitement
ces littéraux, sinon le navigateur afficherait une icône d'image brisée),
mais c'est un filet, pas une excuse pour laisser passer la donnée sale : elle
fausse tout comptage du type « combien d'événements ont une affiche ».

---

## Déduplication à deux niveaux

Nécessaire car deux runs espacés (lundi/jeudi) peuvent capter le même
événement réel sous deux apparences différentes :

Niveau 1, `apify_id` exact : le même run ou un run ultérieur retombe
sur la même page Facebook event. Géré par la recherche directe sur
`apify_id` avant toute écriture.

Niveau 2, similarité titre + date : le même événement réel a été
créé comme deux événements Facebook distincts par deux pages différentes
(cas réel observé : "FSM Cotonou 2026" sous deux `id` différents, "Marathon
Commercial de Cotonou" sous deux `id` différents). Géré par la colonne
générée `titre_normalise` (alphanumérique minuscule) combinée à
`date_debut::date`. Quand une correspondance est trouvée à ce niveau, le
nouvel `apify_id` est ajouté au tableau `apify_id_alternatif` de la ligne
existante plutôt que de créer un doublon.

Angle mort accepté pour la V1 : les variations de titre qui changent
les mots eux-mêmes (ex. "FSM Cotonou 2026" vs "Forum Social Mondial
Cotonou 2026") ne sont pas détectées par cette approche alphanumérique
simple. Décision consciente : une logique de similarité floue
(Levenshtein, embeddings) ajouterait de la complexité et des faux positifs
(deux événements différents fusionnés par erreur) pour un bénéfice
marginal. Les doublons résiduels de ce type restent visibles et filtrables
manuellement dans le dashboard admin.

---

## Budget Apify et fréquence de scraping

Plan gratuit Apify : 5$ de crédit mensuel, ne roule pas d'un mois à
l'autre, bloque les nouveaux runs une fois épuisé (pas de facturation en
dépassement). Coût observé sur un run réel : 0,38$. À raison de deux runs
par semaine (lundi et jeudi) : environ 8-9 runs par mois, soit environ
3,40$/mois, reste dans le budget gratuit avec marge. Une fréquence plus
élevée (quotidienne ou toutes les 2h) dépasserait largement le budget
gratuit et risquerait de bloquer silencieusement le pipeline en plein
mois. Ne pas augmenter cette fréquence sans recalculer le budget réel.

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
| Hébergement n8n      | Railway (n8n + PostgreSQL + Redis)      | Serveur persistant pour n8n, mode queue      |
| Scraping             | Apify (`apify/facebook-events-scraper`) | Collecte événements Facebook                 |
| Messagerie           | Meta WhatsApp Business Cloud API        | Envoi et réception des messages WhatsApp     |
| Hébergement frontend | Vercel                                  | Déploiement Next.js                          |
| Stockage fichiers    | Supabase Storage                        | Images des événements                        |

Interdiction explicite : ne pas utiliser de librairie de composants UI
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
  latitude numeric,
  longitude numeric,
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
  apify_id_alternatif text[],
  popularite_score integer default 0,
  titre_normalise text generated always as (
    lower(regexp_replace(titre, '[^a-zA-Z0-9]', '', 'g'))
  ) stored,
  created_at timestamptz default now()
);

-- Evenements rejetes automatiquement par les filtres qualite (audit)
create table events_rejetes_auto (
  id uuid primary key default gen_random_uuid(),
  apify_id text,
  titre text,
  description text,
  raison_rejet text not null check (raison_rejet in (
    'recurrence', 'spam_commercial', 'annule', 'champs_manquants',
    'liste_noms'
  )),
  donnees_brutes jsonb,
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
create index on events(titre_normalise, date_debut);
create index on events_rejetes_auto(raison_rejet);
create index on events_rejetes_auto(created_at);
```

`montant` : valeur numérique en FCFA, renseignée quand `prix` vaut
`payant` ou `donation` (`null` si `gratuit`). Pour les événements Apify,
extrait par regex depuis `description` (voir section Règles de publication
automatique).

`quartier` (sur `events`) : dénormalisé depuis `venues.quartier` plutôt
que de dépendre uniquement de la jointure `lieu_id` vers `venues`. La
majorité des événements scrapés via Apify n'auront qu'un `lieu_texte`
libre, sans `venue` propre, donc sans cette colonne le filtre "Quartier"
du site ne fonctionnerait pour aucun événement scrapé.

`latitude` / `longitude` (sur `events`) : Apify fournit ces coordonnées
directement dans `location.latitude`/`location.longitude` pour la majorité
des événements scrapés. Stockées même sans `venue` liée, pour permettre
l'affichage sur carte des événements Apify. Note : ces coordonnées sont
parfois génériques (centroïde de "Cotonou" plutôt que le lieu précis) quand
Facebook n'a pas de localisation fine, donc ne pas leur faire une confiance
absolue pour un zoom précis.

`apify_id_alternatif` : tableau des `apify_id` additionnels détectés
comme désignant le même événement réel que cette ligne (voir section
Déduplication à deux niveaux). Permet de tracer les doublons inter-pages
sans dupliquer les lignes.

`popularite_score` : somme de `usersGoing` + `usersInterested` fournis
par Apify. Utile pour trier les événements "tendance" en featured sur la
landing page, sans logique de scoring complexe.

`titre_normalise` : colonne générée automatiquement (alphanumérique
minuscule sans espaces), utilisée pour la déduplication de niveau 2 et
indexée avec `date_debut`.

`organisateur_email` / `organisateur_contact_fb` : le formulaire de
soumission collecte déjà ces deux champs optionnels (email de contact, page
Facebook de l'organisateur) pour permettre à l'admin de recontacter
l'organisateur ; ajoutés pour ne pas perdre cette donnée à l'insertion.

Row Level Security :

```sql
alter table venues enable row level security;
alter table events enable row level security;
alter table subscribers enable row level security;
alter table whatsapp_logs enable row level security;
alter table events_rejetes_auto enable row level security;

create policy "Lecture publique des venues" on venues
  for select using (true);

create policy "Lecture publique des evenements publies" on events
  for select using (statut = 'publie');

-- Pas de policy sur subscribers / whatsapp_logs / events_rejetes_auto :
-- aucun acces anonyme, ni en lecture ni en ecriture. Seul service_role
-- (qui contourne RLS) peut y acceder, depuis n8n ou les Server Actions.
```

Toute écriture (sur `events` comme sur `subscribers`/`whatsapp_logs`) passe
par le rôle `service_role` (depuis n8n ou les Server Actions), jamais depuis
le client anonyme directement. Les formulaires publics (soumission
d'événement, inscription aux alertes) écrivent via des Server Actions
Next.js qui utilisent `SUPABASE_SERVICE_ROLE_KEY` côté serveur uniquement.
Le node Postgres de n8n se connecte directement via les credentials de
base de données Supabase (host/port/user/password), distincts de la clé
API `service_role`.

Storage : bucket `event-images` (public en lecture), pour les affiches
uploadées via le formulaire de soumission. Upload fait exclusivement côté
serveur (Server Action), donc aucune policy d'écriture n'est nécessaire.

Catégories valides (utilisées partout dans l'UI et la DB) : concert,
culture, sport, business, formation, religieux, gastronomie, nightlife
(Vie nocturne), mode_beaute (Mode et Beauté), famille, communautaire,
autre.

Quartiers de Cotonou (liste de référence pour les selects) : Haie-Vive,
Cadjèhoun, Akpakpa, Fidjrossè, Centre-ville, Dantokpa, Gbèdjromèdji, Agla,
Zogbo, Autre.

---

## Conventions de code

Taille des fichiers : aucun fichier ne doit dépasser 300 lignes. Si une
implémentation dépasse cette limite, décomposer en sous-composants ou
extraire la logique dans un hook/utilitaire séparé.

Nommage des fichiers : PascalCase pour les composants React
(`EventCard.tsx`), camelCase pour les utilitaires et hooks
(`formatDate.ts`, `useEventFilters.ts`), kebab-case pour les routes Next.js.

Composants : tous dans `components/`, organisés par domaine
(`components/ui/`, `components/events/`, `components/forms/`,
`components/admin/`, `components/layout/`, `components/sections/`). Chaque
composant est typé strictement (props interface explicite, jamais `any`).
Principe DRY strict : pas de duplication, extraire un composant réutilisable
dès qu'un pattern UI apparaît 2 fois.

Validation : tous les formulaires utilisent React Hook Form + un schéma
Zod correspondant dans `lib/validations/`. La validation se fait au blur, pas
seulement au submit.

Rendu Next.js : choisir le mode de rendu selon la page :

- `/` (landing) : SSG
- `/evenements` (liste) : SSR avec revalidation 1h
- `/evenements/[id]` (détail) : SSR avec generateStaticParams pour les plus
  populaires
- Pages avec formulaires (`/soumettre`, `/alertes`) : CSR
- `/admin/*` : CSR, protégé par Supabase Auth

Gestion des états asynchrones : chaque fetch de données doit avoir un
état loading (skeleton, jamais de spinner plein écran), un état error
(message clair + action de retry si pertinent), et un état empty (illustration
légère + texte explicatif). Ne jamais laisser un écran vide sans feedback.

Logs et erreurs : erreurs catchées et loggées de façon structurée (pas de
`console.log` brut en production). Les erreurs utilisateur affichent un
message clair en français, jamais la stack trace brute. Côté n8n : chaque
nœud à partir du déclencheur a Continue On Fail activé, les erreurs
individuelles sont comptées et rapportées via WF5 plutôt que d'interrompre
tout le run.

Accessibilité : contraste WCAG AA minimum, tous les inputs ont un label
associé, tous les éléments interactifs sont focusables au clavier avec un
focus ring visible, les icônes décoratives ont `aria-hidden`, les icônes
seules ont un `aria-label`.

Mobile first : toute interface est conçue et testée d'abord en mobile
(375px), puis adaptée en tablette puis desktop. La majorité des utilisateurs
attendus sont sur téléphone.

Style de code : pas d'emojis dans le code, les commits, ou les commentaires.
Code commenté de façon utile (le pourquoi, pas le quoi évident). README.md
simple et direct, pensé pour qu'un autre développeur reprenne le projet sans
friction.

Sécurité frontend : aucune clé secrète (`SUPABASE_SERVICE_ROLE_KEY`,
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

### Échelle typographique (définie dans `tailwind.config.ts`)

Ne jamais réintroduire de taille arbitraire (`text-[13px]`, `text-[15px]`...).
Le code en comptait 143 réparties sur 21 valeurs distinctes, dont cinq entre
13 et 15.5px — un écart imperceptible qui ne relevait d'aucune intention.
Tout est passé par ces dix pas :

| Token | Taille | Usage |
| --- | --- | --- |
| `text-2xs` | 11px | micro-labels en capitales |
| `text-xs` | 12px | badges, horodatages |
| `text-sm` | 14px | méta secondaire |
| `text-base` | 16px | corps de texte |
| `text-lg` | 18px | chapô |
| `text-xl` | 20px | petits titres |
| `text-2xl` | 25px | sous-titres de section |
| `text-3xl` | 31px | titres de section, h1 mobile |
| `text-4xl` | 39px | h1 desktop, hero mobile |
| `text-5xl` | 49px | hero desktop |

Les pas `xs` à `xl` gardent délibérément les valeurs Tailwind par défaut : les
redéfinir aurait modifié en silence la centaine d'usages existants de
`text-sm` / `text-base`. Les valeurs arbitraires ont été absorbées **vers le
haut**, jamais vers le bas, pour gagner en lisibilité sur mobile. Au-delà de
`xl`, le ratio est de 1,25 (tierce majeure).

La hauteur de ligne est portée par le token : ne pas la redéclarer avec
`leading-*` sur les titres.

Hiérarchie des titres, à respecter :

- hero de la landing : `text-4xl md:text-5xl`
- `h1` de page : `text-3xl md:text-4xl`
- `h2` de section : `text-3xl`
- `h2` secondaire : `text-2xl`

### Autres tokens

- Interlettrage : `tracking-display` (-0.035em) pour les grands titres,
  `tracking-title` (-0.02em) pour les titres courants, `tracking-label`
  (0.06em) pour les capitales. Pas de valeur arbitraire.
- Espacement : grille Tailwind de 4px uniquement. `spacing.nav` (88px) est la
  hauteur de navbar, à utiliser comme offset des colonnes `sticky`.
- Contraste : `text-gray-400` est proscrit pour du texte (2,8:1 sur blanc,
  échoue WCAG AA). Le gris secondaire minimum est `text-gray-500` (4,83:1).
  L'exception admise couvre les icônes décoratives et les états désactivés,
  exemptés par le critère WCAG 1.4.3.
- Cibles tactiles : 44px minimum pour tout élément interactif, boutons-icônes
  compris (padding au besoin, avec marge négative pour compenser).

### Animations

`MotionProvider` (`components/layout/MotionProvider.tsx`) enveloppe les layouts
public et admin avec `MotionConfig reducedMotion="user"`. Indispensable : la
règle `prefers-reduced-motion` de `globals.css` ne neutralise que les
animations CSS, alors que Motion anime en JavaScript et y échappe
entièrement. Les animations impératives (`animate()` de `CountUp`) ne sont pas
gouvernées par `MotionConfig` et doivent tester la préférence elles-mêmes.

### SEO et GEO

Les schémas JSON-LD vivent tous dans `lib/seo/schema.ts`, jamais inlinés dans
les pages : les mêmes entités sont référencées depuis plusieurs routes et deux
copies divergentes cassent le graphe en silence.

Entités en place : `Organization` + `WebSite` (layout racine), `Event` +
`BreadcrumbList` (fiche événement), `ItemList` + `BreadcrumbList` (catalogue).

Points à ne pas régresser :

- **Géographie.** Cotonou est la ville (`addressLocality`), le quartier une
  subdivision (`streetAddress`), le Littoral le département
  (`addressRegion`). La version initiale mettait le quartier en
  `addressLocality` et « Cotonou » en `addressRegion`, ce qui décrivait une
  géographie inexistante.
- **`geo`.** Renseigné depuis `latitude`/`longitude` quand la source les
  fournit (46 événements sur 47 au 31 juillet 2026).
- **`lastModified` du sitemap.** Doit venir de `created_at`, jamais de la date
  de l'événement : celle-ci est par construction dans le futur, et un
  `lastmod` postérieur à aujourd'hui discrédite tout le fichier.
- **`endDate`, `image`.** Émis seulement si la source les fournit. Ne jamais
  inventer une durée ou une affiche pour « remplir » le schéma.

`/llms.txt` (`app/llms.txt/route.ts`) est **généré depuis la base**, pas écrit
à la main : un fichier figé annoncerait un nombre d'événements faux dès le
scraping suivant, et c'est exactement le type d'affirmation qu'un moteur
génératif reprend puis attribue au site.

Chaque événement a son image Open Graph dédiée
(`evenements/[id]/opengraph-image.tsx`). Le produit se diffuse d'abord par
WhatsApp : un lien partagé sans vignette propre n'affichait que le logo
générique.

### Règles de rédaction

- **« Autre » ne s'affiche jamais.** C'est l'étiquette de repli du quartier
  inconnu, pas une information. Passer par `formatLocation` / `formatArea`
  (`lib/utils/location.ts`), qui l'omettent.
- **Pas de formule ternaire interrogative.** Le motif « Une question, une
  suggestion, un partenariat ? » apparaissait à l'identique sur trois pages
  voisines — c'est le marqueur de texte généré le plus visible du projet.
- **Pas de promesse d'audience non mesurable** (« touchez plus de monde »).
  Décrire le mécanisme réel : publication immédiate, reprise dans le digest
  du vendredi.
- **Un seul libellé d'action** pour l'inscription : « Recevoir les alertes
  WhatsApp » sur les boutons de formulaire, « Recevoir les alertes » sur les
  liens de navigation. Il en existait cinq variantes.
- **Incohérence connue, non tranchée** : la page À propos annonce « une seule
  personne » tandis que les pages contact et légales parlent au « nous ». À
  arbitrer.

### États de page

Chaque route de liste ou de détail a un `loading.tsx` en squelette calqué sur
la structure finale (jamais de spinner plein écran). Les erreurs sont prises
par `(public)/error.tsx` et, en dernier recours, `global-error.tsx` — qui doit
porter ses propres `<html>`/`<body>` et réimporter `globals.css`. Les listes
vides passent par `components/ui/EmptyState.tsx`, jamais par une zone blanche.

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
- Privilégier les modules n8n natifs (voir section Modules n8n) plutôt que
  des HTTP Request génériques, sauf quand aucun module natif ne couvre le
  besoin.
- Mettre à jour ce fichier si une décision d'architecture change en cours de
  route, pour que le contexte reste fiable dans le temps.
