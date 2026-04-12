import { useState, useEffect } from "react";
import { Save, Trash2, CheckCircle2 } from "lucide-react";
import type { AIProvider } from "../../../types";
import AuditSettings from "./AuditSettings";
// import { ThemePreference } from "./ThemePreference";
import { Divider } from "../../common/Divider";
import AiSettings from "./AiSettings";

export function SettingsPanel() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [conformanceLvl, setConformanceLvl] = useState("AA");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.local
      .get(["apiKey", "aiProvider", "conformanceLvl"])
      .then((result) => {
        if (result.apiKey) setApiKey(result.apiKey as string);
        if (result.aiProvider) setProvider(result.aiProvider as AIProvider);
        if (result.conformanceLvl)
          setConformanceLvl(result.conformanceLvl as string);
      });
  }, []);

  const onChangeApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const onChangeProvider = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProvider(e.target.value as AIProvider);
  };

  const onChangeConformanceLvl = async (lvl: string) => {
    setConformanceLvl(lvl);
    // Auto-save conformance level immediately so next audit uses updated setting
    await chrome.storage.local.set({ conformanceLvl: lvl });
    console.log("✅ Conformance level saved:", lvl);
  };

  const onClickAutoAudit = () => {
    // Toggle auto-audit setting in storage
    console.log("Auto-Audit toggled");
  };

  const handleSave = async () => {
    await chrome.storage.local.set({
      apiKey: apiKey.trim(),
      aiProvider: provider,
      conformanceLvl: conformanceLvl,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = async () => {
    await chrome.storage.local.remove(["apiKey", "aiProvider"]);
    setApiKey("");
    setProvider("gemini");
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        {/* AI Key container */}
        <AiSettings
          apiKey={apiKey}
          provider={provider}
          onChangeApiKey={onChangeApiKey}
          onChangeProvider={onChangeProvider}
        />
        <Divider />
        <AuditSettings
          conformanceLvl={conformanceLvl}
          onChangeConformanceLvl={onChangeConformanceLvl}
          onClickAutoAudit={onClickAutoAudit}
        />
        <Divider />
        {/* <ThemePreference /> */}

        {/* Button Container */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="bg-accent-primary hover:bg-accent-secondary flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {isSaved ? "Saved!" : "Save Key"}
          </button>
          <button
            onClick={handleClear}
            disabled={!apiKey}
            className="border-border-primary bg-bg-secondary text-text-secondary hover:border-status-error/30 hover:bg-status-error/20 hover:text-status-error flex items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
