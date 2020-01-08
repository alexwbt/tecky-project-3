import { ICanvasContent } from "../components/canvas/CanvasContent";
import ProblemActions from "../actions/problemActions";
import { BlockList, blocklyBlocks } from "../components/blockly/toolbox";
import { ProblemInfo } from "../models/Problem";


export interface IProblemState extends ProblemInfo {
    // Editor
    canvas: ICanvasContent;
    code: string;
    avalibleBlocks: BlockList;
    avalibleCategories: string[];
    useCategory: boolean;
    saved: boolean;
}

const initialState: IProblemState = {
    // Description
    title: "",
    category: null,
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
    saved: true
};

Object.keys(blocklyBlocks).forEach(cat => initialState.avalibleBlocks[cat] = []);

const problemReducer = (state: IProblemState = initialState, action: ProblemActions) => {
    switch (action.type) {
        // case "SET_AVALIBLE_BLOCKS":
        //     return {
        //         ...state,
        //         avalibleBlocks: action.blocks,
        //         useCategory: action.useCategory
        //     };
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
            if (ablo.includes(action.category)) {
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
        default:
            return state;
    }
};
export default problemReducer;
