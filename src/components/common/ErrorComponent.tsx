import { AlertCircle } from "lucide-react";
import { UI_MESSAGES } from "../../utils/constant";

interface ErrorComponentProps {
  error: string;
  runAudit: () => void;
}

export const ErrorComponent = ({ error, runAudit }: ErrorComponentProps) => {
  return (
    <div className="text-text-secondary flex flex-1 flex-col items-center justify-center p-8 text-center">
      <AlertCircle size={48} className="text-status-error mb-4 opacity-80" />
      <h2 className="text-status-error mb-2 text-lg font-semibold">
        {UI_MESSAGES.AUDIT_FAILED_TITLE}
      </h2>
      <p className="text-text-muted max-w-[250px] text-sm">{error}</p>
      <button
        onClick={() => runAudit()}
        className="bg-bg-secondary border-border-base hover:bg-bg-tertiary mt-6 rounded-md border px-4 py-2 text-sm font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  );
};
