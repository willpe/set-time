import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "maskable-icon.png", "icon-192.png"],
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: "#144a52",
        background_color: "#05272E",
        display: "standalone",
        scope: "/",
        start_url: "/",
        name: "setti.me",
        short_name: "setti.me",
        description: "Explore set times for your favorite festivals",
        icons: [
          {
            src: "/icon-180.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple-touch-icon",
          },
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icon-384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,md,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5371,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
});
