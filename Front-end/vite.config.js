import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Same-origin API access in development — no CORS needed.
      // The Node.js backend lives in ../Backend (default port 4000).
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
