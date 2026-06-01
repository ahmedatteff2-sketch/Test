"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import {
  clearRoleCookie,
  clearCsrfCookie,
  readRoleCookie,
  roleHome,
  type Role,
} from "@/lib/auth";

type GuardState = "checking" | "authorized" | "denied";

/**
 * Authoritative client-side guard for a protected area.
 *
 * The proxy already did an optimistic cookie check; this confirms it against
 * the API (`/auth/me` validates the real httpOnly JWT) so a forged or stale
 * `eagle_role` cookie can't keep someone in. Returns "checking" until the
 * verdict is known so the layout can withhold protected UI (no flash).
 *
 * Dev tolerance: on localhost the Go API is often not running (demo flow uses
 * cookie-only login). There, a network failure is treated as "trust the cookie"
 * so the demo keeps working; a real 401/403 still denies. In production a
 * failed check always denies.
 */
export function useAuthGuard(required: Role): GuardState {
  const router = useRouter();
  const [state, setState] = useState<GuardState>("checking");

  useEffect(() => {
    let active = true;

    const isLocalhost =
      typeof window !== "undefined" &&
      ["localhost", "127.0.0.1"].includes(window.location.hostname);

    function deny() {
      clearRoleCookie();
      clearCsrfCookie();
      router.replace("/login");
    }

    async function verify() {
      try {
        const res = await api.get<{ id: string; role: Role }>("/auth/me");
        const role = res.data?.role;
        if (!active) return;

        if (role !== required) {
          // Authenticated as the other role → send to their own home.
          if (role === "admin" || role === "client") {
            router.replace(roleHome[role]);
          } else {
            deny();
          }
          setState("denied");
          return;
        }
        setState("authorized");
      } catch (err) {
        if (!active) return;
        const status = (err as { status?: number })?.status;

        // Hard auth failure always denies, even in dev.
        if (status === 401 || status === 403) {
          deny();
          setState("denied");
          return;
        }

        // Network/other error: trust the cookie locally (demo), deny in prod.
        if (isLocalhost && readRoleCookie() === required) {
          setState("authorized");
        } else {
          deny();
          setState("denied");
        }
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [required, router]);

  return state;
}

/** Log out: clear the API session, drop the role hint, return to login. */
export async function logout(router: ReturnType<typeof useRouter>) {
  try {
    await api.post("/auth/logout");
  } catch {
    // Best-effort; clearing the cookie below still ends the local session.
  }
  clearRoleCookie();
  clearCsrfCookie();
  router.replace("/login");
}
