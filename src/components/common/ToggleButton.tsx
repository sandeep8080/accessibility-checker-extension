export const ToggleButton = ({
  name,
  isEnabled,
  handleToggle,
}: {
  name: string;
  isEnabled: boolean;
  handleToggle: (isEnabled: boolean) => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor={`${name}-toggle-button`}
        className="text-text-secondary mb-1 block text-sm font-medium"
      >
        {name}
      </label>
      <button
        id={`${name}-toggle-button`}
        type="button"
        role="switch"
        aria-checked={isEnabled}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${isEnabled ? "bg-green-500" : "bg-bg-tertiary"}`}
        onClick={() => handleToggle(!isEnabled)}
        aria-label={name}
      >
        <span
          className={`inline-block h-4 w-4  transform rounded-full bg-white transition-transform ${isEnabled ? "translate-x-5" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
};
