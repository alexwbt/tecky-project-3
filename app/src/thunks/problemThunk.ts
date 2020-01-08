import { Dispatch } from "react";
import ProblemActions from "../actions/problemActions";
import { IProblemState } from "../reducers/problemReducer";
import { setSaved } from "../actions/problemActions";


const { REACT_APP_API_SERVER } = process.env;

export function uploadProblem(problem: IProblemState) {
    return async (dispatch: Dispatch<ProblemActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/problem`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ problem })
        });
        const result = await res.json();

        dispatch(setSaved(res.status === 200 && result.success, result.message));
    };
}
