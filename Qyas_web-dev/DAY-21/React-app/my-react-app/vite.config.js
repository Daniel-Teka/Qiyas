import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 1. Tailwindን እዚህ Import ያድርጉ

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Pluginኑን እዚህ ውስጥ ይጨምሩ
  ],
});