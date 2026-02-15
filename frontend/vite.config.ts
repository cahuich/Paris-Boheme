import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: process.env.REACT_APP_BASENAME || "/", // IMPORTANTE para GitHub Pages
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
  },
});
