import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_AUTH_COOKIE } from './lib/api';

const LOGIN_URL = '/';
const authRoutes = [LOGIN_URL, '/cadastro'];

export function proxy(request: NextRequest) {
    const { nextUrl, cookies, url } = request;
    const pathname = nextUrl.pathname;
    const token = cookies.get(APP_AUTH_COOKIE)?.value;

    const isAuth = isAuthRoute(pathname);

    if (!token && !isAuth) {
        return NextResponse.redirect(new URL(LOGIN_URL, url));
    }

    if (token && isAuth) {
        return NextResponse.redirect(new URL("/chat", url));
    }

    return NextResponse.next();
}

function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};