import type { AIProvider, ConformanceLvl } from ".";

export interface AppSettings {
  ai: {
    provider: AIProvider;
    apiKeys: Partial<Record<AIProvider, string>>;
  };
  audit: {
    conformanceLvl: ConformanceLvl;
    includeBestPractices: boolean;
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  ai: {
    provider: "gemini",
    apiKeys: {},
  },
  audit: {
    conformanceLvl: "AA",
    includeBestPractices: false,
  },
};
