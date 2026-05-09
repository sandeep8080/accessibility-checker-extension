import { AlertTriangle } from "lucide-react";

import { ERROR_MESSAGES } from "../../utils/constant";

interface ErrorBoundaryFallbackProps {
  error: Error | null;
  title?: string;
  description?: string;
}

const ErrorBoundaryFallback = ({
  error,
  title = ERROR_MESSAGES.ERROR_BOUNDARY_TITLE,
  description = ERROR_MESSAGES.ERROR_BOUNDARY_DESCRIPTION,
}: ErrorBoundaryFallbackProps) => {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center p-8 tex-center"
    >
      <div className="bg-status-error/10 mb-5 flex h-16 w-16 items-center justify-center rounded-full">
        <AlertTriangle
          size={32}
          className="text-status-error"
          aria-hidden="true"
        />
      </div>

      <h2 className="text-status-error mb-2 text-lg font-semibold">{title}</h2>

      <p className="text-text-muted mb-4 max-w-[260px] text-sm leading-relaxed">
        {description}
      </p>
      {/* Vite provide a built-in boolean flag which to determine the env */}
      {import.meta.env.DEV && (
        <details className="text-text-muted bg-bg-secondary/50 border-border-secondary mb-4 w-full max-w-[300px] rounded border p-2 text-left text-xs">
          <summary className="cursor-pointer font-medium">
            Error Details
          </summary>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap break-all">
            {error?.message}
            {error?.stack && (
              <>
                {"\n\n"}
                {error.stack}
              </>
            )}
          </pre>
        </details>
      )}
    </div>
  );
};

export default ErrorBoundaryFallback;
