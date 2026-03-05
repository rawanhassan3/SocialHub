
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
   plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://linked-posts.routemisr.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

