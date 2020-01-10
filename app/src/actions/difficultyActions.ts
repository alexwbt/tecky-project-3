import { IDifficulty } from '../models/Difficulty';

export const GET_DIFFICULTIES = "GET_DIFFICULTIES";

export function getDifficulties(difficulties: IDifficulty[]) {
    return {
        type: GET_DIFFICULTIES as typeof GET_DIFFICULTIES,
        difficulties
    }
}

type ActionCreators = typeof getDifficulties;
type IDifficultyActions = ReturnType<ActionCreators>;
export default IDifficultyActions;