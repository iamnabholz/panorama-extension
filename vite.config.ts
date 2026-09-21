import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

type BrowserTarget = "chrome" | "firefox";

const manifestPath = fileURLToPath(new URL("./manifest.json", import.meta.url));

const packagePath = fileURLToPath(new URL("./package.json", import.meta.url));

function extensionManifest(target: BrowserTarget): Plugin {
  return {
    name: "panorama-extension-manifest",
    apply: "build",

    buildStart() {
      this.addWatchFile(manifestPath);
      this.addWatchFile(packagePath);
    },

    generateBundle() {
      const template = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<
        string,
        unknown
      >;

      const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as {
        version?: unknown;
      };

      if (typeof pkg.version !== "string" || pkg.version.length === 0) {
        this.error("package.json must contain a nonempty version string.");
      }

      const manifest: Record<string, unknown> = {};

      // Resolve the browser-prefixed top-level keys in our manifest template.
      for (const [key, value] of Object.entries(template)) {
        const match = /^\{\{(chrome|firefox)\}\}\.(.+)$/.exec(key);

        if (match) {
          const [, browser, manifestKey] = match;

          if (browser === target) {
            manifest[manifestKey] = value;
          }
        } else {
          if (key.startsWith("{{")) {
            this.error(`Unsupported manifest template key: "${key}".`);
          }

          manifest[key] = value;
        }
      }

      manifest.version = pkg.version;

      const expectedVersion = target === "chrome" ? 3 : 2;

      if (manifest.manifest_version !== expectedVersion) {
        this.error(
          `Expected manifest_version ${expectedVersion} for ${target}.`,
        );
      }

      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: `${JSON.stringify(manifest, null, 2)}\n`,
      });
    },
  };
}

export default defineConfig(() => {
  const target = process.env.TARGET ?? "firefox";

  if (target !== "chrome" && target !== "firefox") {
    throw new Error(
      `Unsupported extension target "${target}". Use "chrome" or "firefox".`,
    );
  }

  return {
    base: "./",
    plugins: [svelte(), extensionManifest(target)],
  };
});
