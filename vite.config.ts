import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        hydratable: true,
      },
    }),
  ],
  build: {
    manifest: "manifest.json",
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "index-about.html"),
        spa: resolve(__dirname, "index-spa.html"),
        spa1: resolve(__dirname, "index-spa1.html"),
        spa2: resolve(__dirname, "index-spa2.html"),
      },
    },
  },
});
