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
 * The web app and API are deployed same-origin: in production the browser talks
 * only to the web domain, which reverse-proxies `/api/*` to the backend (see
 * next.config rewrites). This keeps auth cookies first-party (SameSite=Strict)
 * and avoids cross-site CORS.
 *
 *  - Production browser  -> same-origin "/api"
 *  - localhost browser   -> the local Go server on :8080 (same-site, no proxy)
 *  - SSR / build         -> NEXT_PUBLIC_API_URL if set, else local Go server
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return `http://${host}:8080/api`;
    }
    return "/api";
  }

  const configured = process.env.NEXT_PUBLIC_API_URL;
  return configured ? configured.replace(/\/+$/, "") : "http://localhost:8080/api";
}

