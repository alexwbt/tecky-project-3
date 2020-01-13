import { CallHistoryMethodAction } from "connected-react-router";
import { BlockList } from "../components/blockly/toolbox";
import { ICanvasContent, WinningCondition } from "../components/canvas/CanvasContent";
import { IProblemState } from "../reducers/problemReducer";
import { IProblemInfo } from "../models/Problem";



export function setProblem(problem: IProblemState) {
    return {
        type: "SET_PROBLEM" as "SET_PROBLEM",
        problem
    };
}
export function resetProblem() {
    return {
        type: "RESET_PROBLEM" as "RESET_PROBLEM"
    };
}

export function changed() {
    return {
        type: "CHANGED" as "CHANGED"
    };
}

export function setSaved(saved: boolean, message: string) {
    return {
        type: "SET_SAVED" as "SET_SAVED",
        saved,
        message
    };
}

export function setDescription(description: IProblemInfo) {
    return {
        type: "SET_DESCRIPTION" as "SET_DESCRIPTION",
        title: description.title,
        categoryID: description.categoryID,
        difficultyID: description.difficultyID,
        statusID: description.statusID,
        description: description.description,
        score: description.score,
        maxUsedBlocks: description.maxUsedBlocks,
        maxMoveTimes: description.maxMoveTimes,
        deduction: description.deduction
    };
}

export function setAvalibleBlocks(blocks: BlockList, useCategory: boolean) {
    return {
        type: "SET_AVALIBLE_BLOCKS" as "SET_AVALIBLE_BLOCKS",
        blocks,
        useCategory
    };
}

export function setCanvasContent(content: ICanvasContent) {
    return {
        type: "SET_CANVAS_CONTENT" as "SET_CANVAS_CONTENT",
        content
    };
}

export function toggleCategory(category: string) {
    return {
        type: "TOGGLE_CATEGORY" as "TOGGLE_CATEGORY",
        category
    };
}

export function toggleBlock(category: string, block: string) {
    return {
        type: "TOGGLE_BLOCK" as "TOGGLE_BLOCK",
        category,
        block
    };
}

export function toggleUseCategory() {
    return {
        type: "TOGGLE_USE_CATEGORY" as "TOGGLE_USE_CATEGORY"
    };
}

export function toggleUseVariables() {
    return {
        type: "TOGGLE_USE_VARIABLES" as "TOGGLE_USE_VARIABLES"
    };
}

export function toggleUseFunctions() {
    return {
        type: "TOGGLE_USE_FUNCTIONS" as "TOGGLE_USE_FUNCTIONS"
    };
}

export function setCode(code: string) {
    return {
        type: "SET_CODE" as "SET_CODE",
        code
    };
}

export function setWinningCondition(condition: WinningCondition) {
    return {
        type: "SET_WINNING_CONDITION" as "SET_WINNING_CONDITION",
        condition
    };
}


type ActionCreators = typeof toggleCategory
                    | typeof toggleUseVariables
                    | typeof toggleUseFunctions
                    | typeof toggleBlock
                    | typeof toggleUseCategory
                    | typeof setCanvasContent
                    | typeof setCode
                    | typeof setDescription
                    | typeof setSaved
                    | typeof changed
                    | typeof setProblem
                    | typeof resetProblem
                    | typeof setWinningCondition;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
