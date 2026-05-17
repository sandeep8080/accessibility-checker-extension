import { SectionStyleWrapper } from "../../common/SectionStyleWrapper";
import AiSettings from "./sections/AiSettings";
import AuditSettings from "./sections/AuditSettings";
import SettingsActions from "./sections/SettingsActions";

export function SettingsPanel() {
  return (
    <div className="space-y-4 p-4">
      <SectionStyleWrapper>
        <AiSettings />
      </SectionStyleWrapper>
      <SectionStyleWrapper>
        <AuditSettings />
      </SectionStyleWrapper>
      <SettingsActions />
    </div>
  );
}
