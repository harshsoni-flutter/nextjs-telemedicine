'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function completePatientOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const first = formData.get('first_name');
  const last = formData.get('last_name');
  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: first != null && String(first).trim() !== '' ? String(first).trim() : null,
      last_name: last != null && String(last).trim() !== '' ? String(last).trim() : null,
      phone: (formData.get('phone') as string)?.trim() || null,
      date_of_birth: (formData.get('date_of_birth') as string) || null,
      gender: (formData.get('gender') as string) || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}
