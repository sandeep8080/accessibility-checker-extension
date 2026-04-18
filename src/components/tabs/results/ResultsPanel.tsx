import { useCallback, useEffect, useState } from "react";

import { CheckCircle } from "lucide-react";

import type { AuditResult } from "../../../types";
import { saveAuditResultToLocal, tabValidator } from "../../../utils";
import { ACTIONS, ERROR_MESSAGES, UI_MESSAGES } from "../../../utils/constant";
import { ErrorComponent } from "../../common/ErrorComponent";
import { Loading } from "../../common/Loading";
import { ViolationList } from "./ViolationList";

export default function ResultsPanel() {
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runAudit = useCallback(async () => {
    // Set the loading state true & reset the error state
    setError(null);
    setIsAuditing(true);
    try {
      // 1. Get active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tabValidator(tab)) {
        console.log("📤 UI: Requesting audit from content script...");
        const response = await chrome.tabs.sendMessage(tab.id, {
          action: ACTIONS.RUN_AUDIT,
        });

        console.log("📥 UI: Audit response received:", response);
        // Save results to local storage (which will trigger the UI update via the storage listener)
        saveAuditResultToLocal(response);
      } else {
        setIsAuditing(false);
        setError(ERROR_MESSAGES.AUDIT_TAB_INACCESSIBLE);
      }
    } catch (err: unknown) {
      console.error("Audit Error:", err);
      setError(
        err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR
      );
    } finally {
      setIsAuditing(false);
    }
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  // useEffect to listen to the local storage changes & update the results tab
  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (area === "local" && changes.auditInProgress) {
        setIsAuditing(changes.auditInProgress.newValue as boolean);
      }

      if (area === "local" && changes.auditResults) {
        console.log(
          "Audit results updated in storage, refreshing results tab...",
          changes.auditResults
        );
        setAuditResult(changes.auditResults.newValue as AuditResult);
        setIsAuditing(false);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (isAuditing) {
    return <Loading />;
  }
  return (
    <div className="flex h-full flex-col">
      {error ? (
        <ErrorComponent error={error} runAudit={runAudit} />
      ) : auditResult ? (
        <div className="flex min-h-full flex-col p-4">
          {auditResult.summary.total === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
              <div className="bg-status-success/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <CheckCircle size={40} className="text-status-success" />
              </div>
              <h2 className="text-status-success mb-2 text-xl font-semibold">
                {UI_MESSAGES.PERFECT_SCORE_TITLE}
              </h2>
              <p className="text-text-muted max-w-[280px] text-sm">
                {UI_MESSAGES.PERFECT_SCORE_DESCRIPTION}
              </p>
            </div>
          ) : (
            <>
              <div className="border-border-secondary mb-6 border-b pb-4">
                <h2 className="text-text-primary mb-1 text-lg leading-tight font-semibold">
                  Found {auditResult.summary.total} Issues
                </h2>
                <p
                  className="text-text-muted truncate text-xs"
                  title={auditResult.url}
                >
                  {new URL(auditResult.url).hostname}
                </p>
              </div>

              <ViolationList violations={auditResult.violations} />
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
