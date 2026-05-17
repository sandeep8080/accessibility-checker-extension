import { useState } from "react";

import { CheckCircle2, Eye, EyeOff, Info, Key, Save } from "lucide-react";

import useAppSettings from "../../../../hooks/useAppSettings";
import type { AIProvider } from "../../../../types";
import {
  AI_PROVIDER_CONFIG,
  CTA,
  UI_MESSAGES,
} from "../../../../utils/constant";

export default function AiSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { settings, setSettings, updateSettings, saveKey } = useAppSettings();
  const { apiKeys, provider } = settings.ai;

  const onChangeApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({
      ...prev,
      ai: {
        ...prev.ai,
        apiKeys: {
          ...prev.ai.apiKeys,
          [provider]: e.target.value,
        },
      },
    }));
  };

  const onChangeProvider = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings("ai", { provider: e.target.value as AIProvider });
  };

  const handleSave = async () => {
    await saveKey();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section aria-labelledby="ai-settings-heading">
      <h2
        id="ai-settings-heading"
        className="text-text-primary flex items-center gap-2 text-lg font-semibold"
      >
        <Key className="text-accent-foreground" size={20} aria-hidden />
        {UI_MESSAGES.AI_SECTION_TITLE}
      </h2>
      {/* ← Compact one-liner + tooltip instead of long paragraph */}
      <p className="text-text-muted mb-3 text-xs">
        {UI_MESSAGES.API_CONFIG_DESCRIPTION}
        <span
          className="text-text-muted ml-1 cursor-help underline decoration-dotted"
          title="Your key is stored in your browser's local storage and is only sent to the AI provider — never to any other server."
        >
          <Info size={12} className="mb-0.5 inline" aria-hidden /> How is my key
          used?
        </span>
      </p>
      <div className="space-y-4">
        {/* Provider dropdown */}
        <div className="space-y-1.5">
          <label
            className="text-text-secondary text-sm font-medium"
            htmlFor="provider"
          >
            {UI_MESSAGES.AI_PROVIDER_LABEL}
          </label>
          <select
            id="provider"
            value={provider}
            onChange={onChangeProvider}
            className="border-border-primary bg-bg-secondary text-text-secondary focus:border-accent-primary focus:ring-accent-primary w-full appearance-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-1"
          >
            <option value="gemini">Google Gemini (Free Tier available)</option>
            <option value="claude" disabled>
              Anthropic Claude (Coming soon)
            </option>
            <option value="groq" disabled>
              Groq (Coming soon)
            </option>
          </select>
        </div>
        {/* API Key input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              className="text-text-secondary text-sm font-medium"
              htmlFor="apiKey"
            >
              {UI_MESSAGES.AI_API_KEY_LABEL}
            </label>
            {provider === "gemini" && (
              <a
                href={AI_PROVIDER_CONFIG[provider].url}
                target="_blank"
                rel="noreferrer"
                className="text-status-info text-xs underline hover:opacity-80"
              >
                {CTA.GET_A_FREE_KEY_LINK}
              </a>
            )}
          </div>
          <div className="relative">
            <input
              id="apiKey"
              type={isVisible ? "text" : "password"}
              value={apiKeys?.[provider] || ""}
              onChange={onChangeApiKey}
              placeholder="Enter your API key..."
              className="border-border-primary bg-bg-secondary text-text-secondary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border py-2 pr-10 pl-3 text-sm outline-none focus:ring-1"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              aria-label={isVisible ? "Hide API key" : "Show API key"}
              className="text-text-muted hover:text-text-secondary absolute top-2.5 right-2.5"
            >
              {isVisible ? (
                <EyeOff size={16} aria-hidden />
              ) : (
                <Eye size={16} aria-hidden />
              )}
            </button>
          </div>
          {/* ← Inline save button, not full-width */}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!apiKeys?.[provider]?.trim()}
              className="bg-accent-primary hover:bg-accent-secondary inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaved ? (
                <CheckCircle2 size={14} aria-hidden />
              ) : (
                <Save size={14} aria-hidden />
              )}
              {isSaved ? "Saved!" : "Save key"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
