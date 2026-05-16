import { useEffect, useState } from "react";

import { type AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { STORAGE_KEY } from "../utils/constant";

export const useAppSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY]).then((result) => {
      if (result[STORAGE_KEY]) {
        setSettings({ ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] });
      }
    });
  }, []);

  const updateSettings = async (
    section: keyof AppSettings,
    data: Partial<AppSettings[keyof AppSettings]>
  ) => {
    const newSettings = {
      ...settings,
      [section]: {
        ...settings[section],
        ...data,
      },
    };

    setSettings(newSettings);
    chrome.storage.local.set({ [STORAGE_KEY]: newSettings });
  };

  const saveApiKeyToLocal = async () => {
    return chrome.storage.local.set({ [STORAGE_KEY]: settings });
  };

  const resetSettings = async () => {
    return chrome.storage.local.set({ [STORAGE_KEY]: DEFAULT_SETTINGS });
  };

  return {
    settings,
    setSettings,
    updateSettings,
    saveApiKeyToLocal,
    resetSettings,
  };
};
