import { useState, useEffect } from 'react';
import { Activity, History as HistoryIcon, Settings as SettingsIcon, AlertCircle, CheckCircle } from 'lucide-react';
import type { AuditResult } from './types';
import { ViolationList } from './components/ViolationList';
import { HistoryPanel } from './components/HistoryPanel';
import { SettingsPanel } from './components/SettingsPanel';

type Tab = 'results' | 'history' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('results');
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runAudit();
  }, []);

  const runAudit = async () => {
    setIsAuditing(true);
    setError(null);
    
    try {
      // 1. Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) {
        throw new Error('Cannot audit browser internal pages.');
      }

      const response = await chrome.tabs.sendMessage(tab.id, { action: 'RUN_AUDIT' });
      
      if (response && response.success) {
        setAuditResult(response.data);
        saveToHistory(response.data);
      } else {
        throw new Error(response?.error || 'Failed to run audit');
      }
    } catch (err: any) {
      console.error('Audit Error:', err);
      setError(err.message || 'An unexpected error occurred. You might need to refresh the page.');
    } finally {
      setIsAuditing(false);
    }
  };

  const saveToHistory = async (result: AuditResult) => {
    try {
      const data = await chrome.storage.local.get('auditHistory');
      const history = (data.auditHistory as AuditResult[]) || [];
      const newHistory = [result, ...history].slice(0, 50);
      await chrome.storage.local.set({ auditHistory: newHistory });
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden font-sans">
      <header className="flex-none bg-slate-900 border-b border-slate-800">
        <div className="flex px-2 pt-2 gap-1 overflow-x-auto no-scrollbar">
          <TabButton 
            active={activeTab === 'results'} 
            onClick={() => setActiveTab('results')}
            icon={<Activity size={16} />}
            label="Results"
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
            icon={<HistoryIcon size={16} />}
            label="History"
          />
          <TabButton 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')}
            icon={<SettingsIcon size={16} />}
            label="Settings"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar relative min-h-0 bg-slate-900">
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'history' && <HistoryPanel />}
        
        {activeTab === 'results' && (
          <div className="h-full flex flex-col">
            {isAuditing ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-pulse">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mb-4" />
                <h2 className="text-lg font-medium text-slate-200">Analyzing Page...</h2>
                <p className="text-sm text-slate-400 mt-2">Checking for WCAG 2.1 compliance</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-300">
                <AlertCircle size={48} className="text-rose-500 mb-4 opacity-80" />
                <h2 className="text-lg font-semibold text-rose-400 mb-2">Audit Failed</h2>
                <p className="text-sm text-slate-400 max-w-[250px]">{error}</p>
                <button 
                  onClick={() => runAudit()}
                  className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition-colors border border-slate-700"
                >
                  Try Again
                </button>
              </div>
            ) : auditResult ? (
              <div className="p-4 flex flex-col min-h-full">
                {auditResult.summary.total === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={40} className="text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-emerald-400 mb-2">Perfect Score!</h2>
                    <p className="text-sm text-slate-400 max-w-[280px]">
                      No accessibility violations found on this page. Great job!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 pb-4 border-b border-slate-800">
                      <h2 className="text-lg font-semibold text-slate-100 mb-1 leading-tight">
                        Found {auditResult.summary.total} Issues
                      </h2>
                      <p className="text-xs text-slate-400 truncate" title={auditResult.url}>
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

function TabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all rounded-t-lg border-b-2
        ${active 
          ? 'text-purple-400 bg-slate-800/80 border-purple-500' 
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
