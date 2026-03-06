'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function completeProviderOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const years = formData.get('years_of_experience');
  const { error } = await supabase
    .from('providers')
    .update({
      specialty: (formData.get('specialty') as string) || null,
      bio: (formData.get('bio') as string) || null,
      years_of_experience: years ? parseInt(String(years), 10) : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from('profiles')
    .update({
      first_name: (formData.get('first_name') as string) || null,
      last_name: (formData.get('last_name') as string) || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return { success: true };
}
