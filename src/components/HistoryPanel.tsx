import { useState, useEffect } from "react";
import { History, Download, Trash2, Calendar } from "lucide-react";
import type { AuditResult } from "../types";

export function HistoryPanel() {
  const [history, setHistory] = useState<AuditResult[]>([]);

  const loadHistory = () => {
    chrome.storage.local.get("auditHistory").then((result) => {
      if (result.auditHistory) {
        // Sort newest first
        const sorted = (result.auditHistory as AuditResult[]).sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setHistory(sorted);
      }
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = async () => {
    if (confirm("Are you sure you want to clear all audit history?")) {
      await chrome.storage.local.remove("auditHistory");
      setHistory([]);
    }
  };

  const exportAsJSON = (result: AuditResult) => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(result, null, 2));
    const title = new URL(result.url).hostname.replace(/[^a-z0-9]/gi, "_");
    const filename = `a11y-audit_${title}_${new Date(result.timestamp).toISOString().split("T")[0]}.json`;

    // Create download link
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  };

  if (history.length === 0) {
    return (
      <div className="text-text-muted flex h-64 flex-col items-center justify-center space-y-3 px-6 text-center">
        <div className="border-border-primary bg-bg-secondary rounded-full border p-3">
          <History size={32} className="text-text-muted" />
        </div>
        <p>No audit history found.</p>
        <p className="text-sm">Run an audit on any page to see it here.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-text-primary flex items-center gap-2 text-lg font-semibold">
          <History className="text-accent-foreground" size={20} />
          Past Audits
        </h2>

        <button
          onClick={clearHistory}
          className="bg-status-error/10 text-status-error hover:bg-status-error/20 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors hover:opacity-80"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {history.map((result, idx) => {
          const url = new URL(result.url);
          const date = new Date(result.timestamp);

          return (
            <div
              key={idx}
              className="border-border-primary bg-bg-secondary group relative rounded-md border p-3"
            >
              <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => exportAsJSON(result)}
                  className="bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary mt-6 rounded p-1.5 hover:text-text-primary transition-colors"
                  title="Export JSON"
                >
                  <Download size={14} />
                </button>
              </div>

              <div className="pr-8">
                <h3
                  className="text-text-secondary truncate text-sm font-medium"
                  title={result.url}
                >
                  {url.hostname}
                </h3>
                <p className="text-text-muted mt-0.5 truncate text-xs">
                  {url.pathname}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="text-text-muted flex items-center gap-1.5">
                  <Calendar size={12} />
                  {date.toLocaleDateString()}{" "}
                  {date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="flex gap-2 font-medium">
                  {result.summary.error > 0 && (
                    <span className="text-status-error">
                      {result.summary.error} err
                    </span>
                  )}
                  {result.summary.warning > 0 && (
                    <span className="text-status-warning">
                      {result.summary.warning} warn
                    </span>
                  )}
                  {result.summary.notice > 0 && (
                    <span className="text-status-info">
                      {result.summary.notice} not
                    </span>
                  )}
                  {result.summary.total === 0 && (
                    <span className="text-status-success">Perfect ✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
