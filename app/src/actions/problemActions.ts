import { CallHistoryMethodAction } from "connected-react-router";
import { BlockList } from "../components/blockly/toolbox";



// export function setProblem(title: string, description: string, canvas: ICanvasContent, code: string) {
//     return {
//         type: "SET_PROBLEM" as "SET_PROBLEM",
//         title,
//         description,
//         canvas,
//         code
//     };
// }

export function setAvalibleBlocks(blocks: BlockList, useCategory: boolean) {
    return {
        type: "SET_AVALIBLE_BLOCKS" as "SET_AVALIBLE_BLOCKS",
        blocks,
        useCategory
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


type ActionCreators = typeof toggleCategory | typeof toggleBlock | typeof toggleUseCategory; //typeof setProblem | typeof setAvalibleBlocks;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
