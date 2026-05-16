import { Divider } from "../../common/Divider";
import AiSettings from "./sections/AiSettings";
import AuditSettings from "./sections/AuditSettings";
import SettingsActions from "./SettingsActions";

export function SettingsPanel() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <AiSettings />
        <Divider />
        <AuditSettings />
        <Divider />
        <SettingsActions />
      </div>
    </div>
  );
}
