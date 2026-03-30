import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { MappedViolation, Severity } from '../types';
import { ViolationCard } from './ViolationCard';

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
    { error: [], warning: [], notice: [] } as Record<Severity, MappedViolation[]>
  );

  return (
    <div className="space-y-6">
      <SeverityGroup 
        title="Errors (Critical / Serious)" 
        violations={grouped.error} 
        icon={<AlertCircle className="text-rose-500" size={18} />}
        colorClass="text-rose-400"
      />
      <SeverityGroup 
        title="Warnings (Moderate)" 
        violations={grouped.warning} 
        icon={<AlertTriangle className="text-amber-500" size={18} />}
        colorClass="text-amber-400"
      />
      <SeverityGroup 
        title="Notices (Minor)" 
        violations={grouped.notice} 
        icon={<Info className="text-blue-500" size={18} />}
        colorClass="text-blue-400"
      />
    </div>
  );
}

function SeverityGroup({ 
  title, 
  violations, 
  icon,
  colorClass 
}: { 
  title: string; 
  violations: MappedViolation[]; 
  icon: React.ReactNode;
  colorClass: string;
}) {
  if (violations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1 border-b border-slate-700/50 pb-2">
        {icon}
        <h2 className={`text-sm font-semibold ${colorClass}`}>
          {title} <span className="opacity-70 font-normal ml-1">({violations.length})</span>
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
