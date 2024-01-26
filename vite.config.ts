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
    // rollupOptions: {
    //   input: {
    //     index: resolve(__dirname, "index.html"),
    //   },
    // },
  },
});
