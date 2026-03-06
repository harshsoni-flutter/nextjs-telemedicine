-- Drop the auth trigger and function so signup does not fail with
-- "Database error saving new user". User/profile rows are created
-- by the app (ensureUserAndProfile) when the user hits onboarding or dashboard.
--
-- Run this in Supabase: SQL Editor → New query → paste and Run.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
