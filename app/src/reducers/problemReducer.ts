import { ICanvasContent } from "../components/canvas/CanvasContent";
import ProblemActions from "../actions/problemActions";
import { BlockList, blocklyBlocks } from "../components/blockly/toolbox";
import { IProblemInfo } from "../models/Problem";
import { ICategory } from "../models/Category";


export interface IProblemState extends IProblemInfo {
    // Editor
    canvas: ICanvasContent;
    code: string;
    avalibleBlocks: BlockList;
    avalibleCategories: string[];
    useCategory: boolean;
    useVariables: boolean;
    useFunctions: boolean;

    savingMessage: string;
    saved: boolean;
    getProblemFailed: boolean;
    failedMessage: string;
}

const initialState: IProblemState = {
    // Description
    title: "",
    category: ({} as ICategory),
    difficulty: null,
    status: null,
    description: "",
    score: 0,
    deduction: null,

    // Editor
    canvas: {},
    code: "",
    avalibleBlocks: {},
    avalibleCategories: [],
    useCategory: false,
    useVariables: false,
    useFunctions: false,

    savingMessage: "",
    saved: true,
    getProblemFailed: false,
    failedMessage: ""
};

Object.keys(blocklyBlocks).forEach(cat => initialState.avalibleBlocks[cat] = []);

const problemReducer = (state: IProblemState = initialState, action: ProblemActions) => {
    switch (action.type) {
        case "SET_PROBLEM":
            return {
                ...action.problem,
                getProblemFailed: false,
                failedMessage: ""
            };
        case "GET_PROBLEM_FAILED":
            return {
                ...initialState,
                getProblemFailed: true,
                failedMessage: action.message
            };
        case "CHANGED":
            return {
                ...state,
                saved: false,
                savingMessage: "Changes Unsaved"
            };
        case "SET_SAVED":
            return {
                ...state,
                saved: action.saved,
                savingMessage: action.message
            };
        case "SET_DESCRIPTION":
            return {
                ...state,
                title: action.title,
                category: action.category,
                difficulty: action.difficulty,
                status: action.status,
                description: action.description,
                score: action.score,
                deduction: action.deduction
            };
        case "SET_CANVAS_CONTENT":
            return {
                ...state,
                canvas: action.content
            };
        case "TOGGLE_CATEGORY":
            let acat = state.avalibleCategories.slice();
            if (acat.includes(action.category)) {
                acat = acat.filter(cat => cat !== action.category);
            } else {
                acat.push(action.category);
            }
            return {
                ...state,
                avalibleCategories: acat
            };
        case "TOGGLE_BLOCK":
            let ablo = state.avalibleBlocks[action.category].slice();
            if (ablo.includes(action.block)) {
                ablo = ablo.filter(block => block !== action.block);
            } else {
                ablo.push(action.block);
            }
            return {
                ...state,
                avalibleBlocks: {
                    ...state.avalibleBlocks,
                    [action.category]: ablo
                }
            };
        case "TOGGLE_USE_CATEGORY":
            return {
                ...state,
                useCategory: !state.useCategory
            };
        case "TOGGLE_USE_VARIABLES":
            return {
                ...state,
                useVariables: !state.useVariables
            };
        case "TOGGLE_USE_FUNCTIONS":
            return {
                ...state,
                useFunctions: !state.useFunctions
            };
        case "SET_CODE":
            return {
                ...state,
                code: action.code
            };
        default:
            return state;
    }
};
export default problemReducer;
