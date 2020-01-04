import { CanvasContentExport } from "../components/CanvasContent";
import ProblemActions from "../actions/problemActions";


export interface IProblemState {
    title: string;
    description: string;
    canvas: CanvasContentExport;
    code: string;
    saved: boolean;
}

const initialState = {
    title: "",
    description: "",
    canvas: {},
    code: "",
    saved: true
};

const problemReducer = (state: IProblemState = initialState, action: ProblemActions) => {
    return state;
};
export default problemReducer;
