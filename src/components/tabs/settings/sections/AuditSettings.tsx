import { useState } from "react";

import { CheckCircle2, ShieldCheck } from "lucide-react";

import useAppSettings from "../../../../hooks/useAppSettings";
import type { ConformanceLvl } from "../../../../types";
import { CTA, UI_MESSAGES } from "../../../../utils/constant";
import { ToggleButton } from "../../../common/ToggleButton";

export default function AuditSettings() {
  const { settings, updateSettings } = useAppSettings();
  const { conformanceLvl, includeBestPractices } = settings.audit;
  const [justSaved, setJustSaved] = useState(false);

  const onChangeConformanceLvl = async (lvl: string) => {
    updateSettings("audit", { conformanceLvl: lvl as ConformanceLvl });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const handleToggle = (value: boolean) => {
    updateSettings("audit", { includeBestPractices: value });
  };

  return (
    <section aria-labelledby="audit-settings-heading">
      <h2
        id="audit-settings-heading"
        className="text-text-primary flex items-center gap-2 text-lg font-semibold"
      >
        <ShieldCheck className="text-accent-foreground" size={20} aria-hidden />
        Audit Settings
      </h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="text-text-secondary text-sm font-medium"
            htmlFor="conformanceLvl"
          >
            {UI_MESSAGES.AUDIT_SECTION_TITLE}
          </label>
          <select
            id="conformanceLvl"
            value={conformanceLvl}
            onChange={(e) => onChangeConformanceLvl(e.target.value)}
            className="border-border-primary bg-bg-secondary text-text-secondary focus:border-accent-primary focus:ring-accent-primary w-full appearance-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-1"
          >
            <option value="AA">AA (Recommended)</option>
            <option value="A">A (Basic)</option>
            <option value="AAA">AAA (Enhanced)</option>
          </select>
          <div className="flex items-center gap-1.5">
            <p className="text-text-muted text-xs">
              Checks for Level {conformanceLvl} compliance
            </p>
            {justSaved && (
              <span className="text-status-success flex items-center gap-0.5 text-xs">
                <CheckCircle2 size={12} aria-hidden /> Saved
              </span>
            )}
          </div>
        </div>
        <ToggleButton
          name={CTA.BEST_PRACTICE}
          isEnabled={includeBestPractices}
          handleToggle={handleToggle}
        />
      </div>
    </section>
  );
}
