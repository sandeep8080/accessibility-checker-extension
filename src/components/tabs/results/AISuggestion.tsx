import { Sparkles, AlertCircle, ChevronUp } from "lucide-react";
import type { AISuggestion as AISuggestionType } from "../../../types";
import { UI_MESSAGES } from "../../../utils/constant";

interface AISuggestionProps {
  suggestion: AISuggestionType | null;
  isLoading: boolean;
  error: string | null;
  onGetFix: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// TODO: Refactor this component take out the common UI components like loading & error.
// For loading I think we can have a separate  component for this template.
export function AISuggestion({
  suggestion,
  isLoading,
  error,
  onGetFix,
  isOpen,
  setIsOpen,
}: AISuggestionProps) {
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          if (!suggestion && !isLoading) onGetFix();
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-purple-500/20 bg-slate-800 py-2.5 text-sm font-medium text-purple-400 transition-colors hover:bg-slate-700/80 hover:text-purple-300"
      >
        <Sparkles size={16} />
        Get AI Fix
      </button>
    );
  }

  return (
    <div className="mt-3 overflow-hidden rounded-md border border-purple-500/30 bg-purple-500/5">
      <button
        onClick={() => setIsOpen(false)}
        className="flex w-full items-center justify-between bg-slate-800/80 px-4 py-2 text-sm font-medium text-purple-300 transition-colors hover:bg-slate-700/80"
      >
        <span className="flex items-center gap-2">
          <Sparkles size={16} />
          AI Fix Suggestion
        </span>
        <ChevronUp size={16} />
      </button>

      <div className="p-4 text-sm">
        {isLoading ? (
          <div className="flex animate-pulse space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-2 rounded bg-slate-700" />
              <div className="space-y-2">
                <div className="h-2 rounded bg-slate-700" />
                <div className="h-2 w-5/6 rounded bg-slate-700" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-md bg-rose-500/10 p-3 text-rose-400">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        ) : suggestion ? (
          <div className="space-y-4">
            <div>
              <h4 className="mb-1 font-medium text-slate-200">
                {UI_MESSAGES.AI_WHY_IT_FAILS}
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-300">
                {suggestion.explanation}
              </p>
            </div>

            <div>
              <h4 className="mb-1 font-medium text-slate-200">
                {UI_MESSAGES.AI_HOW_TO_FIX}
              </h4>
              <pre className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-600 mt-2 overflow-x-auto rounded border border-slate-700 bg-slate-900 p-3 text-[13px] text-slate-300">
                <code>{suggestion.codeSnippet}</code>
              </pre>
            </div>

            {suggestion.wcagReference && (
              <div className="border-t border-slate-700 pt-2">
                <p className="flex items-center gap-1.5 text-xs text-slate-400">
                  Reference:
                  <span className="font-medium text-slate-300">
                    {suggestion.wcagReference}
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
