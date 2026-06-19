-- Cotonou.events — schéma Supabase.
-- À exécuter dans l'éditeur SQL Supabase (Database > SQL Editor > New query).
-- Référence : section "Schéma de base de données" de CLAUDE.md.
--
-- Entièrement idempotent (CREATE TABLE IF NOT EXISTS + ALTER TABLE ADD COLUMN
-- IF NOT EXISTS) : sans risque de le réexécuter après une mise à jour de ce
-- fichier, pour rattraper de nouvelles colonnes/contraintes/policies sans
-- jamais toucher aux données déjà présentes.
--
-- Les données de démonstration sont dans seed.sql (séparé exprès : lui n'est
-- pas idempotent, à ne lancer qu'une fois).

create extension if not exists pgcrypto;

-- ============================================================
-- Tables (no-op si elles existent déjà)
-- ============================================================

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  titre text not null,
  created_at timestamptz default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  telephone text not null unique,
  created_at timestamptz default now()
);

create table if not exists whatsapp_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

-- ============================================================
-- Colonnes (ajoute celles qui manquent, sans toucher à l'existant)
-- ============================================================

alter table venues
  add column if not exists adresse text,
  add column if not exists quartier text,
  add column if not exists latitude numeric,
  add column if not exists longitude numeric;

alter table events
  add column if not exists description text,
  add column if not exists date_debut timestamptz,
  add column if not exists date_fin timestamptz,
  add column if not exists lieu_id uuid references venues(id),
  add column if not exists lieu_texte text,
  add column if not exists categorie text,
  add column if not exists prix text,
  add column if not exists montant integer,
  add column if not exists quartier text,
  add column if not exists image_url text,
  add column if not exists url_source text,
  add column if not exists source_type text,
  add column if not exists statut text default 'en_attente',
  add column if not exists organisateur_nom text,
  add column if not exists organisateur_contact text,
  add column if not exists organisateur_email text,
  add column if not exists organisateur_contact_fb text,
  add column if not exists apify_id text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'events_apify_id_key') then
    alter table events add constraint events_apify_id_key unique (apify_id);
  end if;
end $$;

alter table subscribers
  add column if not exists prenom text,
  add column if not exists categories text[] default '{"concert","culture","sport"}',
  add column if not exists actif boolean default true,
  add column if not exists opt_in_at timestamptz default now(),
  add column if not exists dernier_envoi timestamptz;

alter table whatsapp_logs
  add column if not exists subscriber_id uuid references subscribers(id),
  add column if not exists contenu text,
  add column if not exists statut text,
  add column if not exists sent_at timestamptz default now();

-- ============================================================
-- Check constraints — supprime toute ancienne contrainte sur ces colonnes
-- (peu importe son nom) puis recrée la version à jour. Nécessaire ici car
-- la contrainte categorie existante ne connaît pas les 4 nouvelles valeurs.
-- ============================================================

do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'events' and att.attname = 'categorie' and con.contype = 'c'
  loop
    execute format('alter table events drop constraint %I', c.conname);
  end loop;
end $$;

alter table events add constraint events_categorie_check check (categorie in (
  'concert','culture','sport','business',
  'formation','religieux','gastronomie',
  'nightlife','mode_beaute','famille','communautaire',
  'autre'
));

do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'events' and att.attname = 'prix' and con.contype = 'c'
  loop
    execute format('alter table events drop constraint %I', c.conname);
  end loop;
end $$;

alter table events add constraint events_prix_check check (prix in ('gratuit','payant','donation'));

do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'events' and att.attname = 'source_type' and con.contype = 'c'
  loop
    execute format('alter table events drop constraint %I', c.conname);
  end loop;
end $$;

alter table events add constraint events_source_type_check check (source_type in ('apify','formulaire'));

do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_attribute att on att.attrelid = rel.oid and att.attnum = any(con.conkey)
    where rel.relname = 'events' and att.attname = 'statut' and con.contype = 'c'
  loop
    execute format('alter table events drop constraint %I', c.conname);
  end loop;
end $$;

alter table events add constraint events_statut_check check (statut in ('en_attente','publie','rejete'));

-- ============================================================
-- Index
-- ============================================================

create index if not exists events_date_debut_idx on events(date_debut);
create index if not exists events_statut_idx on events(statut);
create index if not exists events_categorie_idx on events(categorie);
create index if not exists events_source_type_idx on events(source_type);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table venues enable row level security;
alter table events enable row level security;
alter table subscribers enable row level security;
alter table whatsapp_logs enable row level security;

drop policy if exists "Lecture publique des venues" on venues;
create policy "Lecture publique des venues" on venues
  for select using (true);

drop policy if exists "Lecture publique des evenements publies" on events;
create policy "Lecture publique des evenements publies" on events
  for select using (statut = 'publie');

-- Pas de policy sur subscribers / whatsapp_logs : aucun accès anonyme,
-- ni en lecture ni en écriture. Seul service_role (qui contourne RLS)
-- peut y accéder, depuis n8n ou les Server Actions.

-- ============================================================
-- Storage — bucket public pour les affiches d'événements.
-- Upload fait exclusivement côté serveur (Server Action, service_role),
-- donc aucune policy d'écriture nécessaire : seule la lecture est ouverte.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do nothing;

drop policy if exists "Lecture publique des images d'evenements" on storage.objects;
create policy "Lecture publique des images d'evenements"
  on storage.objects for select
  using (bucket_id = 'event-images');
