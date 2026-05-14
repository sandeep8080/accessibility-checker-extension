import { createContext } from "react";

import { type AppSettings } from "../types/settings";

/**
 * This is a Context + Hook pattern
 * This encapsulates settings state and updater functions. Basically means that its self sufficient.
 * In Normal context pattern the state logic is handled by the parent and passed into the context provider,
 * which make it available everywhere
 * In this pattern the provider handle the state logic
 */

interface SettingContextValue {
  settings: AppSettings;
  updateSettings: (
    section: keyof AppSettings,
    data: Partial<AppSettings[keyof AppSettings]>
  ) => void;
  saveSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

// 1. Create a context
export const SettingsContext = createContext<SettingContextValue | null>(null);
