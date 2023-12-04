import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ deleteOriginFile: true, threshold: 4096 }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
