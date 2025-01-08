// // IMPLEMENT LOGIC FOR ROUTE PROTECTION BETWEEN USER ROLES
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token");

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Verify token and get user role
//   const user = verifyToken(token); // Replace with your implementation

//   const adminRoutes = ["/dashboard/admin"];
//   const userRoutes = ["/dashboard/user"];
//   const staffRoutes = ["/dashboard/staff"];
//   const directorRoutes = ["/dashboard/director"];

//   const currentPath = req.nextUrl.pathname;

//   // Role-based redirection
//   if (adminRoutes.includes(currentPath) && user.role !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   if (userRoutes.includes(currentPath) && user.role !== "user") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   if (staffRoutes.includes(currentPath) && user.role !== "staff") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   if (directorRoutes.includes(currentPath) && user.role !== "director") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protect all dashboard routes
// };




















// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken"; // Install this: npm install jsonwebtoken

// // Secret key for verifying the token (use a secure key in production)
// const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// // Function to verify token and extract user details
// const verifyToken = (token: string): { role: string } | null => {
//   try {
//     return jwt.verify(token, SECRET_KEY) as { role: string };
//   } catch (error) {
//     return null; // Invalid token
//   }
// };

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("authToken");

//   // Redirect to login if no token exists
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Verify token and extract role
//   const user = verifyToken(token);
//   if (!user) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   const currentPath = req.nextUrl.pathname;

//   // Define role-based route prefixes
//   const roleBasedRoutes: Record<string, RegExp> = {
//     admin: /^\/dashboard\/admin/,
//     user: /^\/dashboard\/user/,
//     staff: /^\/dashboard\/staff/,
//     director: /^\/dashboard\/director/,
//   };

//   // Check if the current path matches the user's role
//   const allowedRoute = roleBasedRoutes[user.role];
//   if (!allowedRoute || !allowedRoute.test(currentPath)) {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));
//   }

//   return NextResponse.next();
// }

// // Protect all dashboard routes
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };


// michael@tegenc.com