'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ensureUserAndProfile } from '@/lib/ensure-user';

export async function signInWithPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }
  await ensureUserAndProfile();
  return { success: true };
}

export async function resendConfirmationEmail(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  if (!email) return { error: 'Email is required' };
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback` },
  });
  if (error) {
    return { error: error.message };
  }
  if (data.url) redirect(data.url);
}

/** Wrapper for use as form action (must return void). */
export async function signInWithGoogleFormAction(): Promise<void> {
  await signInWithGoogle();
}
