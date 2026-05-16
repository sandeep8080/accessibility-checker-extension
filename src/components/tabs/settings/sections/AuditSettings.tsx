import { ShieldCheck } from "lucide-react";

import { useAppSettings } from "../../../../hooks/useAppSettings";
import type { ConformanceLvl } from "../../../../types";

export default function AuditSettings() {
  const { settings, updateSettings } = useAppSettings();
  const { conformanceLvl } = settings.audit;

  const onChangeConformanceLvl = async (lvl: string) => {
    updateSettings("audit", { conformanceLvl: lvl as ConformanceLvl });
  };

  return (
    <div>
      <h2 className="text-text-primary flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="text-accent-foreground" size={20} />
        Audit Settings
      </h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="text-text-secondary text-sm font-medium"
            htmlFor="conformanceLvl"
          >
            WCAG Conformance Level
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
          <p className="text-text-muted text-sm">
            Checks for Level {conformanceLvl} compliance
          </p>
        </div>
      </div>
    </div>
  );
}
