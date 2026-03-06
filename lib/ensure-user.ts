'use server';

import { createClient } from '@/lib/supabase/server';

type UserRole = 'patient' | 'provider' | 'admin';

/**
 * Ensures the current user has rows in public.users and public.profiles
 * (and public.providers if role is provider). Call this after signup
 * so we don't rely on the DB trigger (which can fail due to RLS during signup).
 */
export async function ensureUserAndProfile(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log('[ensureUserAndProfile] No authenticated user');
    return { error: 'Not authenticated' };
  }

  const role = (user.user_metadata?.role as UserRole) || 'patient';
  const validRole = ['patient', 'provider', 'admin'].includes(role)
    ? role
    : 'patient';

  console.log('[ensureUserAndProfile] user id:', user.id, 'role:', validRole);

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (fetchError) {
    console.log('[ensureUserAndProfile] users fetch result:', fetchError.message, 'code:', fetchError.code);
  }
  if (existingUser) {
    console.log('[ensureUserAndProfile] User row already exists, skipping insert');
    return {};
  }

  console.log('[ensureUserAndProfile] Inserting into users and profiles...');
  const { error: userError } = await supabase.from('users').insert({
    id: user.id,
    role: validRole,
  });

  if (userError) {
    console.error('[ensureUserAndProfile] users insert failed:', {
      message: userError.message,
      code: userError.code,
      details: userError.details,
    });
    return { error: userError.message };
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: user.id,
  });

  if (profileError) {
    console.error('[ensureUserAndProfile] profiles insert failed:', {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
    });
    return { error: profileError.message };
  }

  if (validRole === 'provider') {
    const { error: providerError } = await supabase.from('providers').insert({ id: user.id });
    if (providerError) {
      console.error('[ensureUserAndProfile] providers insert failed:', providerError.message);
    }
  }

  console.log('[ensureUserAndProfile] Done.');
  return {};
}
