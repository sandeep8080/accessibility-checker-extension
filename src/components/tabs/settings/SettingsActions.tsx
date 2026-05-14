import { useState } from "react";

import { CheckCircle2, Save, TimerReset } from "lucide-react";

import { useSettings } from "../../../hooks/useSettings";

const SettingsActions = () => {
  const [isSaved, setIsSaved] = useState(false);

  const { saveSettings, resetSettings } = useSettings();
  const handleSave = async () => {
    await saveSettings();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleClear = async () => {
    await resetSettings();
  };
  return (
    <section className="flex gap-3 pt-2">
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
        {isSaved ? "Saved!" : "Save settings"}
      </button>
      <button
        onClick={handleClear}
        className="border-border-primary bg-bg-secondary text-text-secondary hover:border-status-error/30 hover:bg-status-error/20 hover:text-status-error flex items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <TimerReset size={16} aria-hidden />
        Reset
      </button>
    </section>
  );
};

export default SettingsActions;
