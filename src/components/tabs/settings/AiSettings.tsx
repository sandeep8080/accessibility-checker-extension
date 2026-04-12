import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";
import type { AIProvider } from "../../../types";

export default function AiSettings({
  apiKey,
  provider,
  onChangeApiKey,
  onChangeProvider,
}: {
  apiKey: string;
  provider: AIProvider;
  onChangeApiKey: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeProvider: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <div>
      <h2 className="text-text-primary flex items-center gap-2 text-lg font-semibold">
        <Key className="text-accent-foreground" size={20} />
        API Configuration
      </h2>
      <p className="text-text-muted text-sm">
        To enable AI fix suggestions, you need to provide an API key. Your key
        is stored securely in your browser's local storage and is never sent to
        any server other than the AI provider.
      </p>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-text-secondary text-sm font-medium">
            AI Provider
          </label>
          <select
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
            <label className="text-text-secondary text-sm font-medium">
              API Key
            </label>
            {provider === "gemini" && (
              <a
                href="https://aistudio.google.com/apikey"
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
              type={isVisible ? "text" : "password"}
              value={apiKey}
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
        </div>
      </div>
    </div>
  );
}
