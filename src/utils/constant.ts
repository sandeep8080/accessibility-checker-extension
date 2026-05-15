export const AI_CONFIG = {
  GEMINI_MODEL: "gemini-3-flash-preview",
};

export const AI_PROVIDER_CONFIG = {
  gemini: {
    url: "https://aistudio.google.com/apikey",
  },
};

export const STORAGE_KEY = "appSettings";

// ─── Message Action Types ────────────────────────────────────────────
export const ACTIONS = {
  RUN_AUDIT: "RUN_AUDIT",
  AUDIT_RESULT: "AUDIT_RESULT",
  GET_AI_SUGGESTION: "GET_AI_SUGGESTION",
} as const;

// ─── Error Messages ──────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  // Audit errors
  AUDIT_FAILED: "Failed to run audit",
  AUDIT_PAGE_ANALYSIS_FAILED:
    "Failed to analyze the page. Please ensure you are not on a browser internal page.",
  AUDIT_TAB_INACCESSIBLE:
    "Unable to access the active tab. Please make sure you are on a valid webpage and try again.",
  AUDIT_SAVE_FAILED: "Failed to save audit results",

  // Tab validation errors
  NO_ACTIVE_TAB: "No active tab found",
  BROWSER_INTERNAL_PAGE: "Cannot audit browser internal pages.",

  // AI suggestion errors
  AI_SUGGESTION_FAILED: "Failed to get AI suggestion",
  AI_INVALID_RESPONSE: "AI returned an invalid response format.",
  API_KEY_MISSING:
    "API Key missing. Please configure your API key in the Settings tab.",

  // Generic errors
  UNEXPECTED_ERROR:
    "An unexpected error occurred. You might need to refresh the page.",
  UNEXPECTED_ERROR_GENERIC: "An unexpected error occurred",

  // Error Boundary Message
  ERROR_BOUNDARY_TITLE: "Something went wrong",
  ERROR_BOUNDARY_DESCRIPTION:
    "An unexpected error occurred while rendering the app. Please try again in sometime",
} as const;

// ─── UI Messages ─────────────────────────────────────────────────────
export const UI_MESSAGES = {
  // Results Panel
  LANDING_TITLE: "Welcome to Accessibility Checker",
  LANDING_DESCRIPTION:
    "Click the button below to run an accessibility audit on the current page and get instant results.",
  // Audit status
  ANALYZING_PAGE: "Analyzing Page...",
  WCAG_COMPLIANCE_CHECK: "Checking for WCAG 2.1 compliance",
  AUDIT_FAILED_TITLE: "Audit Failed",
  PERFECT_SCORE_TITLE: "Perfect Score!",
  PERFECT_SCORE_DESCRIPTION:
    "No accessibility violations found on this page. Great job!",

  // History panel
  NO_HISTORY: "No audit history found.",
  NO_HISTORY_HINT: "Run an audit on any page to see it here.",
  CLEAR_HISTORY_CONFIRM: "Are you sure you want to clear all audit history?",

  // AI suggestion
  AI_WHY_IT_FAILS: "Why it fails",
  AI_HOW_TO_FIX: "How to fix it",

  // Settings
  API_CONFIG_DESCRIPTION:
    "To enable AI fix suggestions, you need to provide an API key. Your key is stored securely in your browser's local storage and is never sent to any server other than the AI provider.",
} as const;
