-- Telemedicine MVP: users (extends auth.users), profiles, providers, appointments
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enum types
CREATE TYPE user_role AS ENUM ('patient', 'provider', 'admin');
CREATE TYPE appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Users table (extends auth.users with role)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles (patient onboarding)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Providers (provider profile)
CREATE TABLE public.providers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  specialty TEXT,
  bio TEXT,
  years_of_experience INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  reason_for_visit TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_patient_provider CHECK (patient_id != provider_id)
);

-- Indexes for common queries
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_provider_id ON public.appointments(provider_id);
CREATE INDEX idx_appointments_scheduled_time ON public.appointments(scheduled_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_users_role ON public.users(role);

-- RLS: enable on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Users: users can read/update their own row; insert via trigger
CREATE POLICY "Users can read own row" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own row" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own row" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Profiles: patients see own profile only
CREATE POLICY "Profiles read own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles update own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Profiles insert own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Providers: providers see own row; patients can list providers (for directory)
CREATE POLICY "Providers read own" ON public.providers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Providers update own" ON public.providers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Providers insert own" ON public.providers
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Providers: allow authenticated users to list all (for Find a Doctor)
CREATE POLICY "Providers list all for directory" ON public.providers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Appointments: patients see their appointments; providers see appointments where they are provider
CREATE POLICY "Appointments patient read" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Appointments patient insert" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Appointments patient update" ON public.appointments
  FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Appointments patient delete" ON public.appointments
  FOR DELETE USING (auth.uid() = patient_id OR auth.uid() = provider_id);

-- Function to create user row, profile, and provider (if role=provider) on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role_val user_role;
BEGIN
  user_role_val := COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient');
  INSERT INTO public.users (id, role)
  VALUES (NEW.id, user_role_val);
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  IF user_role_val = 'provider' THEN
    INSERT INTO public.providers (id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
