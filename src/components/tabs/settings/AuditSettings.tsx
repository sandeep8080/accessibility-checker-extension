import { ShieldCheck } from "lucide-react";

export default function AuditSettings({
  conformanceLvl,
  onChangeConformanceLvl,
  onClickAutoAudit,
}: {
  conformanceLvl: string;
  onChangeConformanceLvl: (lvl: string) => void;
  onClickAutoAudit: () => void;
}) {
  return (
    <div>
      <h2 className="text-text-primary flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck className="text-accent-foreground" size={20} />
        Audit Settings
      </h2>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-text-secondary text-sm font-medium">
            WCAG Conformance Level
          </label>
          <select
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
        {/* Auto Audit Toggle */}
        <div className="flex items-center justify-between py-2">
          <div>
            <label className="text-text-secondary mb-1 block text-sm font-medium">
              Auto-Audit on Page Load
            </label>
            <p className="text-text-muted text-sm">
              Automatically run an accessibility audit when you navigate to a
              new page.
            </p>
          </div>
          <button
            className="bg-bg-tertiary relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors"
            onClick={onClickAutoAudit}
          >
            <span className="inline-block h-4 w-4 translate-x-1 transform rounded-full bg-white transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
