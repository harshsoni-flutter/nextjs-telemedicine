import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ensureUserAndProfile } from '@/lib/ensure-user';

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  await ensureUserAndProfile();
  const role = (user.user_metadata?.role as string) || 'patient';
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, first_name, last_name, phone, date_of_birth, gender, created_at')
    .eq('id', user.id)
    .single();
  if (profile && !profile.onboarding_completed) {
    const onboarding =
      role === 'provider' ? '/onboarding/provider' : '/onboarding/patient';
    redirect(onboarding);
  }
  return { user, role, profile };
}
