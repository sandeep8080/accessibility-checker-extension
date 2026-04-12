import type { Result } from "axe-core";

export type Severity = "error" | "warning" | "notice";

export type AIProvider = "gemini" | "claude" | "groq";

export interface MappedViolation extends Result {
  severity: Severity;
}

export interface AuditSummary {
  error: number;
  warning: number;
  notice: number;
  total: number;
}

export interface AuditResult {
  url: string;
  timestamp: string;
  summary: AuditSummary;
  violations: MappedViolation[];
}

export interface AISuggestion {
  explanation: string;
  codeSnippet: string;
  wcagReference: string;
  error?: string;
}

export type MessageAction =
  | { action: "RUN_AUDIT" }
  | { action: "GET_AI_SUGGESTION"; payload: { violation: MappedViolation } };
