import { NextRequest, NextResponse } from 'next/server';
import { roleBasedRoutes } from './data';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.NEXT_PUBLIC_SESSION_SESSION || 'json-web-token-secret-key';

function verifyToken(token: string) {
  if (!token) {
    console.log('No token provided');
    return null; // No token means unauthenticated
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log('JWT verification failed:', error);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const authToken = req.cookies.get('authToken')?.value || '';
  const emailVerified = req.cookies.get('emailVerified')?.value;
  // const role = req.cookies.get('role')?.value;
  const currentPath = req.nextUrl.pathname;
   const role = req.cookies.get('role')?.value;
  // const decoded = verifyToken(authToken);
  // const role = decoded?.role;

  console.log('server role', role);
  console.log('server token', authToken);
  // Public routes accessible without authentication
  const publicRoutes = [
    '/auth/user/sign-in',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password',
  ];

  // Allow public routes if no authToken or role exists
  if (publicRoutes.includes(currentPath) && (!authToken || !role)) {
    return NextResponse.next();
  }

  // Allow access to `/auth/user/sign-in` if there's no authToken
  if (currentPath === '/auth/user/sign-in' && !authToken) {
    return NextResponse.next();
  }

  // Special case: Allow `/auth/sign-up` for unverified users or users without a role
  if (currentPath === '/auth/sign-up' && (!emailVerified || !role)) {
    return NextResponse.next();
  }

  // Block access to `/auth/sign-up` for verified users unless they are directors
  if (
    role &&
    emailVerified &&
    currentPath === '/auth/sign-up' &&
    role !== 'director'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
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
