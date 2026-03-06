-- Provider availability scheduling

-- Enum for day of week
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Provider availability: recurring weekly schedule
CREATE TABLE public.provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week day_of_week NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT NOT NULL DEFAULT 15,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_times CHECK (end_time > start_time)
);

-- Provider settings: timezone and appointment duration
CREATE TABLE public.provider_settings (
  provider_id UUID PRIMARY KEY REFERENCES public.providers(id) ON DELETE CASCADE,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  appointment_duration_minutes INT NOT NULL DEFAULT 30,
  allow_same_day_booking BOOLEAN NOT NULL DEFAULT FALSE,
  min_advance_booking_hours INT NOT NULL DEFAULT 24,
  max_advance_booking_days INT NOT NULL DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Provider vacation/blocked time periods
CREATE TABLE public.provider_blocked_time (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  is_vacation BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Indexes for common queries
CREATE INDEX idx_provider_availability_provider_id ON public.provider_availability(provider_id);
CREATE INDEX idx_provider_availability_day_of_week ON public.provider_availability(day_of_week);
CREATE INDEX idx_provider_blocked_time_provider_id ON public.provider_blocked_time(provider_id);
CREATE INDEX idx_provider_blocked_time_date_range ON public.provider_blocked_time(start_date, end_date);

-- RLS: enable on new tables
ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_blocked_time ENABLE ROW LEVEL SECURITY;

-- Provider availability: providers see/manage their own; patients can read all
CREATE POLICY "Provider availability read own" ON public.provider_availability
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Provider availability read all for patients" ON public.provider_availability
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'patient'
  ));

CREATE POLICY "Provider availability insert own" ON public.provider_availability
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Provider availability update own" ON public.provider_availability
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Provider availability delete own" ON public.provider_availability
  FOR DELETE USING (auth.uid() = provider_id);

-- Provider settings: providers see/manage their own
CREATE POLICY "Provider settings read own" ON public.provider_settings
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Provider settings insert own" ON public.provider_settings
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Provider settings update own" ON public.provider_settings
  FOR UPDATE USING (auth.uid() = provider_id);

-- Provider blocked time: providers see/manage their own
CREATE POLICY "Provider blocked time read own" ON public.provider_blocked_time
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Provider blocked time insert own" ON public.provider_blocked_time
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Provider blocked time update own" ON public.provider_blocked_time
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Provider blocked time delete own" ON public.provider_blocked_time
  FOR DELETE USING (auth.uid() = provider_id);
