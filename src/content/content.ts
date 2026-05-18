import axe from "axe-core";

import type {
  AuditResult,
  MappedViolation,
  MessageAction,
  Severity,
} from "../types";
import { type AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { ACTIONS, ERROR_MESSAGES, STORAGE_KEY } from "../utils/constant";

// Map axe-core impact levels to our Severity type
const severityMap: Record<string, Severity> = {
  critical: "error",
  serious: "error",
  moderate: "warning",
  minor: "notice",
};

// Initialize axe for standard WCAG 2.1 AA checking
axe.configure({
  rules: [{ id: "color-contrast", enabled: true }],
  branding: {
    brand: "Accessibility Tool",
    application: "Chrome Extension",
  },
  reporter: "v2",
});

chrome.runtime.onMessage.addListener(
  (message: MessageAction, _sender, sendResponse) => {
    if (message.action === ACTIONS.RUN_AUDIT) {
      // Execute async audit
      runAudit()
        .then((data) => sendResponse({ success: true, data }))
        .catch((error) =>
          sendResponse({ success: false, error: error.message })
        );

      return true; // Indicates we will respond asynchronously
    }
  }
);

// Maps a conformance level selection to the full set of cumulative tags.
// axe-core tags are NOT cumulative — "wcag21aaa" alone skips A and AA rules.
const conformanceTagMap: Record<string, string[]> = {
  A: ["wcag2a", "wcag21a"],
  AA: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
  AAA: ["wcag2a", "wcag2aa", "wcag2aaa", "wcag21a", "wcag21aa", "wcag21aaa"],
};

async function runAudit(): Promise<AuditResult> {
  try {
    // Consider a use-case when user load the extensions and without come to settings tab run the audit and use AI features.
    // Then result.appSettings can we undefined so handle the key logic accordingly
    const result = await chrome.storage.local.get([STORAGE_KEY]);
    const storage = result?.[STORAGE_KEY] as AppSettings | undefined;
    const lvl =
      storage?.audit?.conformanceLvl ?? DEFAULT_SETTINGS.audit.conformanceLvl;
    const tags = conformanceTagMap[lvl];

    console.log("🚀 Starting accessibility audit");
    console.log("   Level:", lvl);
    console.log("   Tags:", tags);

    const results = await axe.run({
      runOnly: {
        type: "tag",
        values: tags,
      },
    } as import("axe-core").RunOptions);

    console.log(
      "✅ Audit complete. Found",
      results.violations.length,
      "violations."
    );

    // Convert to our format
    const violations: MappedViolation[] = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact || "minor",
      severity: severityMap[v.impact || "minor"] || "notice",
      tags: v.tags,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes,
    }));

    // Calculate summary
    const summary = {
      error: violations.filter((v) => v.severity === "error").length,
      warning: violations.filter((v) => v.severity === "warning").length,
      notice: violations.filter((v) => v.severity === "notice").length,
      total: violations.length,
    };

    return {
      url: window.location.href,
      timestamp: new Date().toISOString(),
      violations,
      summary,
    };
  } catch (error) {
    console.error("Axe-core audit failed:", error);
    throw new Error(ERROR_MESSAGES.AUDIT_PAGE_ANALYSIS_FAILED);
  }
}
