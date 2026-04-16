import { UI_MESSAGES } from "../../utils/constant";

export const Loading = () => {
  return (
    <div className="flex flex-1 animate-pulse flex-col items-center justify-center p-8 text-center">
      <div className="border-t-accent-primary border-accent-primary/30 mb-4 h-12 w-12 animate-spin rounded-full border-4" />
      <h2 className="text-text-secondary text-lg font-medium">
        {UI_MESSAGES.ANALYZING_PAGE}
      </h2>
      <p className="text-text-muted mt-2 text-sm">
        {UI_MESSAGES.WCAG_COMPLIANCE_CHECK}
      </p>
    </div>
  );
};
