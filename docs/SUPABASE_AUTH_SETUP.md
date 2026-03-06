# Supabase Auth Setup

## Email rate limit exceeded

Supabase limits how many auth emails (confirmation, password reset, etc.) can be sent in a short time. If you see **"email rate limit exceeded"**:

1. **Wait** a few minutes (often 5–15) and try again.
2. **Avoid hitting the limit in development**: Turn off **Confirm email** (see below). Then signup does not send confirmation emails, so you won’t hit the rate limit when testing signups.

## Auto-confirm email (no confirmation required)

To let users sign in immediately after signup without confirming email:

1. Open **Supabase Dashboard** → your project.
2. Go to **Authentication** → **Providers** → **Email**.
3. Turn **off** “Confirm email”.

After this, new signups can sign in right away and will get a row in `public.users` on first sign-in or when they open the dashboard/onboarding.

## Why `auth.users` has an entry but `public.users` does not

- **auth.users**: Filled by Supabase when someone signs up.
- **public.users**: Filled by this app when the user is first used (sign-in or open dashboard/onboarding), via `ensureUserAndProfile()`.

If the trigger on `auth.users` was removed (migration `002_drop_auth_trigger.sql`), no row is created in `public.users` at signup. The row is created the first time they sign in or load a protected page. So it’s normal to see a user in Auth but not in `public.users` until they sign in once.

## Redirect URLs

In **Authentication** → **URL Configuration**:

- **Site URL**: `http://localhost:3000` (or your production URL).
- **Redirect URLs**: Add `http://localhost:3000/auth/callback` (and your production callback URL when you deploy).
