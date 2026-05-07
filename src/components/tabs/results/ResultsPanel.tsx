import { useCallback, useEffect, useReducer } from "react";

import { CheckCircle } from "lucide-react";

import type { AuditResult, AuditState } from "../../../types";
import { saveAuditResultToLocal, tabValidator } from "../../../utils";
import { reducer } from "../../../utils/auditResultReducer";
import { ACTIONS, ERROR_MESSAGES, UI_MESSAGES } from "../../../utils/constant";
import { ErrorComponent } from "../../common/ErrorComponent";
import { Loading } from "../../common/Loading";
import { RunAuditButton } from "../../common/RunAuditButton";
import AuditLanding from "./AuditLanding";
import { ViolationList } from "./ViolationList";

const initialState: AuditState = {
  status: "IDLE",
};

export default function ResultsPanel() {
  const [auditState, dispatch] = useReducer(reducer, initialState);

  const runAudit = useCallback(async () => {
    dispatch({ type: "RUN_AUDIT" });
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
        dispatch({
          type: "AUDIT_ERROR",
          payload: ERROR_MESSAGES.AUDIT_TAB_INACCESSIBLE,
        });
      }
    } catch (err: unknown) {
      console.error("Audit Error:", err);
      dispatch({
        type: "AUDIT_ERROR",
        payload:
          err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR,
      });
    }
  }, []);

  // useEffect to read the audit history for the given URL & display the latest result on the results tab
  useEffect(() => {
    const getAuditHistoryForCurrentTab = async () => {
      // Get the current tab info
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      // Now filter out the current tab's audit history form the audit history stored
      chrome.storage.local.get("auditHistory").then((result) => {
        if (result.auditHistory) {
          const history = result.auditHistory as AuditResult[];
          const currentTabHistory = history.filter(
            (item) => item.url === tab.url
          );
          if (currentTabHistory.length > 0) {
            // Sort by timestamp to get the latest result
            const sorted = currentTabHistory.sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );
            dispatch({ type: "AUDIT_SUCCESS", payload: sorted[0] });
          }
        }
      });
    };
    getAuditHistoryForCurrentTab();
  }, []);

  // useEffect to listen to the local storage changes & update the results tab
  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      area: string
    ) => {
      if (
        area === "local" &&
        changes.auditInProgress &&
        changes.auditInProgress.newValue === true
      ) {
        dispatch({
          type: "RUN_AUDIT",
        });
      }

      if (area === "local" && changes.auditResults) {
        console.log(
          "Audit results updated in storage, refreshing results tab...",
          changes.auditResults
        );
        dispatch({
          type: "AUDIT_SUCCESS",
          payload: changes.auditResults.newValue as AuditResult,
        });
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  if (auditState.status === "AUDITING") {
    return <Loading />;
  }

  if (auditState.status === "ERROR") {
    return <ErrorComponent error={auditState.error} runAudit={runAudit} />;
  }
  return (
    <div className="flex h-full flex-col">
      {auditState.status === "IDLE" && <AuditLanding runAudit={runAudit} />}
      {auditState.status === "SUCCESS" && (
        <div className="flex min-h-full flex-col p-4">
          {auditState?.auditResult.summary.total === 0 ? (
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
                <div className="flex justify-between items-center">
                  <h2 className="text-text-primary mb-1 text-lg leading-tight font-semibold">
                    Found {auditState?.auditResult.summary.total} Issues
                  </h2>
                  <RunAuditButton runAudit={runAudit} />
                </div>
                <p
                  className="text-text-muted truncate text-xs"
                  title={auditState?.auditResult.url}
                >
                  {new URL(auditState?.auditResult.url).hostname}
                </p>
              </div>
              <ViolationList violations={auditState?.auditResult.violations} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
