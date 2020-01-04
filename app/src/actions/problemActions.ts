import { CanvasContentExport } from "../components/CanvasContent";



export function saveProblem(title: string, description: string, canvas: CanvasContentExport, code: string) {
    return {
        type: "SAVE" as "SAVE",
        title,
        description,
        canvas,
        code
    };
}


type ActionCreators = typeof saveProblem;
type Actions = ReturnType<ActionCreators>;
export default Actions;
