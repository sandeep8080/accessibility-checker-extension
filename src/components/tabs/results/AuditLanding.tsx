import { ScanLine } from "lucide-react";

import { UI_MESSAGES } from "../../../utils/constant";
import { getAuditShortcutText } from "../../../utils/platform";
import { RunAuditButton } from "../../common/RunAuditButton";

const AuditLanding = ({ runAudit }: { runAudit: () => Promise<void> }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="bg-accent-primary/10 mb-5 flex h-16 w-16 items-center justify-center rounded-full">
        <ScanLine
          size={32}
          className="text-accent-foreground"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-text-primary mb-2 text-xl font-semibold">
        {UI_MESSAGES.LANDING_TITLE}
      </h2>

      <p className="text-text-muted mb-7 max-w-[260px] text-sm leading-relaxed">
        {UI_MESSAGES.LANDING_DESCRIPTION}
      </p>

      <RunAuditButton runAudit={runAudit} />

      <div className="text-text-muted mt-5 flex items-center gap-1.5 text-xs">
        <span>or press</span>
        <kbd className="bg-bg-secondary border-border-primary text-text-secondary rounded border px-1.5 py-0.5 font-mono text-[11px]">
          {getAuditShortcutText()}
        </kbd>
      </div>
    </div>
  );
};

export default AuditLanding;
