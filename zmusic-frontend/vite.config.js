import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7151", // backend port
        changeOrigin: true,
        secure: false, // Bỏ qua SSL certificate errors
        rewrite: (path) => path,
      },
    },
  },
});
