-- ==========================================
-- 1. TABLES DU SYSTÈME FEMAFOOT
-- ==========================================

-- 1.1 Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  short text NOT NULL,
  city text NOT NULL,
  division text NOT NULL,
  coach text NOT NULL,
  players integer NOT NULL DEFAULT 0,
  stadium text NOT NULL,
  status text NOT NULL CHECK (status IN ('Actif', 'Inactif')),
  logo_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.2 Actualités (News)
CREATE TABLE IF NOT EXISTS public.actualites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  author text NOT NULL,
  publish_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  views integer NOT NULL DEFAULT 0,
  status text NOT NULL CHECK (status IN ('Publié', 'Brouillon')),
  cover_image text,
  tags text[] DEFAULT '{}'::text[] NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.3 Produits (Boutique)
CREATE TABLE IF NOT EXISTS public.produits (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  category text NOT NULL,
  reserved integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.4 Commandes (Boutique - Réservation 24h)
CREATE TABLE IF NOT EXISTS public.commandes (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_phone text NOT NULL,
  client_neighborhood text NOT NULL,
  total numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('EN TRAITEMENT', 'VALIDÉE', 'EXPIRÉE', 'ANNULÉE')),
  items jsonb NOT NULL, -- Format : [{"product_id": 1, "name": "...", "price": 120, "quantity": 2, "size": "M"}]
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours') NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.5 Matchs (Ligue 1)
CREATE TABLE IF NOT EXISTS public.matchs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  home_team_name text NOT NULL,
  away_team_name text NOT NULL,
  home_score integer,
  away_score integer,
  status text NOT NULL CHECK (status IN ('Terminé', 'En cours', 'À venir')),
  match_time text NOT NULL,
  scheduled_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.6 Réservations de Billets (Stade Virtuel - Réservation 24h)
CREATE TABLE IF NOT EXISTS public.reservations_billets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id bigint REFERENCES public.matchs(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  sector text NOT NULL CHECK (sector IN ('VIP', 'Tribune Ouest', 'Tribune Est', 'Pelouse', 'Standard', 'Presse')),
  seat_count integer NOT NULL DEFAULT 1,
  price numeric(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('EN TRAITEMENT', 'VALIDÉE', 'EXPIRÉE', 'ANNULÉE')),
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours') NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.7 Documents Officiels
CREATE TABLE IF NOT EXISTS public.documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  file_url text NOT NULL,
  file_size text NOT NULL,
  status text NOT NULL CHECK (status IN ('Validé', 'Brouillon')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.8 Administrateurs (Rôles & Permissions)
CREATE TABLE IF NOT EXISTS public.administrateurs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL CHECK (role IN ('Super Admin', 'Admin Fédération', 'Gestionnaire Ligue', 'Club Admin')),
  status text NOT NULL CHECK (status IN ('Actif', 'Inactif')),
  last_active text NOT NULL DEFAULT 'Jamais',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. AUTOMATISMES D'EXPIRATION (24h)
-- ==========================================

-- Libération automatique boutique
CREATE OR REPLACE FUNCTION public.release_expired_orders()
RETURNS void AS $$
BEGIN
  -- 1. Décrémenter les quantités réservées sur les produits concernés
  UPDATE public.produits p
  SET reserved = GREATEST(0, p.reserved - sub.qty)
  FROM (
    SELECT (item->>'product_id')::bigint AS product_id, SUM((item->>'quantity')::int) AS qty
    FROM public.commandes,
         jsonb_array_elements(items) AS item
    WHERE status = 'EN TRAITEMENT' AND now() > expires_at
    GROUP BY (item->>'product_id')::bigint
  ) AS sub
  WHERE p.id = sub.product_id;

  -- 2. Marquer les commandes comme expirées
  UPDATE public.commandes
  SET status = 'EXPIRÉE'
  WHERE status = 'EN TRAITEMENT' AND now() > expires_at;
END;
$$ LANGUAGE plpgsql;

-- Libération automatique billetterie
CREATE OR REPLACE FUNCTION public.release_expired_tickets()
RETURNS void AS $$
BEGIN
  UPDATE public.reservations_billets
  SET status = 'EXPIRÉE'
  WHERE status = 'EN TRAITEMENT' AND now() > expires_at;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 3. POLITIQUES DE SÉCURITÉ (RLS)
-- ==========================================

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matchs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations_billets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrateurs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès complet public clubs" ON public.clubs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public actualites" ON public.actualites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public produits" ON public.produits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public commandes" ON public.commandes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public matchs" ON public.matchs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public reservations" ON public.reservations_billets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public administrateurs" ON public.administrateurs FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 4. INSERTION DES DONNÉES DE GRAINE (SEED DATA)
-- ==========================================

-- 4.1 Clubs
INSERT INTO public.clubs (name, short, city, division, coach, players, stadium, status, logo_url) VALUES
('Djoliba AC', 'DAC', 'Bamako', 'Ligue 1', 'Ivan Minnaert', 28, 'Stade Modibo Kéïta', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Logo_Djoliba_AC.svg/1200px-Logo_Djoliba_AC.svg.png'),
('Stade Malien', 'SMA', 'Bamako', 'Ligue 1', 'Sékou Seck', 25, 'Stade 26 Mars', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/0/07/Stade_malien.png'),
('AS Real de Bamako', 'ASR', 'Bamako', 'Ligue 1', 'Nouhoum Diané', 30, 'Stade Modibo Kéïta', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/7/70/Logo_AS_Real_Bamako.png'),
('COB', 'COB', 'Bamako', 'Ligue 1', 'Ismaël Diallo', 26, 'Stade Mamadou Konaté', 'Inactif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png'),
('USC Kita', 'USC', 'Kita', 'Ligue 1', 'Aly Diabaté', 24, 'Stade Municipal de Kita', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png'),
('AS Bakaridjan', 'ASB', 'Ségou', 'Ligue 1', 'Mamadou Kéïta', 27, 'Stade Amary Daou', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png'),
('Onze Créateurs', 'ONZ', 'Bamako', 'Ligue 1', 'Djibril Dramé', 29, 'Stade 26 Mars', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png'),
('USFAS', 'USF', 'Bamako', 'Ligue 2', 'Cheick Oumar', 32, 'Stade USFAS', 'Actif', 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/5f/Logo_Femafoot.svg/1200px-Logo_Femafoot.svg.png');

-- 4.2 Actualités
INSERT INTO public.actualites (id, title, slug, excerpt, content, category, author, publish_date, views, status, cover_image, tags) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Éliminatoires CAN 2025 : La liste des Aigles dévoilée demain', 'eliminatoires-can-2025-liste-aigles', 'Le sélectionneur national communiquera la liste officielle des joueurs retenus pour la double confrontation cruciale contre la Guinée-Bissau.', 'Bamako, le 16 mai 2026. L''attente touche à sa fin pour les supporters maliens. Demain, à 11h00, le siège de la Femafoot accueillera la conférence de presse tant attendue.\n\nLe sélectionneur national présentera son plan de jeu et surtout les noms de ceux qui porteront les espoirs de tout un peuple. Selon nos sources, quelques retours de blessures importants sont à prévoir au milieu de terrain, ce qui pourrait donner une nouvelle dynamique au groupe.\n\nLes entraînements débuteront dès lundi au centre d''excellence de Kabala.', 'National', 'Service Presse FemaFoot', '2026-05-16T10:00:00Z', 4250, 'Publié', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop', ARRAY['CAN 2025', 'Aigles du Mali', 'Sélection']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Infrastructures : Nouveau centre technique à Gao', 'nouveau-centre-technique-gao', 'La Femafoot lance les travaux d''un centre technique régional moderne pour favoriser la détection des talents dans le nord du pays.', 'Dans le cadre de son programme de développement décentralisé, la fédération franchit une étape historique. Le nouveau centre sera doté de deux terrains synthétiques de dernière génération, d''un centre d''hébergement pour 50 joueurs et d''une unité médicale complète.', 'Championnat', 'Admin FemaFoot', '2026-05-15T14:30:00Z', 1280, 'Publié', 'https://images.unsplash.com/photo-1521733331922-79343338874a?q=80&w=1200&auto=format&fit=crop', ARRAY['Développement', 'Gao', 'Infrastructures']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Communiqué officiel : Calendrier de la Ligue 1', 'communique-calendrier-ligue-1', 'La Commission des Compétitions informe les clubs du léger décalage de la 24ème journée du championnat national.', 'Compte tenu des impératifs liés au calendrier international, la 24ème journée, initialement prévue ce weekend, est reportée de 48 heures. Elle se jouera donc intégralement le mardi 19 mai 2026.', 'Communique', 'Secrétariat Général', '2026-05-14T09:00:00Z', 3100, 'Brouillon', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop', ARRAY['Ligue 1', 'Calendrier', 'Officiel']),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Football Féminin : Les Mandé en quête de doublé', 'football-feminin-mande-double', 'Après leur victoire en championnat, l''AS Mandé se concentre désormais sur la finale de la Coupe du Mali prévue dimanche.', 'Le football féminin malien est à son apogée. L''AS Mandé continue de dominer la scène nationale, mais l''adversité se fait de plus en plus forte. La finale contre l''USFAS s''annonce électrique.', 'International', 'Média Foot', '2026-05-13T16:00:00Z', 2150, 'Publié', 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=1200&auto=format&fit=crop', ARRAY['Féminin', 'AS Mandé', 'Coupe du Mali']);

-- 4.3 Produits (Boutique)
INSERT INTO public.produits (name, description, price, image_url, stock, category, reserved) VALUES
('Maillot Officiel Aigles du Mali (Home)', 'Le maillot domicile officiel des Aigles pour la saison 2025/2026. Design authentique avec les couleurs nationales.', 25000.00, 'https://images.unsplash.com/photo-1578269174936-2709b5a5c0e5?q=80&w=600&auto=format&fit=crop', 150, 'Maillots', 2),
('Maillot Officiel Aigles du Mali (Away)', 'Le maillot extérieur blanc épuré des Aigles du Mali, confortable et ultra-respirant.', 25000.00, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop', 80, 'Maillots', 0),
('Ballon de Match Officiel CAF', 'Le ballon de compétition haut de gamme approuvé par la CAF et utilisé dans notre championnat.', 45000.00, 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop', 45, 'Équipements', 0),
('Écharpe Femafoot "Allez les Aigles"', 'Écharpe en maille premium ornée du blason de la Femafoot et des couleurs du drapeau.', 7500.00, 'https://images.unsplash.com/photo-1520975915891-3d74ac742a4a?q=80&w=600&auto=format&fit=crop', 300, 'Accessoires', 0);

-- 4.4 Commandes Boutique (Simulation avec résas en cours)
INSERT INTO public.commandes (client_name, client_email, client_phone, client_neighborhood, total, status, items, expires_at) VALUES
('Moussa Diakité', 'm.diakite@gmail.com', '+223 76 54 32 10', 'Badalabougou', 50000.00, 'EN TRAITEMENT', '[{"product_id": 1, "name": "Maillot Officiel Aigles du Mali (Home)", "price": 25000, "quantity": 2, "size": "XL"}]'::jsonb, now() + interval '22 hours'),
('Awa Diallo', 'a.diallo@outlook.com', '+223 66 12 34 56', 'ACI 2000', 32500.00, 'VALIDÉE', '[{"product_id": 1, "name": "Maillot Officiel Aigles du Mali (Home)", "price": 25000, "quantity": 1, "size": "M"}, {"product_id": 4, "name": "Écharpe Femafoot \"Allez les Aigles\"", "price": 7500, "quantity": 1, "size": "Taille Unique"}]'::jsonb, now() - interval '5 hours'),
('Amadou Sidibé', 'a.sidibe@hotmail.com', '+223 90 99 88 77', 'Korofina', 25000.00, 'EXPIRÉE', '[{"product_id": 1, "name": "Maillot Officiel Aigles du Mali (Home)", "price": 25000, "quantity": 1, "size": "L"}]'::jsonb, now() - interval '10 hours');

-- 4.5 Matchs
INSERT INTO public.matchs (home_team_name, away_team_name, home_score, away_score, status, match_time, scheduled_at) VALUES
('Djoliba AC', 'Stade Malien', 2, 1, 'Terminé', 'Aujourd''hui', now() - interval '2 hours'),
('AS Real de Bamako', 'COB', 1, 1, 'En cours', '75''', now() - interval '75 minutes'),
('Onze Créateurs', 'USFAS', NULL, NULL, 'À venir', 'Demain, 16h', now() + interval '20 hours');

-- 4.6 Réservations Billets
INSERT INTO public.reservations_billets (match_id, client_name, client_phone, sector, seat_count, price, status, expires_at) VALUES
(1, 'Abdoulaye Traoré', '+223 70 12 34 56', 'VIP', 2, 10000.00, 'VALIDÉE', now() - interval '1 hour'),
(2, 'Oumar Koné', '+223 60 45 67 89', 'Tribune Ouest', 4, 12000.00, 'EN TRAITEMENT', now() + interval '23 hours'),
(2, 'Mariam Touré', '+223 75 88 99 00', 'Pelouse', 3, 4500.00, 'EXPIRÉE', now() - interval '12 hours');

-- 4.7 Documents
INSERT INTO public.documents (title, category, file_url, file_size, status) VALUES
('Circulaire N°04 - Convocation Assemblée Générale Ordinaire', 'Circulaire', 'https://femafoot.ml/documents/circulaire-04-2026.pdf', '320 KB', 'Validé'),
('Procès-Verbal - Réunion du Comité Exécutif du 12 Mai 2026', 'Procès Verbal', 'https://femafoot.ml/documents/pv-comex-12052026.pdf', '1.2 MB', 'Validé'),
('Règlement Spécifique du Championnat National Ligue 1 (Mise à jour)', 'Règlement', 'https://femafoot.ml/documents/reglement-ligue1-2026.pdf', '2.4 MB', 'Brouillon');

-- 4.8 Administrateurs
INSERT INTO public.administrateurs (name, email, role, status, last_active) VALUES
('Mamadou Touré', 'm.toure@femafoot.ml', 'Super Admin', 'Actif', 'Maintenant'),
('Ibrahim Traoré', 'i.traore@femafoot.ml', 'Admin Fédération', 'Actif', 'Il y a 2h'),
('Seydou Keita', 's.keita@femafoot.ml', 'Gestionnaire Ligue', 'Inactif', 'Hier'),
('Fatoumata Diarra', 'f.diarra@femafoot.ml', 'Club Admin', 'Actif', 'Il y a 5m');
