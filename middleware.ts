import { NextRequest, NextResponse } from "next/server";
import {
  roleBasedRoutes,
  managerRoutes,
} from "./data";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;
  const role = req.cookies.get("role")?.value; // Extract the value of the role cookie
  const emailVerified = req.cookies.get("emailVerified")?.value;
  const currentPath = req.nextUrl.pathname;

  // Allow acces to /auth/sign-in if the authToken does not exist
  if (req.nextUrl.pathname === "/auth/user/sign-in" && !authToken) {
    return NextResponse.next();
  }

  // Routes accessible without authentication
  const publicRoutes = ["/auth/user/sign-in", "/auth/sign-in", "/auth/sign-up", "/auth/forgot-password"];

  // Check if the current path is public
  if (publicRoutes.includes(currentPath) && (!authToken || !role)) {
    return NextResponse.next();
  }

  // Restrict access to `/manager` routes to the `manager` role
  if (currentPath.startsWith("/manager") && (role === "manager" || managerRoutes.includes(currentPath))) {
    return NextResponse.next(); // Allow access if role is manager or route is in managerRoutes
  }

  // Allow access to /auth/sign-up for users without emailVerified or role
  if (currentPath === "/auth/sign-up" && (!emailVerified || !role)) {
    return NextResponse.next();
  }

  // if there's role and emailverified, block access to /auth/sign-up except for role === director
  if (role && emailVerified && currentPath === "/auth/sign-up") {
    return NextResponse.next();
  }

  // Allow access to /auth/sign-up if there's no role
  if (currentPath === "/auth/sign-up" && !role) {
    return NextResponse.next();
  }

  // Allow access to /auth/sign-in for users with the director role
  if (currentPath === "/auth/sign-in" && role === "director") {
    return NextResponse.next();
  }

  // If the current path is `/auth/sign-in` and the user's role is not `director`, redirect them to `/auth/user/sign-in`
  if (currentPath === "/auth/sign-in" && role !== "director") {
    return NextResponse.redirect(new URL("/auth/user/sign-in", req.url));
  }

  // Get allowed routes for the user's role
  const allowedRoutes = role ? roleBasedRoutes[role] : [];

  // Block access if the route is not in the user's allowed routes
  if (!allowedRoutes.some((route) => currentPath.startsWith(route))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Allow access and set headers for debugging or downstream use
  const response = NextResponse.next();
  response.headers.set("x-authorization-status", "authorized");
  response.headers.set("x-user-role", `${role}`);

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/wallet/:path*", 
    "/auth/:path*", 
    "/manager/:path*",
    "/management/:path*",
    "/tasks/:path*",
    "/reports/:path*",
    "/listing/:path*",
    "/accounting/:path*",
    "/applications/:path*",
    "/documents/:path*",
    "/settings/:path*",
  ],
};

