import { useState } from "react";
import { ExternalLink, Code } from "lucide-react";
import type {
  MappedViolation,
  AISuggestion as AISuggestionType,
} from "../../../types";
import { SeverityBadge } from "../../SeverityBadge";
import { AISuggestion } from "./AISuggestion";
import { ACTIONS, ERROR_MESSAGES } from "../../../utils/constant";

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
        action: ACTIONS.GET_AI_SUGGESTION,
        payload: { violation },
      });

      if (response && response.success) {
        setSuggestion(response.data);
      } else {
        throw new Error(response?.error || ERROR_MESSAGES.AI_SUGGESTION_FAILED);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(ERROR_MESSAGES.UNEXPECTED_ERROR_GENERIC);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nodeCount = violation.nodes.length;
  const firstNodeHtml = violation.nodes[0]?.html;

  return (
    <div className="bg-bg-secondary/60 border-border-secondary hover:border-border-primary rounded-lg border p-4 transition-colors">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-text-primary text-[15px] leading-tight font-semibold">
          {violation.help}
        </h3>
        <SeverityBadge severity={violation.severity} />
      </div>

      <p
        className="text-text-muted mb-3 line-clamp-2 text-sm"
        title={violation.description}
      >
        {violation.description}
      </p>

      {firstNodeHtml && (
        <div className="border-border-secondary/50 bg-bg-primary/50 mb-3 rounded border p-2.5">
          <div className="text-text-muted mb-1 flex items-center gap-1.5 text-xs font-medium">
            <Code size={14} /> Affected HTML{" "}
            {nodeCount > 1 ? `(1 of ${nodeCount})` : ""}
          </div>
          <code className="text-text-secondary text-xs break-all select-all">
            {firstNodeHtml}
          </code>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs">
        <a
          href={violation.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-status-info group flex items-center gap-1 transition-colors hover:opacity-80"
        >
          WCAG Guide
          <ExternalLink
            size={12}
            className="opacity-70 group-hover:opacity-100"
          />
        </a>
        <span className="text-text-muted font-medium">
          Rule:{" "}
          <span className="bg-bg-secondary rounded px-1 py-0.5 font-mono text-[11px]">
            {violation.id}
          </span>
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
