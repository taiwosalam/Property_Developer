import { NextRequest, NextResponse } from 'next/server';
import { roleBasedRoutes } from './data';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.NEXT_PUBLIC_SESSION_SESSION || 'json-web-token-secret-key';

export async function middleware(req: NextRequest) {
  const emailVerified = req.cookies.get('emailVerified')?.value;
  const currentPath = req.nextUrl.pathname;
  const role = req.cookies.get('role')?.value;

  // console.log('server role', role);
  // Public routes accessible without authentication
  const publicRoutes = [
    '/auth/user/sign-in',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/setup',
    '/auth/forgot-password',
  ];
  
  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }
  
  // Allow access to `/auth/user/sign-in` if there's no authToken
  if (currentPath === '/auth/user/sign-in') {
    return NextResponse.next();
  }

  // Allow `/auth/sign-in` for directors; redirect others to `/auth/user/sign-in`
  if (currentPath === '/auth/sign-in') {
    if (role === 'director') return NextResponse.next();
    return NextResponse.redirect(new URL('/auth/user/sign-in', req.url));
  }

  // Role-based route restrictions
  const allowedRoutes =
    roleBasedRoutes[role as keyof typeof roleBasedRoutes] || [];
  if (!allowedRoutes.some((route) => currentPath.startsWith(route))) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // Allow access and set headers for debugging or downstream use
  const response = NextResponse.next();
  response.headers.set('x-authorization-status', 'authorized');
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/wallet/:path*',
    '/auth/:path*',
    '/manager/:path*',
    '/management/:path*',
    '/tasks/:path*',
    '/reports/:path*',
    '/listing/:path*',
    '/accounting/:path*',
    '/applications/:path*',
    '/documents/:path*',
    '/settings/:path*',
  ],
};
