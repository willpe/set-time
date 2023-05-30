import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
