import { useEffect, useState } from "react";

import { type AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { STORAGE_KEY } from "../utils/constant";
import { SettingsContext } from "./SettingsContext";

// 2. Provide the context

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load the local app settings
  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY]).then((result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] });
      }
    });
  }, []);

  // Function to update the settings state
  const updateSettings = (
    section: keyof AppSettings,
    data: Partial<AppSettings[keyof AppSettings]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  // Function to save the settings locally
  const saveSettings = async () => {
    return chrome.storage.local.set({ [STORAGE_KEY]: settings });
  };

  /** Reset Function
   * After the reset there are 2 options to sync the state
   * 1. update the react local state
   * 2. Listen to the onchange to the chrome.storage.onChange
   *
   */
  const resetSettings = async () => {
    setSettings(DEFAULT_SETTINGS);
    return chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_SETTINGS });
  };

  return (
    <SettingsContext.Provider
      value={{ settings, updateSettings, saveSettings, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
