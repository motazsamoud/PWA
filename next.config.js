// next.config.js

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",

  // ✅ ajoute la page offline au precache
  additionalManifestEntries: [{ url: "/offline.html", revision: null }],

  // ✅ on garde la stratégie de cache interne stable
  runtimeCaching: require("next-pwa/cache"),

  // ✅ fallback offline (version compatible 5.x)
  fallbacks: {
    document: "/offline.html", // <-- c’est la bonne clé pour v5.x
  },
});

const nextConfig = {
  reactStrictMode: true,

  // ✅ nouvelle configuration images (pas "domains")
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "your-domain.com",
      },
    ],
  },

  // ✅ éviter les modules Node non supportés côté client
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    config.infrastructureLogging = { level: "error" };
    return config;
  },
};

module.exports = withPWA(nextConfig);
