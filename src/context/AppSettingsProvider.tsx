import { useEffect, useState } from "react";

import { type AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { STORAGE_KEY } from "../utils/constant";
import AppSettingsContext from "./AppSettingsContext";

const AppSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  // Global settings State
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load saved Settings
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY]).then((result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] });
      }
    });
  }, []);

  // Update the settings both locally & in Chrome storage
  const updateSettings = async (
    section: keyof AppSettings,
    data: Partial<AppSettings[keyof AppSettings]>
  ) => {
    const updates = {
      ...settings,
      [section]: {
        ...settings[section],
        ...data,
      },
    };
    setSettings(updates);

    // Update the storage
    await chrome.storage.local.set({ [STORAGE_KEY]: updates });
  };

  // Reset the App settings
  const resetSettings = async () => {
    setSettings({ ...DEFAULT_SETTINGS });
    // Reset from the store
    await chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_SETTINGS });
  };

  // Function to save the API key on the storage
  const saveKey = async () => {
    await chrome.storage.local.set({ [STORAGE_KEY]: settings });
  };
  return (
    <AppSettingsContext.Provider
      value={{ settings, setSettings, updateSettings, resetSettings, saveKey }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export default AppSettingsProvider;
