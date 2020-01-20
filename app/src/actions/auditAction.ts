import { IAudit } from '../models/Audit';

export const GET_AUDIT = "GET_AUDIT";

export function getAudit(audit: IAudit) {
    return {
        type: GET_AUDIT as typeof GET_AUDIT,
        audit
    }
}

type ActionCreators = typeof getAudit;
type IAuditActions = ReturnType<ActionCreators>;
export default IAuditActions;