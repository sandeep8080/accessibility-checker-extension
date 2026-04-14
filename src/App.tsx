import { useState, useEffect, useCallback } from "react";
import {
  Activity,
  History as HistoryIcon,
  Settings as SettingsIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { AuditResult } from "./types";
import { ViolationList } from "./components/ViolationList";
import { HistoryPanel } from "./components/HistoryPanel";
import { SettingsPanel } from "./components/tabs/settings/SettingsPanel";
import TabButton from "./components/common/TabButton";
import { saveAuditResultToLocal, tabValidator } from "./utils";
import { ACTIONS, ERROR_MESSAGES, UI_MESSAGES } from "./utils/constant";

type Tab = "results" | "history" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("results");
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

        // TODO: Can we move this if-else validation in saveAuditResultToLocal function in utils?
        if (response && response.success) {
          saveAuditResultToLocal(response.data);
          setIsAuditing(false);
        } else {
          setIsAuditing(false);
          throw new Error(response?.error || ERROR_MESSAGES.AUDIT_FAILED);
        }
      } else {
        setIsAuditing(false);
        setError(ERROR_MESSAGES.AUDIT_TAB_INACCESSIBLE);
        // TODO: Will handle this case later
        // Need to do some validation handling here
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
        setIsAuditing(changes.auditInProgress.newValue);
      }

      if (area === "local" && changes.auditResults) {
        console.log(
          "Audit results updated in storage, refreshing results tab...",
          changes.auditResults
        );
        setAuditResult(changes.auditResults.newValue);
        setIsAuditing(false);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden font-sans">
      <header className="bg-bg-primary border-border-secondary flex-none border-b">
        <div className="no-scrollbar flex gap-1 overflow-x-auto px-2 pt-2">
          <TabButton
            active={activeTab === "results"}
            onClick={() => setActiveTab("results")}
            icon={<Activity size={16} />}
            label="Results"
          />
          <TabButton
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
            icon={<HistoryIcon size={16} />}
            label="History"
          />
          <TabButton
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
            icon={<SettingsIcon size={16} />}
            label="Settings"
          />
        </div>
      </header>

      <main className="no-scrollbar bg-bg-primary relative min-h-0 flex-1 overflow-y-auto">
        {activeTab === "settings" && <SettingsPanel />}
        {activeTab === "history" && <HistoryPanel />}

        {activeTab === "results" && (
          <div className="flex h-full flex-col">
            {isAuditing ? (
              <div className="flex flex-1 animate-pulse flex-col items-center justify-center p-8 text-center">
                <div className="border-t-accent-primary border-accent-primary/30 mb-4 h-12 w-12 animate-spin rounded-full border-4" />
                <h2 className="text-text-secondary text-lg font-medium">
                  {UI_MESSAGES.ANALYZING_PAGE}
                </h2>
                <p className="text-text-muted mt-2 text-sm">
                  {UI_MESSAGES.WCAG_COMPLIANCE_CHECK}
                </p>
              </div>
            ) : error ? (
              <div className="text-text-secondary flex flex-1 flex-col items-center justify-center p-8 text-center">
                <AlertCircle
                  size={48}
                  className="text-status-error mb-4 opacity-80"
                />
                <h2 className="text-status-error mb-2 text-lg font-semibold">
                  {UI_MESSAGES.AUDIT_FAILED_TITLE}
                </h2>
                <p className="text-text-muted max-w-[250px] text-sm">{error}</p>
                <button
                  onClick={() => runAudit()}
                  className="bg-bg-secondary border-border-base hover:bg-bg-tertiary mt-6 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
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
        )}
      </main>
    </div>
  );
}

export default App;
