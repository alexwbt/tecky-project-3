import { ICanvasContent } from "../components/CanvasContent";



export function setProblem(title: string, description: string, canvas: ICanvasContent, code: string) {
    return {
        type: "SET_PROBLEM" as "SET_PROBLEM",
        title,
        description,
        canvas,
        code
    };
}


type ActionCreators = typeof setProblem;
type Actions = ReturnType<ActionCreators>;
export default Actions;