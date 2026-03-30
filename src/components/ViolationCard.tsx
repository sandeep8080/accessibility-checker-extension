import { useState } from 'react';
import { ExternalLink, Code } from 'lucide-react';
import type { MappedViolation, AISuggestion as AISuggestionType } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { AISuggestion } from './AISuggestion';

interface ViolationCardProps {
  violation: MappedViolation;
}

export function ViolationCard({ violation }: ViolationCardProps) {
  const [suggestion, setSuggestion] = useState<AISuggestionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIOpen, setIsAIOpen] = useState(false);

  const handleGetAIFix = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'GET_AI_SUGGESTION',
        payload: { violation }
      });
      
      if (response && response.success) {
        setSuggestion(response.data);
      } else {
        throw new Error(response?.error || 'Failed to get AI suggestion');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nodeCount = violation.nodes.length;
  const firstNodeHtml = violation.nodes[0]?.html;

  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start gap-3 mb-2">
        <h3 className="text-[15px] font-semibold text-slate-100 leading-tight">
          {violation.help}
        </h3>
        <SeverityBadge severity={violation.severity} />
      </div>

      <p className="text-sm text-slate-400 mb-3 line-clamp-2" title={violation.description}>
        {violation.description}
      </p>

      {firstNodeHtml && (
        <div className="mb-3 bg-slate-900/50 rounded p-2.5 border border-slate-700/50">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1 font-medium">
            <Code size={14} /> Affected HTML {nodeCount > 1 ? `(1 of ${nodeCount})` : ''}
          </div>
          <code className="text-xs text-slate-300 break-all select-all">
            {firstNodeHtml}
          </code>
        </div>
      )}

      <div className="flex items-center justify-between text-xs mt-4">
        <a
          href={violation.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors group"
        >
          WCAG Guide
          <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
        </a>
        <span className="text-slate-500 font-medium">
          Rule: <span className="font-mono text-[11px] bg-slate-800 px-1 py-0.5 rounded">{violation.id}</span>
        </span>
      </div>

      <AISuggestion
        suggestion={suggestion}
        isLoading={isLoading}
        error={error}
        onGetFix={handleGetAIFix}
        isOpen={isAIOpen}
        setIsOpen={setIsAIOpen}
      />
    </div>
  );
}
