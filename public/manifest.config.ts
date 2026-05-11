import { defineManifest } from "@crxjs/vite-plugin";

import packageJson from "../package.json";

const { version } = packageJson;

// Chrome version strings must be up to four dot-separated integers.
// If your package version is '1.0.0-beta.1', you may need to sanitize it. As the chrome does not use semVer.
const [major, minor, patch, label = "0"] = version
  .replace(/[^\d.-]+/g, "")
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: "Accessibility Checker Extension",
  version: `${major}.${minor}.${patch}.${label}`,
  description:
    "Audits webpages for WCAG 2.1 accessibility issues and provides AI-powered remediation suggestions.",
  permissions: ["activeTab", "scripting", "storage", "tabs"],
  host_permissions: ["<all_urls>"],
  icons: {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png",
  },
  action: {
    default_popup: "index.html",
    default_title: "Accessibility Checker",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content.ts"],
    },
  ],
  content_security_policy: {
    extension_pages:
      env.mode === "production"
        ? "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com"
        : "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com http://localhost:* ws://localhost:* wss://localhost:*;",
  },
  commands: {
    "run-audit": {
      suggested_key: {
        default: "Ctrl+Shift+U",
        mac: "Command+Shift+U",
      },
      description: "Run accessibility audit on the current page",
    },
  },
}));
