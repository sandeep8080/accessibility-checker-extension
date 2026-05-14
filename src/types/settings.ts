import type { AIProvider, ConformanceLvl } from ".";

export interface AppSettings {
  // AI Configuration
  ai: {
    provider: AIProvider;
    apiKeys: Partial<Record<AIProvider, string>>;
  };
  // AUDIT Configuration
  audit: {
    conformanceLvl: ConformanceLvl;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  ai: {
    apiKeys: {},
    provider: "gemini",
  },
  audit: {
    conformanceLvl: "AA",
  },
};
