import { useState, useEffect } from 'react';
import { History, Download, Trash2, Calendar } from 'lucide-react';
import type { AuditResult } from '../types';

export function HistoryPanel() {
  const [history, setHistory] = useState<AuditResult[]>([]);

  const loadHistory = () => {
    chrome.storage.local.get('auditHistory').then((result) => {
      if (result.auditHistory) {
      // Sort newest first
      const sorted = (result.auditHistory as AuditResult[]).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setHistory(sorted);
      }
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = async () => {
    if (confirm('Are you sure you want to clear all audit history?')) {
      await chrome.storage.local.remove('auditHistory');
      setHistory([]);
    }
  };

  const exportAsJSON = (result: AuditResult) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const title = new URL(result.url).hostname.replace(/[^a-z0-9]/gi, '_');
    const filename = `a11y-audit_${title}_${new Date(result.timestamp).toISOString().split('T')[0]}.json`;
    
    // Create download link
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", filename);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 space-y-3 px-6 text-center">
        <div className="p-3 bg-slate-800 rounded-full border border-slate-700">
          <History size={32} className="text-slate-500" />
        </div>
        <p>No audit history found.</p>
        <p className="text-sm">Run an audit on any page to see it here.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <History className="text-purple-400" size={20} />
          Past Audits
        </h2>
        
        <button
          onClick={clearHistory}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
        >
          <Trash2 size={12} /> Clear
        </button>
      </div>

      <div className="space-y-3">
        {history.map((result, idx) => {
          const url = new URL(result.url);
          const date = new Date(result.timestamp);
          
          return (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-md p-3 relative group">
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => exportAsJSON(result)}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 hover:text-white"
                  title="Export JSON"
                >
                  <Download size={14} />
                </button>
              </div>

              <div className="pr-8">
                <h3 className="font-medium text-slate-200 text-sm truncate" title={result.url}>
                  {url.hostname}
                </h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{url.pathname}</p>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar size={12} />
                  {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <div className="flex gap-2 font-medium">
                  {result.summary.error > 0 && <span className="text-rose-400">{result.summary.error} err</span>}
                  {result.summary.warning > 0 && <span className="text-amber-400">{result.summary.warning} warn</span>}
                  {result.summary.notice > 0 && <span className="text-blue-400">{result.summary.notice} not</span>}
                  {result.summary.total === 0 && <span className="text-emerald-400">Perfect ✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
