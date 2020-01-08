import { CallHistoryMethodAction } from "connected-react-router";
import { BlockList } from "../components/blockly/toolbox";
import { ICanvasContent } from "../components/canvas/CanvasContent";



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

export function setCode(code: string) {
    return {
        type: "SET_CODE" as "SET_CODE",
        code
    };
}


type ActionCreators = typeof toggleCategory | typeof toggleBlock | typeof toggleUseCategory | typeof setCanvasContent | typeof setCode; //typeof setProblem | typeof setAvalibleBlocks;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
