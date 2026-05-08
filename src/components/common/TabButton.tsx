export default function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={active}
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-t-lg border-b-2 px-2 py-3 text-sm font-medium transition-all ${
        active
          ? "border-accent-primary bg-bg-secondary/80 text-accent-foreground"
          : "text-text-muted hover:bg-bg-secondary/40 hover:text-text-secondary border-transparent"
      } `}
    >
      {icon}
      {label}
    </button>
  );
}
