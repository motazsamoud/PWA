// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.split(" ")[1];

  // 🔒 Routes protégées (dashboard et settings)
  const protectedRoutes = ["/dashboard", "/student-settings", "/profile", "/settings"];

  // 🔓 Routes publiques (login, signup)
  const publicRoutes = ["/login", "/registration", "/forgot-password"];

  const { pathname } = req.nextUrl;

  // ✅ Si utilisateur non connecté → rediriger vers /login
  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Si déjà connecté → empêcher retour vers /login
  if (publicRoutes.some((route) => pathname.startsWith(route)) && token) {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student-dashboard/:path*",
    "/student-setting/:path*",
    "/login",
    "/registration",
    "/forgot-password",
  ],
};
