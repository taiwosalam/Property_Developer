import { NextRequest, NextResponse } from "next/server";
import { roleBasedRoutes } from "./data";

export async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;
  const role = req.cookies.get("role")?.value;
  const company_status = req.cookies.get("company_status")?.value;
  const subscription_status = req.cookies.get("subscription_status")?.value;

  console.log("role", role);
  console.log("subscription_status", subscription_status);

  // Public routes accessible without authentication
  const publicRoutes = [
    "/auth/user/sign-in",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/setup",
    "/auth/forgot-password",
    "/management/agent-community",
  ];

  // Define dashboard paths that bypass company_status check
  const dashboardPaths = [
    "/dashboard",
    "/accountant/dashboard",
    "/manager/dashboard",
    "/staff/dashboard",
    "/user/dashboard",
  ];

  // Allow public routes to proceed without checks
  if (publicRoutes.includes(currentPath)) {
    return NextResponse.next();
  }

  // check for company subscription status
  if (
    !dashboardPaths.some((path) => currentPath.startsWith(path)) &&
    subscription_status === "expired"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // If role is 'user', redirect to /setup unless already on an auth/setup page
  if (
    role === "user" &&
    !currentPath.startsWith("/auth") &&
    currentPath !== "/setup"
  ) {
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  // Allow `/auth/user/sign-in`
  if (currentPath === "/auth/user/sign-in") {
    return NextResponse.next();
  }

  // Allow `/auth/sign-in` for directors; redirect others to `/auth/user/sign-in`
  if (currentPath === "/auth/sign-in") {
    if (role === "director") return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/user/sign-in", req.url));
  }

  // Company status check: if currentPath does NOT start with a dashboard path,
  // and company_status is "pending" or "rejected", redirect to unauthorized
  if (
    !dashboardPaths.some((path) => currentPath.startsWith(path)) &&
    (company_status === "pending" || company_status === "rejected")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Role-based route restrictions for non-'user' roles
  const allowedRoutes =
    roleBasedRoutes[role as keyof typeof roleBasedRoutes] || [];
  if (!allowedRoutes.some((route) => currentPath.startsWith(route))) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Allow access and set headers
  const response = NextResponse.next();
  response.headers.set("x-authorization-status", "authorized");
  return response;
}

export const config = {
  matcher: [
    "/",
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
    "/messages/:path*",
    "/notifications/:path*",
  ],
};
