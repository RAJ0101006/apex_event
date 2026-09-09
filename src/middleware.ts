import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    
    let isAuthorized = false;
    if (sessionCookie) {
      const session = await verifySession(sessionCookie);
      if (session) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      // Redirect to login page
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
