import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA assets are served from /public. The service worker is registered
  // client-side (see app/pwa-register.tsx), so no plugin is required.
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};

export default nextConfig;
