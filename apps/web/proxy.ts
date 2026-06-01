import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge routing guard for protected areas.
 *
 * NOTE: In Next.js 16 the middleware file convention was renamed from
 * `middleware.ts` to `proxy.ts` (exported function `proxy`, Node.js runtime).
 *
 * This reads the readable `eagle_role` hint cookie (see lib/auth.ts) to make a
 * fast, flash-free routing decision before a protected page renders:
 *   - no role            → send to /login (remembering where they were going)
 *   - client hitting /admin → bounce to the client home
 *   - admin hitting /client → bounce to the admin home
 *
 * This is an OPTIMISTIC check only. The cookie is forgeable, so it is not a
 * security boundary — the protected layouts re-verify against /auth/me and the
 * API enforces real authorization. Its job is purely to avoid showing the wrong
 * shell to the wrong audience.
 */

const ROLE_COOKIE = "eagle_role";

const roleHome: Record<string, string> = {
  admin: "/admin/dashboard",
  client: "/client/today",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const isAdminArea = pathname.startsWith("/admin");
  const isClientArea = pathname.startsWith("/client");

  // Unauthenticated: redirect to login, preserving the intended destination.
  if (!role) {
    const loginUrl = new URL("/login", request.nextUrl);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated but in the wrong area: send to their own home.
  if (isAdminArea && role !== "admin") {
    return NextResponse.redirect(new URL(roleHome.client, request.nextUrl));
  }
  if (isClientArea && role !== "client") {
    return NextResponse.redirect(new URL(roleHome.admin, request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*"],
};
