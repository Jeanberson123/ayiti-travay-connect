
-- Supprimer l'ancien trigger et fonction s'ils existent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Créer les types énumérés (en ignorant s'ils existent déjà)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
        CREATE TYPE job_type AS ENUM ('temps_plein', 'temps_partiel', 'stage', 'freelance', 'contrat');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_category') THEN
        CREATE TYPE job_category AS ENUM ('informatique', 'marketing', 'comptabilite', 'ong', 'education', 'sante', 'ingenierie', 'commerce', 'autre');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM ('en_attente', 'vu', 'accepte', 'refuse');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
        CREATE TYPE user_type AS ENUM ('candidat', 'employeur', 'admin');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_type') THEN
        CREATE TYPE subscription_type AS ENUM ('gratuit', 'premium', 'enterprise');
    END IF;
END $$;

-- Table des profils utilisateurs étendus
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_type user_type NOT NULL DEFAULT 'candidat',
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  avatar_url TEXT,
  cv_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  skills TEXT[],
  experience_years INTEGER DEFAULT 0,
  subscription subscription_type DEFAULT 'gratuit',
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  email_notifications BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des entreprises
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  size_range TEXT,
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des offres d'emploi
CREATE TABLE IF NOT EXISTS public.job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  location TEXT NOT NULL,
  job_type job_type NOT NULL,
  category job_category NOT NULL,
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'HTG',
  experience_required INTEGER DEFAULT 0,
  skills_required TEXT[],
  is_remote BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des candidatures
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  cv_url TEXT,
  status application_status DEFAULT 'en_attente',
  viewed_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);

-- Table des alertes emploi
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  keywords TEXT[],
  location TEXT,
  category job_category,
  job_type job_type,
  salary_min NUMERIC,
  is_active BOOLEAN DEFAULT true,
  last_sent TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS public.job_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Table des abonnements
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_type subscription_type NOT NULL,
  stripe_subscription_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view all companies" ON companies;
DROP POLICY IF EXISTS "Users can manage their own company" ON companies;
DROP POLICY IF EXISTS "Anyone can view active job posts" ON job_posts;
DROP POLICY IF EXISTS "Company owners can manage their job posts" ON job_posts;
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create applications" ON job_applications;
DROP POLICY IF EXISTS "Job posters can view applications for their jobs" ON job_applications;
DROP POLICY IF EXISTS "Job posters can update application status" ON job_applications;
DROP POLICY IF EXISTS "Users can manage their own alerts" ON job_alerts;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON job_favorites;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON subscriptions;

-- Politiques RLS pour user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour companies
CREATE POLICY "Users can view all companies" ON companies
  FOR SELECT USING (true);
CREATE POLICY "Users can manage their own company" ON companies
  FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour job_posts
CREATE POLICY "Anyone can view active job posts" ON job_posts
  FOR SELECT USING (is_active = true);
CREATE POLICY "Company owners can manage their job posts" ON job_posts
  FOR ALL USING (auth.uid() = posted_by);

-- Politiques RLS pour job_applications
CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Users can create applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Job posters can view applications for their jobs" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM job_posts 
      WHERE job_posts.id = job_applications.job_id 
      AND job_posts.posted_by = auth.uid()
    )
  );
CREATE POLICY "Job posters can update application status" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM job_posts 
      WHERE job_posts.id = job_applications.job_id 
      AND job_posts.posted_by = auth.uid()
    )
  );

-- Politiques RLS pour job_alerts
CREATE POLICY "Users can manage their own alerts" ON job_alerts
  FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour job_favorites
CREATE POLICY "Users can manage their own favorites" ON job_favorites
  FOR ALL USING (auth.uid() = user_id);

-- Politiques RLS pour subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Fonction pour créer un profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger pour créer un profil à l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les anciens triggers s'ils existent
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_job_posts_updated_at ON job_posts;
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
DROP TRIGGER IF EXISTS update_job_alerts_updated_at ON job_alerts;
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;

-- Triggers pour updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON job_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_alerts_updated_at BEFORE UPDATE ON job_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour incrémenter le compteur de vues
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE job_posts 
  SET views_count = views_count + 1 
  WHERE id = job_id;
END;
$$;

-- Fonction pour incrémenter le compteur de candidatures
CREATE OR REPLACE FUNCTION increment_job_applications(job_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE job_posts 
  SET applications_count = applications_count + 1 
  WHERE id = job_id;
END;
$$;
