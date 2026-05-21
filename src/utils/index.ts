import type { AuditError, AuditResponse, AuditResult } from "../types";
import { ERROR_MESSAGES } from "./constant";

export const tabValidator = (
  tab?: chrome.tabs.Tab
): tab is chrome.tabs.Tab & { id: number } => {
  if (!tab || !tab.id) {
    throw new Error(ERROR_MESSAGES.NO_ACTIVE_TAB);
  }

  // Do not run the audits on browser internal pages
  if (
    tab.url?.startsWith("chrome://") ||
    tab.url?.startsWith("edge://") ||
    tab.url?.startsWith("about:")
  ) {
    throw new Error(ERROR_MESSAGES.BROWSER_INTERNAL_PAGE);
  }

  return true;
};

export const saveAuditResultToLocal = async (response: AuditResponse) => {
  try {
    if (response && response.success) {
      const result = response.data as AuditResult;
      await chrome.storage.local.set({
        auditResults: result,
        auditInProgress: false,
      });
      await saveToHistory(result);
    } else {
      const errorPayload = createAuditError({
        caller: "saveAuditResultToLocal",
        message: response?.error || ERROR_MESSAGES.AUDIT_FAILED,
      });
      await chrome.storage.local.set({
        auditError: errorPayload,
        auditInProgress: false,
      });
    }
  } catch (error) {
    await chrome.storage.local.set({
      auditError: {
        message: (error as Error)?.message || ERROR_MESSAGES.AUDIT_SAVE_FAILED,
        timestamp: new Date().toISOString(),
      },
      auditInProgress: false,
    });
    // TODO: Need to handle the error use-case & how to show in the audit history
  }
};

export const saveToHistory = async (result: AuditResult) => {
  try {
    const data = await chrome.storage.local.get("auditHistory");
    const history = (data.auditHistory as AuditResult[]) || [];
    const newHistory = [result, ...history].slice(0, 50);
    await chrome.storage.local.set({ auditHistory: newHistory });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error(ERROR_MESSAGES.FAILED_TO_SAVE_HISTORY);
  }
};

export const createAuditError = ({
  caller,
  message,
}: {
  caller: string;
  message: string;
}): AuditError => ({
  caller,
  message,
  timestamp: new Date().toISOString(),
});
