import { AlertCircle, AlertTriangle, Info } from "lucide-react";

import type { MappedViolation, Severity } from "../../../types";
import { ViolationCard } from "./ViolationCard";

interface ViolationListProps {
  violations: MappedViolation[];
}

export function ViolationList({ violations }: ViolationListProps) {
  if (violations.length === 0) return null;

  // Group violations by severity
  const grouped = violations.reduce(
    (acc, v) => {
      acc[v.severity].push(v);
      return acc;
    },
    { error: [], warning: [], notice: [] } as Record<
      Severity,
      MappedViolation[]
    >
  );

  return (
    <div className="space-y-6">
      <SeverityGroup
        title="Errors (Critical / Serious)"
        violations={grouped.error}
        icon={<AlertCircle className="text-status-error" size={18} />}
        colorClass="text-status-error"
      />
      <SeverityGroup
        title="Warnings (Moderate)"
        violations={grouped.warning}
        icon={<AlertTriangle className="text-status-warning" size={18} />}
        colorClass="text-status-warning"
      />
      <SeverityGroup
        title="Notices (Minor)"
        violations={grouped.notice}
        icon={<Info className="text-status-info" size={18} />}
        colorClass="text-status-info"
      />
    </div>
  );
}

function SeverityGroup({
  title,
  violations,
  icon,
  colorClass,
}: {
  title: string;
  violations: MappedViolation[];
  icon: React.ReactNode;
  colorClass: string;
}) {
  if (violations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="border-border-secondary/50 flex items-center gap-2 border-b px-1 pb-2">
        {icon}
        <h2 className={`text-sm font-semibold ${colorClass}`}>
          {title}{" "}
          <span className="ml-1 font-normal opacity-70">
            ({violations.length})
          </span>
        </h2>
      </div>
      <div className="space-y-3">
        {violations.map((violation) => (
          <ViolationCard key={violation.id} violation={violation} />
        ))}
      </div>
    </div>
  );
}
