// vite.config.mjs
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "autoUpdate", // keep SW fresh automatically
      injectRegister: 'auto',
      includeAssets: ["favicon.svg"], // optional: any static assets to copy
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          // Images → fast and cached
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          // API GETs → fast with background refresh
          {
            urlPattern: ({ url, request }) =>
              request.method === "GET" && url.pathname.startsWith("/api"),
            handler: "StaleWhileRevalidate",
            options: { cacheName: "api" },
          },
        ],
      },
      manifest: {
        name: "Chartsy",
        short_name: "Chartsy",
        description: "AI insights & charts — fast, modern, installable.",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    includeSource: ["src/**/*.{ts,vue}"],
  },
});
