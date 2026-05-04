import { Zap } from "lucide-react";

export const RunAuditButton = ({
  runAudit,
}: {
  runAudit: () => Promise<void>;
}) => {
  return (
    <button
      onClick={runAudit}
      className="bg-accent-primary hover:bg-accent-secondary focus-visible:ring-accent-primary/50 flex items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <Zap size={16} aria-hidden="true" />
      Run Audit
    </button>
  );
};
