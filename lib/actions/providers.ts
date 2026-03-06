'use server';

import { createClient } from '@/lib/supabase/server';

export async function getProviders() {
  const supabase = await createClient();
  const { data: providers } = await supabase
    .from('providers')
    .select('id, specialty, bio, years_of_experience');
  if (!providers?.length) return [];
  const ids = providers.map((p) => p.id);
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', ids);
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return providers.map((p) => ({
    ...p,
    first_name: byId.get(p.id)?.first_name ?? null,
    last_name: byId.get(p.id)?.last_name ?? null,
  }));
}
