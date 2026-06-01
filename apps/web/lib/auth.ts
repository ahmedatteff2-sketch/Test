/**
 * Client-side auth signal.
 *
 * The real session lives in httpOnly `access_token` / `refresh_token` cookies
 * set by the Go API on its own domain — the web app cannot read those. To let
 * the Next proxy and layouts make fast routing decisions, we mirror only the
 * *role* into a readable `eagle_role` cookie on the web domain.
 *
 * This cookie is a UX/routing hint, NOT a security boundary: a user can forge
 * it. Authority always rests with (a) the `/auth/me` check in the protected
 * layouts and (b) the API rejecting non-admin access to admin data. A forged
 * cookie at most renders an empty shell for a moment before the layout's
 * `/auth/me` check fails and redirects — no protected data is ever exposed.
 */

export type Role = "admin" | "client";

export const ROLE_COOKIE = "eagle_role";
export const CSRF_COOKIE = "eagle_csrf";

export const roleHome: Record<Role, string> = {
  admin: "/admin/dashboard",
  client: "/client/today",
};

function isSecureContext(): boolean {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}

/** Mirror the authenticated role into the readable routing cookie. */
export function setRoleCookie(role: Role) {
  if (typeof document === "undefined") return;
  // Session cookie (no Max-Age) so it clears when the browser closes; the
  // httpOnly access token remains the real lifetime authority.
  const secure = isSecureContext() ? "; Secure" : "";
  document.cookie = `${ROLE_COOKIE}=${role}; Path=/; SameSite=Lax${secure}`;
}

/** Remove the routing cookie (logout / failed auth). */
export function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Read the role hint on the client (returns null if absent/invalid). */
export function readRoleCookie(): Role | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ROLE_COOKIE}=([^;]*)`)
  );
  const value = match?.[1];
  return value === "admin" || value === "client" ? value : null;
}

/**
 * CSRF token storage (double-submit). The server binds a csrf value into the
 * httpOnly access-token JWT and returns the same value in the login/refresh
 * response body. We stash it in this readable cookie so the API client can echo
 * it in the X-CSRF-Token header. It is NOT sent to the API as a cookie (the API
 * is on another domain) — only read by our own JS — so SameSite=Lax is fine.
 * Safe to be readable: security comes from the JWT binding + CORS, not secrecy.
 */
export function setCsrfCookie(token: string) {
  if (typeof document === "undefined" || !token) return;
  const secure = isSecureContext() ? "; Secure" : "";
  document.cookie = `${CSRF_COOKIE}=${encodeURIComponent(token)}; Path=/; SameSite=Lax${secure}`;
}

export function clearCsrfCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${CSRF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readCsrfCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CSRF_COOKIE}=([^;]*)`)
  );
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}
