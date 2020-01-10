import IDifficultyActions, { GET_DIFFICULTIES } from "../actions/difficultyActions";
import { IDifficulty } from '../models/Difficulty';

export interface IDifficultyState {
    list: IDifficulty[]
}

const initialState: IDifficultyState = {
    list: [],
}

export const difficultyReducer = (state: IDifficultyState = initialState, action: IDifficultyActions) => {
    switch (action.type) {
        case GET_DIFFICULTIES:
            return {
                ...state,
                list: action.difficulties,
            }
        default:
            return state;
    }
}