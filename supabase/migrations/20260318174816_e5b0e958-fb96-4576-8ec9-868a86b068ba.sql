
-- Leads audits
CREATE TABLE public.audit_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT,
  nom TEXT,
  email TEXT,
  telephone TEXT,
  secteur TEXT,
  besoin TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on audit_requests"
  ON public.audit_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select on audit_requests"
  ON public.audit_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on audit_requests"
  ON public.audit_requests FOR DELETE
  TO authenticated
  USING (true);

-- Rendez-vous
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT,
  nom TEXT,
  email TEXT,
  telephone TEXT,
  secteur TEXT,
  besoin TEXT,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select on bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated update on bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on bookings"
  ON public.bookings FOR DELETE
  TO authenticated
  USING (true);

-- Diagnostics
CREATE TABLE public.diagnostics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  secteur TEXT,
  a_un_site TEXT,
  demandes_semaine TEXT,
  reseaux_sociaux TEXT,
  taches_repetitives TEXT[],
  offre_recommandee TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on diagnostics"
  ON public.diagnostics FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select on diagnostics"
  ON public.diagnostics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on diagnostics"
  ON public.diagnostics FOR DELETE
  TO authenticated
  USING (true);

-- Demandes d'offres
CREATE TABLE public.product_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prenom TEXT,
  nom TEXT,
  email TEXT,
  telephone TEXT,
  secteur TEXT,
  product TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.product_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on product_requests"
  ON public.product_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated select on product_requests"
  ON public.product_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete on product_requests"
  ON public.product_requests FOR DELETE
  TO authenticated
  USING (true);
