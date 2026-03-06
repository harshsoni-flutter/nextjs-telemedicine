import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const dashboardPaths = ['/dashboard/patient', '/dashboard/provider'];
const onboardingPaths = ['/onboarding/patient', '/onboarding/provider'];
const authPaths = ['/login', '/signup/patient', '/signup/provider'];

function isAuthPath(pathname: string) {
  return authPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
function isDashboardPath(pathname: string) {
  return dashboardPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}
function isOnboardingPath(pathname: string) {
  return onboardingPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  // Create a new Supabase client to read user (session already refreshed in updateSession)
  const { createServerClient } = await import('@supabase/ssr');
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op; session already updated
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (!user) {
    if (isDashboardPath(pathname) || isOnboardingPath(pathname)) {
      const login = new URL('/login', request.url);
      login.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(login);
    }
    return supabaseResponse;
  }

  const role = (user.user_metadata?.role as string) || 'patient';

  if (isAuthPath(pathname)) {
    const dashboard =
      role === 'provider' ? '/dashboard/provider' : '/dashboard/patient';
    return NextResponse.redirect(new URL(dashboard, request.url));
  }

  if (isDashboardPath(pathname)) {
    const allowed =
      (pathname.startsWith('/dashboard/patient') && role === 'patient') ||
      (pathname.startsWith('/dashboard/provider') && role === 'provider');
    if (!allowed) {
      const correct =
        role === 'provider' ? '/dashboard/provider' : '/dashboard/patient';
      return NextResponse.redirect(new URL(correct, request.url));
    }
  }

  if (isOnboardingPath(pathname)) {
    const allowed =
      (pathname.startsWith('/onboarding/patient') && role === 'patient') ||
      (pathname.startsWith('/onboarding/provider') && role === 'provider');
    if (!allowed) {
      const correct =
        role === 'provider'
          ? '/onboarding/provider'
          : '/onboarding/patient';
      return NextResponse.redirect(new URL(correct, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/login',
    '/signup/patient',
    '/signup/provider',
  ],
};
