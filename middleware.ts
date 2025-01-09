import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("authToken")?.value;
  const role = req.cookies.get("role")?.value; // Extract the value of the role cookie


  // Redirect to login if no token exists
  if (!authToken) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  const currentPath = req.nextUrl.pathname;

  // Define role-based routes
  const roleBasedRoutes: Record<string, string[]> = {
    admin: ["/dashboard/admin", "/dashboard/settings", "/dashboard/reports"],
    user: ["/dashboard/user", "/dashboard/profile", "/dashboard/orders"],
    staff: ["/dashboard/staff", "/dashboard/tasks"],
    director: ["/dashboard", "/dashboard/overview"],
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
  matcher: ["/dashboard/:path*", "/wallet/:path*"],
};

