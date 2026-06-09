import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname (e.g. /vi/admin/dashboard -> locale = vi, subpath = /admin/dashboard)
  const segments = pathname.split('/');
  const locale = (routing.locales as readonly string[]).includes(segments[1])
    ? segments[1]
    : routing.defaultLocale;

  // Check if target is admin routes
  const isAdminDashboard = pathname.match(/^\/(?:en|vi)?\/admin\/dashboard/);
  const isAdminLogin = pathname.match(/^\/(?:en|vi)?\/admin\/login/);

  const session = request.cookies.get('katalin_admin_session')?.value;
  const isAuthenticated = session === 'authenticated_session_token_xyz';

  if (isAdminDashboard) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/login`;
      return NextResponse.redirect(url);
    }
  }

  if (isAdminLogin) {
    if (isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/admin/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|uploads|.*\\..*).*)',
};
