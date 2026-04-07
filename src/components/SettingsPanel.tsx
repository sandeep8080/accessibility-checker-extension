import { useState, useEffect } from "react";
import { Key, Save, Trash2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import type { AIProvider } from "../types";

export function SettingsPanel() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    chrome.storage.local.get(["apiKey", "aiProvider"]).then((result) => {
      if (result.apiKey) setApiKey(result.apiKey as string);
      if (result.aiProvider) setProvider(result.aiProvider as AIProvider);
    });
  }, []);

  const handleSave = async () => {
    await chrome.storage.local.set({
      apiKey: apiKey.trim(),
      aiProvider: provider,
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
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <Key className="text-purple-400" size={20} />
            API Configuration
          </h2>
          <p className="text-sm text-slate-400">
            To enable AI fix suggestions, you need to provide an API key. Your
            key is stored securely in your browser's local storage and is never
            sent to any server other than the AI provider.
          </p>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">
                AI Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as AIProvider)}
                className="w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="gemini">
                  Google Gemini (Free Tier available)
                </option>
                <option value="claude" disabled>
                  Anthropic Claude (Coming soon)
                </option>
                <option value="groq" disabled>
                  Groq (Coming soon)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-300">
                  API Key
                </label>
                {provider === "gemini" && (
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 underline hover:text-blue-300"
                  >
                    Get a free key
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={isVisible ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full rounded-md border border-slate-700 bg-slate-800 py-2 pr-10 pl-3 text-sm text-slate-200 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-300"
                >
                  {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-purple-600 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {isSaved ? "Saved!" : "Save Key"}
          </button>
          <button
            onClick={handleClear}
            disabled={!apiKey}
            className="flex items-center justify-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-4 text-sm font-medium text-slate-300 transition-colors hover:border-red-500/30 hover:bg-red-500/20 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
