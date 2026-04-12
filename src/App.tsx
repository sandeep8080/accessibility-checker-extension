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

type Tab = "results" | "history" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("results");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runAudit = useCallback(async () => {
    setIsAuditing(true);
    setError(null);

    try {
      // 1. Get active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id) {
        throw new Error("No active tab found");
      }

      if (
        tab.url?.startsWith("chrome://") ||
        tab.url?.startsWith("edge://") ||
        tab.url?.startsWith("about:")
      ) {
        throw new Error("Cannot audit browser internal pages.");
      }

      console.log("📤 UI: Requesting audit from content script...");
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "RUN_AUDIT",
      });

      console.log("📥 UI: Audit response received:", response);

      if (response && response.success) {
        setAuditResult(response.data);
        saveToHistory(response.data);
      } else {
        throw new Error(response?.error || "Failed to run audit");
      }
    } catch (err: unknown) {
      console.error("Audit Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. You might need to refresh the page."
      );
    } finally {
      setIsAuditing(false);
    }
  }, []);

  useEffect(() => {
    runAudit();
  }, [runAudit]);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === "AUDIT_RESULT") {
        console.log(
          "Received AUDIT_RESULT message in App component:",
          message.payload
        );
        setAuditResult(message.payload.data);
        saveToHistory(message.payload.data);
      }
    });
  });

  const saveToHistory = async (result: AuditResult) => {
    try {
      const data = await chrome.storage.local.get("auditHistory");
      const history = (data.auditHistory as AuditResult[]) || [];
      const newHistory = [result, ...history].slice(0, 50);
      await chrome.storage.local.set({ auditHistory: newHistory });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

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
                  Analyzing Page...
                </h2>
                <p className="text-text-muted mt-2 text-sm">
                  Checking for WCAG 2.1 compliance
                </p>
              </div>
            ) : error ? (
              <div className="text-text-secondary flex flex-1 flex-col items-center justify-center p-8 text-center">
                <AlertCircle
                  size={48}
                  className="text-status-error mb-4 opacity-80"
                />
                <h2 className="text-status-error mb-2 text-lg font-semibold">
                  Audit Failed
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
                      Perfect Score!
                    </h2>
                    <p className="text-text-muted max-w-[280px] text-sm">
                      No accessibility violations found on this page. Great job!
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
