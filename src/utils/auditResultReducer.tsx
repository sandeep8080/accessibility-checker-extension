import type { AuditAction, AuditState } from "../types";

export const reducer = (state: AuditState, action: AuditAction): AuditState => {
  switch (action.type) {
    case "RUN_AUDIT":
      return {
        status: "AUDITING",
      };

    case "AUDIT_SUCCESS":
      return {
        status: "SUCCESS",
        auditResult: action.payload,
      };
    case "AUDIT_ERROR":
      return {
        status: "ERROR",
        error: action.payload,
      };
    default:
      return state;
  }
};
