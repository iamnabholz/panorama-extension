import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import webExtension, { readJsonFile } from "vite-plugin-web-extension";

const target = process.env.TARGET || "firefox";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      // ...
      browser: target,
      manifest: () => {
        // Use `readJsonFile` instead of import/require to avoid caching during rebuild.
        const pkg = readJsonFile("package.json");
        const template = readJsonFile("manifest.json");
        return {
          ...template,
          version: pkg.version,
        };
      },
    }),
  ],
});
