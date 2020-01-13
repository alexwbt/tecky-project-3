import { IProblemStatus } from "../models/Problem";
import IProblemStatusActions ,{ GET_PROBLEM_STATUSES } from '../actions/problemStatusActions';

export interface IProblemStatusesState {
    list: IProblemStatus[]
}

const initialState: IProblemStatusesState = {
    list: [],
}

export const problemStatusesReducer = (state: IProblemStatusesState = initialState, action: IProblemStatusActions) => {
    switch (action.type) {
        case GET_PROBLEM_STATUSES:
            return {
                ...state,
                list: action.statuses,
            }
        default:
            return state;
    }
}