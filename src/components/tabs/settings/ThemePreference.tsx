/**
 * TODO: Need to work on the set-up the tailwind and integrate the theme context to the app to support
 */
export const ThemePreference = () => {
  return (
    <div className="space-y-1.5">
      <label className="text-text-secondary text-sm font-medium">Theme</label>
      <select className="border-border-primary bg-bg-secondary text-text-secondary focus:ring-accent-primary w-full cursor-pointer appearance-none rounded-md border px-3 py-2 text-sm outline-none focus:ring-1">
        <option value="system">System Default</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};
