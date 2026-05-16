import { TimerReset } from "lucide-react";

import { useAppSettings } from "../../../hooks/useAppSettings";

const SettingsActions = () => {
  const { resetSettings } = useAppSettings();

  const handleClear = async () => {
    await resetSettings();
  };
  return (
    <section className="flex gap-3 pt-2 justify-end">
      <button
        type="reset"
        onClick={handleClear}
        className="border-border-primary bg-bg-secondary text-text-secondary hover:border-status-error/30 hover:bg-status-error/20 hover:text-status-error flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        <TimerReset size={16} aria-hidden />
        Reset
      </button>
    </section>
  );
};

export default SettingsActions;
