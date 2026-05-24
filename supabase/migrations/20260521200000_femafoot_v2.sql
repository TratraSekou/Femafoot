-- ==========================================
-- MIGRATION FEMAFOOT V2 : Standardisation et Extensions
-- ==========================================

-- 1. RENOMMAGE DES TABLES EXISTANTES
ALTER TABLE public.actualites RENAME TO news;
ALTER TABLE public.produits RENAME TO products;
ALTER TABLE public.commandes RENAME TO orders;
ALTER TABLE public.matchs RENAME TO matches;
ALTER TABLE public.reservations_billets RENAME TO ticket_reservations;

-- 2. ROLES ET UTILISATEURS (AUTH)
CREATE TABLE IF NOT EXISTS public.roles (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

INSERT INTO public.roles (name) VALUES 
('Super Admin'), ('Admin Fédération'), ('Gestionnaire Ligue'), ('Club Admin'), ('Coach'), ('Rédacteur');

CREATE TABLE IF NOT EXISTS public.users (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id uuid UNIQUE, -- Lien vers auth.users (si utilisé)
    full_name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    avatar_url text,
    role_id bigint REFERENCES public.roles(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif', 'Inactif')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migration des anciens administrateurs vers users
INSERT INTO public.users (full_name, email, role_id, status)
SELECT 
    a.name, 
    a.email, 
    r.id, 
    a.status 
FROM public.administrateurs a
LEFT JOIN public.roles r ON a.role = r.name;

DROP TABLE public.administrateurs;

-- 3. CLUBS & JOUEURS
ALTER TABLE public.clubs 
ADD COLUMN region text,
ADD COLUMN founded_year integer,
ADD COLUMN description text;

CREATE TABLE IF NOT EXISTS public.players (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    club_id bigint REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    photo_url text,
    position text NOT NULL,
    nationality text NOT NULL DEFAULT 'Malienne',
    birth_date date,
    shirt_number integer,
    status text NOT NULL DEFAULT 'Actif' CHECK (status IN ('Actif', 'Blessé', 'Suspendu', 'Transféré')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. COMPÉTITIONS, MATCHES ET CLASSEMENTS
CREATE TABLE IF NOT EXISTS public.competitions (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    season text NOT NULL,
    type text NOT NULL,
    category text NOT NULL,
    start_date date,
    end_date date,
    status text NOT NULL DEFAULT 'À venir' CHECK (status IN ('En cours', 'Terminé', 'À venir')),
    logo_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.competitions (name, season, type, category, status) VALUES ('Ligue 1', '2025/2026', 'Championnat', 'Senior', 'En cours');

ALTER TABLE public.matches 
ADD COLUMN competition_id bigint REFERENCES public.competitions(id) ON DELETE CASCADE,
ADD COLUMN home_club_id bigint REFERENCES public.clubs(id) ON DELETE CASCADE,
ADD COLUMN away_club_id bigint REFERENCES public.clubs(id) ON DELETE CASCADE,
ADD COLUMN referee text,
ADD COLUMN match_date timestamp with time zone;

-- Migration données des matches existants
UPDATE public.matches m
SET 
    competition_id = (SELECT id FROM public.competitions WHERE name = 'Ligue 1' LIMIT 1),
    home_club_id = (SELECT id FROM public.clubs WHERE name = m.home_team_name LIMIT 1),
    away_club_id = (SELECT id FROM public.clubs WHERE name = m.away_team_name LIMIT 1),
    match_date = m.scheduled_at;

-- Nettoyage des matches invalides (sans club correspondant)
DELETE FROM public.matches WHERE home_club_id IS NULL OR away_club_id IS NULL;

ALTER TABLE public.matches
DROP COLUMN home_team_name,
DROP COLUMN away_team_name,
DROP COLUMN match_time,
DROP COLUMN scheduled_at;

ALTER TABLE public.matches
ALTER COLUMN competition_id SET NOT NULL,
ALTER COLUMN home_club_id SET NOT NULL,
ALTER COLUMN away_club_id SET NOT NULL,
ALTER COLUMN match_date SET NOT NULL;

CREATE TABLE IF NOT EXISTS public.standings (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    competition_id bigint REFERENCES public.competitions(id) ON DELETE CASCADE NOT NULL,
    club_id bigint REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    played integer NOT NULL DEFAULT 0,
    wins integer NOT NULL DEFAULT 0,
    draws integer NOT NULL DEFAULT 0,
    losses integer NOT NULL DEFAULT 0,
    goals_for integer NOT NULL DEFAULT 0,
    goals_against integer NOT NULL DEFAULT 0,
    goal_difference integer NOT NULL DEFAULT 0,
    points integer NOT NULL DEFAULT 0,
    form text[] DEFAULT '{}'::text[],
    UNIQUE(competition_id, club_id)
);

-- 5. ACTUALITÉS (NEWS) & DOCUMENTS
ALTER TABLE public.news 
ADD COLUMN author_id uuid REFERENCES public.users(id) ON DELETE SET NULL;

UPDATE public.news SET author_id = (SELECT id FROM public.users WHERE role_id = (SELECT id FROM public.roles WHERE name = 'Super Admin') LIMIT 1);

ALTER TABLE public.news DROP COLUMN author;
ALTER TABLE public.news RENAME COLUMN publish_date TO published_at;

ALTER TABLE public.documents
ADD COLUMN uploaded_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN type text;

UPDATE public.documents SET type = 'application/pdf';

-- 6. BOUTIQUE (E-COMMERCE)
ALTER TABLE public.products
ADD COLUMN sizes text[] DEFAULT '{}'::text[],
ADD COLUMN images text[] DEFAULT '{}'::text[];

UPDATE public.products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;
ALTER TABLE public.products DROP COLUMN image_url;

CREATE TABLE IF NOT EXISTS public.order_items (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id bigint REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id bigint REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity integer NOT NULL DEFAULT 1,
    price numeric(10,2) NOT NULL,
    size text
);

INSERT INTO public.order_items (order_id, product_id, quantity, price, size)
SELECT 
    o.id AS order_id,
    (item->>'product_id')::bigint AS product_id,
    (item->>'quantity')::int AS quantity,
    (item->>'price')::numeric AS price,
    item->>'size' AS size
FROM public.orders o, jsonb_array_elements(o.items) AS item;

ALTER TABLE public.orders DROP COLUMN items;

-- 7. BILLETTERIE
CREATE TABLE IF NOT EXISTS public.tickets (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    match_id bigint REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    category text NOT NULL,
    price numeric(10,2) NOT NULL,
    available_quantity integer NOT NULL,
    reserved_quantity integer NOT NULL DEFAULT 0,
    status text NOT NULL DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'Épuisé', 'Fermé'))
);

INSERT INTO public.tickets (match_id, category, price, available_quantity)
SELECT id, 'Standard', 5000.00, 1000 FROM public.matches;

INSERT INTO public.tickets (match_id, category, price, available_quantity)
SELECT id, 'VIP', 10000.00, 200 FROM public.matches;

ALTER TABLE public.ticket_reservations
ADD COLUMN ticket_id bigint REFERENCES public.tickets(id) ON DELETE CASCADE,
ADD COLUMN quantity integer NOT NULL DEFAULT 1;

UPDATE public.ticket_reservations tr
SET 
    ticket_id = (SELECT id FROM public.tickets t WHERE t.match_id = tr.match_id ORDER BY id LIMIT 1),
    quantity = tr.seat_count;

ALTER TABLE public.ticket_reservations 
DROP COLUMN match_id,
DROP COLUMN sector,
DROP COLUMN seat_count,
DROP COLUMN price;

ALTER TABLE public.ticket_reservations ALTER COLUMN ticket_id SET NOT NULL;

-- 8. TABLES SYSTÈME
CREATE TABLE IF NOT EXISTS public.settings (
    id integer PRIMARY KEY CHECK (id = 1),
    federation_name text NOT NULL DEFAULT 'FemaFoot',
    logo_url text,
    email text,
    phone text,
    theme text DEFAULT 'light',
    social_links jsonb DEFAULT '{}'::jsonb,
    language text DEFAULT 'fr',
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.notifications (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity_type text NOT NULL,
    entity_id text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. MISE À JOUR DES FONCTIONS
CREATE OR REPLACE FUNCTION public.release_expired_orders()
RETURNS void AS $$
BEGIN
  UPDATE public.products p
  SET reserved = GREATEST(0, p.reserved - sub.qty)
  FROM (
    SELECT oi.product_id, SUM(oi.quantity) AS qty
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.status = 'EN TRAITEMENT' AND now() > o.expires_at
    GROUP BY oi.product_id
  ) AS sub
  WHERE p.id = sub.product_id;

  UPDATE public.orders
  SET status = 'EXPIRÉE'
  WHERE status = 'EN TRAITEMENT' AND now() > expires_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.release_expired_tickets()
RETURNS void AS $$
BEGIN
  UPDATE public.tickets t
  SET reserved_quantity = GREATEST(0, t.reserved_quantity - sub.qty)
  FROM (
    SELECT tr.ticket_id, SUM(tr.quantity) as qty
    FROM public.ticket_reservations tr
    WHERE tr.status = 'EN TRAITEMENT' AND now() > tr.expires_at
    GROUP BY tr.ticket_id
  ) AS sub
  WHERE t.id = sub.ticket_id;

  UPDATE public.ticket_reservations
  SET status = 'EXPIRÉE'
  WHERE status = 'EN TRAITEMENT' AND now() > expires_at;
END;
$$ LANGUAGE plpgsql;

-- 10. POLITIQUES DE SÉCURITÉ (RLS)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Accès complet public roles" ON public.roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public players" ON public.players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public competitions" ON public.competitions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public standings" ON public.standings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public order_items" ON public.order_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Accès complet public activity_logs" ON public.activity_logs FOR ALL USING (true) WITH CHECK (true);

-- BUCKETS STORAGE: création de policies si storage schema existe (doit souvent être exécuté manuellement)
-- INSERT INTO storage.buckets (id, name, public) VALUES 
-- ('club-logos', 'club-logos', true), ('player-photos', 'player-photos', true), ('news-images', 'news-images', true), 
-- ('documents', 'documents', true), ('products', 'products', true), ('federation-assets', 'federation-assets', true)
-- ON CONFLICT (id) DO NOTHING;
