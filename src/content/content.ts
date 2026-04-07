import axe from "axe-core";
import type {
  MessageAction,
  AuditResult,
  MappedViolation,
  Severity,
} from "../types";

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
});

chrome.runtime.onMessage.addListener(
  (message: MessageAction, _sender, sendResponse) => {
    if (message.action === "RUN_AUDIT") {
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

async function runAudit(): Promise<AuditResult> {
  try {
    const results = await axe.run();

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

    // Calculate sumary
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
    throw new Error(
      "Failed to analyze the page. Please ensure you are not on a browser internal page."
    );
  }
}
