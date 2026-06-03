import type { NextConfig } from "next";

// Static export: `next build` emits a fully static site to `out/`, which the Go
// server embeds and serves alongside `/api` (a single Render service). There is
// no Node runtime in production, so the server-only Next features are gone:
//   - rewrites()  → not needed; `/api` is same-origin (the Go server owns it)
//   - headers()   → the Go server sets all security headers (per-response)
//   - proxy.ts    → route guards run client-side (lib/use-auth-guard.ts) and the
//                   API enforces real authorization
// See node_modules/next/dist/docs/01-app/02-guides/static-exports.md for the
// list of unsupported features.
const nextConfig: NextConfig = {
  output: "export",
  // Emit `/route/index.html` and make Links use trailing slashes, so the Go
  // file server can resolve clean URLs to their directory index.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    // No Next image optimizer in a static export (it needs a server); serve the
    // images in /public as-is.
    unoptimized: true,
  },
};

export default nextConfig;
