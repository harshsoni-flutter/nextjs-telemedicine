import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard/patient';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.user_metadata?.role ?? 'patient';
      const dashboard = role === 'provider' ? '/dashboard/provider' : '/dashboard/patient';
      return NextResponse.redirect(`${origin}${dashboard}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
