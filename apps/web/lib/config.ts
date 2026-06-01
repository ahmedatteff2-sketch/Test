export const CONTACT_CONFIG = {
  phone: "+20 10 1234 5678",      // Display format
  whatsappPhone: "201012345678", // API format (country code + number, no leading + or 0)
  email: "info@eagle-coaching.com",
  location: "القاهرة، مصر",
  whatsappDefaultMessage: "مرحباً كوتش، حابب استفسر عن باقات التدريب المتاحة وطريقة الاشتراك 🦅",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  youtubeUrl: "https://youtube.com",
  tiktokUrl: "https://tiktok.com",
};

/**
 * Resolve the API base URL.
 *
 * Order of precedence:
 *  1. NEXT_PUBLIC_API_URL — the canonical value, used in production.
 *  2. On localhost only, fall back to the local Go server on :8080.
 *
 * We deliberately do NOT hardcode `http://<hostname>:8080` for arbitrary
 * hosts: in production that breaks (wrong port) and would force insecure
 * HTTP / mixed-content. When nothing is configured off-localhost we return a
 * same-origin "/api" so requests stay on HTTPS and can be proxied.
 */
export function getApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `http://${host}:8080/api`;
    }
    // Off-localhost with no configured API: assume same-origin proxy.
    return "/api";
  }

  return "http://localhost:8080/api";
}

