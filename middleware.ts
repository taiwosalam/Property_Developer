
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;
  const role = req.cookies.get("role")?.value; // Extract the value of the role cookie
  const emailVerified = req.cookies.get("emailVerified")?.value;

  const currentPath = req.nextUrl.pathname;

  // Allow acces to /auth/sign-in if the authToken does not exist
  if (req.nextUrl.pathname === "/auth/sign-in" && !authToken) {
    return NextResponse.next();
  }

  // Redirect to login if no token exists
  if (!authToken) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // Allow access to /auth/sign-up for users without emailVerified or role
  if (currentPath === "/auth/sign-up" && (!emailVerified || !role)) {
    return NextResponse.next();
  }

  // if there's role and emailverified, block access to /auth/sign-up except for role === director
  if (role && emailVerified && currentPath === "/auth/sign-up") {
    return NextResponse.next();
  }

  // If the current path is `/auth/sign-in` and the user's role is not `director`, redirect them to `/auth/user/sign-in`
  if (currentPath === "/auth/sign-in" && role !== "director") {
    return NextResponse.redirect(new URL("/auth/user/sign-in", req.url));
  }

  // Define role-based routes
  const roleBasedRoutes: Record<string, string[]> = {
    admin: ["/dashboard",  "/auth/user/sign-in", "/dashboard/reports"],
    user: ["/dashboard",  "/auth/user/sign-in", "/dashboard/orders"],
    staff: ["/dashboard", "/auth/user/sign-in"],
    account: ["/dashboard", "/auth/user/sign-in", "/auth/sign-up"],
    director: ["/dashboard", "/wallet", "/auth/sign-in", "/auth/user/sign-in"],
  };

  // Check if the user's role allows access to the current path
   const allowedRoutes = role ? roleBasedRoutes[role] : undefined;
  if (!allowedRoutes || !allowedRoutes.some((route:any) => currentPath.startsWith(route))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Allow access and set headers for debugging or downstream use
  const response = NextResponse.next();
  response.headers.set("x-authorization-status", "authorized");
  response.headers.set("x-user-role", `${role}`);

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/wallet/:path*", "/auth/:path*"],
};

