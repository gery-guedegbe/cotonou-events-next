# Cotonou.events

Plateforme web de découverte d'événements à Cotonou (Bénin), avec pour
fonctionnalité différenciante une alerte WhatsApp hebdomadaire personnalisée
envoyée chaque vendredi à 18h.

<!-- TODO: captures d'écran (landing, liste, fiche événement, formulaire) -->

> Le contexte complet du projet (décisions d'architecture, périmètre V1,
> conventions de code, schéma de données) vit dans [CLAUDE.md](CLAUDE.md).
> Ce README couvre uniquement la prise en main.

## Stack

| Domaine                  | Outil                                                                  |
| ------------------------ | ---------------------------------------------------------------------- |
| Framework                | Next.js 16 (App Router, TypeScript strict)                             |
| Styles                   | Tailwind CSS — composants UI custom (pas de librairie type shadcn/MUI) |
| Animations               | `motion` (`motion/react`)                                              |
| Icônes                   | `lucide-react`                                                         |
| Formulaires              | React Hook Form + Zod                                                  |
| Base de données          | Supabase (PostgreSQL, Auth, Storage)                                   |
| Automatisation (à venir) | n8n (Railway) + Apify (scraping) + Meta WhatsApp Cloud API             |

## Prérequis

Node.js ≥ 20.9 (exigé par Next.js 16, voir le champ `engines` de `package.json`).

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase, voir ci-dessous
npm run dev
# → http://localhost:3000
```

Autres commandes : `npm run build`, `npm run start`, `npm run lint`,
`npx tsc --noEmit`.

Pas de suite de tests automatisés pour l'instant : la vérification se fait via
`tsc`, `eslint` et un passage manuel dans le navigateur.

## Base de données

Le projet est branché sur un vrai projet Supabase (pas de mock côté lecture
ni écriture).

1. Crée un projet sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL Supabase, exécute dans l'ordre :
   - [supabase/schema.sql](supabase/schema.sql) — tables, contraintes, RLS,
     bucket Storage. **Idempotent**, peut être réexécuté sans risque après
     chaque mise à jour de ce fichier.
   - [supabase/seed.sql](supabase/seed.sql) — données de démonstration.
     **À lancer une seule fois** (pas de garde anti-doublon).
3. Renseigne `.env.local` à partir de `.env.example` avec les clés du projet
   (Settings → API) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.

`SUPABASE_SERVICE_ROLE_KEY` ne doit jamais être exposée côté client : elle
n'est utilisée que dans les Server Actions (`src/lib/actions/`), jamais dans
un composant `"use client"`.

## État actuel

| Fonctionnalité                                                     | Statut                                          |
| ------------------------------------------------------------------ | ----------------------------------------------- |
| Site public (liste, recherche, filtres, détail) lu depuis Supabase | ✅                                              |
| Formulaire de soumission d'événement (+ upload image)              | ✅                                              |
| Inscription aux alertes WhatsApp (formulaire rapide + complet)     | ✅                                              |
| Dashboard admin                                                    | ⏳ encore sur données mockées (`src/lib/data/`) |
| Scraping Apify → Supabase                                          | ⏳ non démarré                                  |
| Envoi WhatsApp (digest vendredi, STOP/START)                       | ⏳ non démarré                                  |

## Déploiement

Hébergement prévu sur [Vercel](https://vercel.com) (connecté à ce dépôt) :

1. Importer le dépôt dans Vercel.
2. Renseigner les mêmes variables que `.env.local` (Settings → Environment
   Variables) : `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
3. Déploiement automatique à chaque push sur `main`.

## Arborescence

```
src/
  app/
    (public)/        # Site public : landing, liste, détail, soumettre, alertes, pages légales
    admin/            # Dashboard protégé (Supabase Auth)
    icon.tsx, opengraph-image.tsx, sitemap.ts, robots.ts
  components/
    ui/               # Composants custom réutilisables (Button, Input, PhoneInput, Toast, ...)
    layout/ events/ forms/ sections/ admin/
  lib/
    actions/          # Server Actions ("use server") — écritures Supabase
    supabase/         # Clients Supabase (anon pour lecture, service_role pour écriture)
    types/ constants/ utils/ validations/
    data/             # Données mockées restantes (dashboard admin uniquement)
supabase/
  schema.sql          # Schéma idempotent (tables, RLS, Storage)
  seed.sql            # Données de démonstration (à lancer une fois)
```

## Conventions de code

Détaillées dans [CLAUDE.md](CLAUDE.md) — résumé :

- Aucun fichier > 300 lignes (décomposer en sous-composants/hooks sinon).
- Pas de librairie de composants UI : tout est custom dans `components/ui/`.
- Tout formulaire utilise React Hook Form + Zod, validation au blur.
- Mobile first (375px), accessibilité AA, focus visible, `aria-label` sur les
  icônes seules.

## Accessibilité

Skip link, labels associés à tous les inputs, anneaux de focus visibles,
contraste AA, respect de `prefers-reduced-motion`.
