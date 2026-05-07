// Utility functions related to platform detection and shortcuts
export const isMac = (): boolean => navigator.userAgent.includes("Mac");

export const getAuditShortcutText = (): string => {
  const isMacOS = isMac();
  return isMacOS ? " ⌘⇧U" : "Ctrl+Shift+U";
};
