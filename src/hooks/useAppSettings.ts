import { useContext } from "react";

import AppSettingsContext from "../context/AppSettingsContext";

const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

export default useAppSettings;
