import { createContext, type Dispatch, type SetStateAction } from "react";

import type { AppSettings } from "../types/settings";

/**
 * This is a Context + Hook pattern
 * This encapsulates settings state and updater functions. Basically means that its self sufficient.
 * In Normal context pattern the state logic is handled by the parent and passed into the context provider,
 * which make it available everywhere
 * In this pattern the provider handle the state logic
 */

interface SettingsContextValue {
  settings: AppSettings;
  setSettings: Dispatch<SetStateAction<AppSettings>>;
  updateSettings: (
    section: keyof AppSettings,
    data: Partial<AppSettings[keyof AppSettings]>
  ) => void;
  saveKey: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const AppSettingsContext = createContext<SettingsContextValue | null>(null);
export default AppSettingsContext;
