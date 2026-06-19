-- Cotonou.events — données de démonstration.
-- À exécuter UNE SEULE FOIS, après schema.sql, pour vérifier l'affichage.
-- Pas de garde d'idempotence : relancer ce fichier duplique les 14 événements.

insert into events
  (titre, description, date_debut, lieu_texte, quartier, categorie, prix, montant, organisateur_nom, source_type, statut, apify_id)
values
  ('Afro Nuit Live — Showcase de la nouvelle scène béninoise',
   'Une nuit dédiée aux talents émergents de la scène afro-cotonoise. Cinq artistes, un DJ set live et une ambiance afrobeats jusqu''au bout de la nuit. Bar et restauration sur place.',
   '2026-06-20T20:00:00+01:00', 'Le Repaire de Bacchus', 'Haie-Vive', 'concert', 'payant', 5000, 'Cotonou Sound Lab', 'apify', 'publie', 'apify-afro-nuit'),

  ('Marché des Créateurs de Cotonou',
   'Plus de 40 créateurs locaux réunis : mode, bijoux, décoration et art contemporain. Entrée libre, food trucks et animations pour toute la famille.',
   '2026-06-21T10:00:00+01:00', 'Place de l''Étoile Rouge', 'Centre-ville', 'culture', 'gratuit', null, 'Collectif Made in Bénin', 'formulaire', 'publie', null),

  ('Tournoi inter-quartiers de football U17',
   'Huit quartiers s''affrontent dans un tournoi de football pour les moins de 17 ans. Buvette, animations et remise des trophées en clôture.',
   '2026-06-20T15:00:00+01:00', 'Stade municipal d''Akpakpa', 'Akpakpa', 'sport', 'gratuit', null, 'Mairie de Cotonou', 'formulaire', 'publie', null),

  ('Cotonou Tech Summit — IA & Entrepreneuriat',
   'Une journée de conférences et de networking autour de l''intelligence artificielle et de l''entrepreneuriat ouest-africain. Intervenants régionaux et démonstrations de startups.',
   '2026-06-25T09:00:00+01:00', 'Sofitel Cotonou Marina', 'Centre-ville', 'business', 'payant', 15000, 'Bénin Digital', 'apify', 'publie', 'apify-salon-tech'),

  ('Atelier photographie de rue',
   'Apprenez à capturer la vie de Cotonou en images. Atelier pratique limité à 12 participants, suivi d''une balade photo dans le quartier.',
   '2026-06-27T16:00:00+01:00', 'Studio Lumière', 'Cadjèhoun', 'formation', 'payant', 8000, 'Atelier Lumière', 'formulaire', 'publie', null),

  ('Dîner dégustation — Saveurs du Bénin',
   'Un menu cinq services revisitant les classiques béninois. Accord mets et cocktails locaux, places limitées sur réservation.',
   '2026-06-26T19:30:00+01:00', 'La Table d''Adjara', 'Fidjrossè', 'gastronomie', 'payant', 25000, 'Chef Mariam K.', 'apify', 'publie', 'apify-diner-degustation'),

  ('Soirée Gospel & Louange',
   'Une soirée de louange réunissant plusieurs chorales de la ville. Entrée libre, ouverture des portes à 16h30.',
   '2026-06-28T17:00:00+01:00', 'Palais des Congrès', 'Centre-ville', 'religieux', 'gratuit', null, 'Chorale Espérance', 'formulaire', 'publie', null),

  ('Exposition « Mémoires Lagunaires »',
   'Une exposition collective de peintres et photographes explorant le rapport de Cotonou à l''eau et à la lagune. Visite guidée le week-end.',
   '2026-06-23T11:00:00+01:00', 'Fondation Zinsou', 'Haie-Vive', 'culture', 'payant', 2000, 'Fondation Zinsou', 'apify', 'publie', 'apify-expo-art'),

  ('Semi-marathon de Cotonou',
   '21 km le long du littoral cotonois. Trois distances proposées (5 / 10 / 21 km), dossard avec t-shirt et ravitaillement inclus.',
   '2026-07-05T06:30:00+01:00', 'Boulevard de la Marina', 'Centre-ville', 'sport', 'payant', 3000, 'Run Cotonou', 'formulaire', 'publie', null),

  ('Stand-Up Night — Comédie 100% locale',
   'Six humoristes béninois se partagent la scène pour une soirée de rires. Bar ouvert, réservation conseillée.',
   '2026-07-03T21:00:00+01:00', 'Le Comedy Spot', 'Akpakpa', 'concert', 'payant', 4000, 'Rire à Cotonou', 'apify', 'publie', 'apify-stand-up'),

  ('Initiation à la couture wax',
   'Découvrez les bases de la couture et créez votre première pièce en tissu wax. Matériel fourni, débutants bienvenus.',
   '2026-07-01T14:00:00+01:00', 'Atelier Téranga', 'Agla', 'formation', 'payant', 6000, 'Atelier Téranga', 'formulaire', 'publie', null),

  ('Brunch Jazz du dimanche',
   'Brunch buffet avec trio jazz live et vue sur la ville. Ambiance détendue, idéal en famille ou entre amis.',
   '2026-06-28T11:30:00+01:00', 'Rooftop Le 9e', 'Haie-Vive', 'gastronomie', 'payant', 12000, 'Le 9e Rooftop', 'apify', 'publie', 'apify-brunch-jazz'),

  ('Soirée Clubbing — DJ Set International',
   'Une nuit électro avec un DJ invité international. Open bar avant minuit, dress code chic décontracté.',
   '2026-06-20T23:00:00+01:00', 'Club Le Privé', 'Haie-Vive', 'nightlife', 'payant', 10000, 'Le Privé Events', 'formulaire', 'publie', null),

  ('Journée Famille au Jardin',
   'Animations, jeux gonflables et ateliers créatifs pour petits et grands. Entrée libre, restauration sur place.',
   '2026-06-21T09:00:00+01:00', 'Jardin Place de l''Amazone', 'Centre-ville', 'famille', 'gratuit', null, 'Mairie de Cotonou', 'formulaire', 'publie', null);
