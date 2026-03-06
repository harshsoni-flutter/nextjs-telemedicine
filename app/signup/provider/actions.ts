'use server';

import { createClient } from '@/lib/supabase/server';

export async function signUpProvider(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  console.log('[signUpProvider] Attempting signup for email:', email);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: 'provider' },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/onboarding/provider`,
    },
  });

  if (error) {
    console.error('[signUpProvider] Signup failed:', {
      message: error.message,
      code: error.code ?? 'none',
      status: error.status ?? 'none',
      name: error.name,
      details: (error as { details?: string })?.details,
      fullError: JSON.stringify(error, null, 2),
    });
    return { error: error.message };
  }

  console.log('[signUpProvider] Signup succeeded for email:', email, 'user id:', data.user?.id ?? 'none');
  return { success: true };
}
