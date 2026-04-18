import { useState } from "react";

import {
  Activity,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from "lucide-react";

import TabButton from "./components/common/TabButton";
import { HistoryPanel } from "./components/HistoryPanel";
import ResultsPanel from "./components/tabs/results/ResultsPanel";
import { SettingsPanel } from "./components/tabs/settings/SettingsPanel";

type Tab = "results" | "history" | "settings";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("results");

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

        {activeTab === "results" && <ResultsPanel />}
      </main>
    </div>
  );
}

export default App;
