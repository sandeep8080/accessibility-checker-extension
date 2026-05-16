import { useState } from "react";

import { CheckCircle2, Eye, EyeOff, Key, Save } from "lucide-react";

import { useAppSettings } from "../../../../hooks/useAppSettings";
import type { AIProvider } from "../../../../types";
import { AI_PROVIDER_CONFIG, UI_MESSAGES } from "../../../../utils/constant";

export default function AiSettings() {
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { settings, setSettings, updateSettings, saveApiKeyToLocal } =
    useAppSettings();
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
    await saveApiKeyToLocal();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <section aria-labelledby="ai-settings-heading">
      <h2 className="text-text-primary flex items-center gap-2 text-lg font-semibold">
        <Key className="text-accent-foreground" size={20} aria-hidden />
        API Configuration
      </h2>
      <p className="text-text-muted text-sm">
        {UI_MESSAGES.API_CONFIG_DESCRIPTION}
      </p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="text-text-secondary text-sm font-medium"
            htmlFor="provider"
          >
            AI Provider
          </label>
          <select
            id="provider"
            value={provider}
            onChange={(e) => onChangeProvider(e)}
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              className="text-text-secondary text-sm font-medium"
              htmlFor="apiKey"
            >
              API Key
            </label>
            {provider === "gemini" && (
              <a
                href={AI_PROVIDER_CONFIG[provider].url}
                target="_blank"
                rel="noreferrer"
                className="text-status-info text-xs underline hover:opacity-80"
              >
                Get a free key
              </a>
            )}
          </div>
          <div className="relative">
            <input
              id="apiKey"
              type={isVisible ? "text" : "password"}
              value={apiKeys?.[provider] || ""}
              onChange={(e) => onChangeApiKey(e)}
              placeholder="Enter your API key..."
              className="border-border-primary bg-bg-secondary text-text-secondary focus:border-accent-primary focus:ring-accent-primary w-full rounded-md border py-2 pr-10 pl-3 text-sm outline-none focus:ring-1"
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="text-text-muted hover:text-text-secondary absolute top-2.5 right-2.5"
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="bg-accent-primary hover:bg-accent-secondary flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaved ? (
              <CheckCircle2 size={16} aria-hidden />
            ) : (
              <Save size={16} aria-hidden />
            )}
            {isSaved ? "Saved!" : "Save key"}
          </button>
        </div>
      </div>
    </section>
  );
}
