import { IProblemStatus } from "../models/Problem";

export const GET_PROBLEM_STATUSES = "GET_PROBLEM_STATUSES";

export function getProblemStatuses(statuses: IProblemStatus[]) {
    return {
        type: GET_PROBLEM_STATUSES as typeof GET_PROBLEM_STATUSES,
        statuses
    }
}

type ActionCreators = typeof getProblemStatuses;
type IProblemStatusActions = ReturnType<ActionCreators>;
export default IProblemStatusActions;