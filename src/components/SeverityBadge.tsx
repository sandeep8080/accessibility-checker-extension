import type { Severity } from "../types";

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const map: Record<Severity, { label: string; classes: string }> = {
    error: {
      label: "Error",
      classes: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
    warning: {
      label: "Warning",
      classes: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    notice: {
      label: "Notice",
      classes: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    },
  };

  const config = map[severity];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
