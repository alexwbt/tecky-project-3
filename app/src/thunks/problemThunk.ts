import { Dispatch } from "react";
import ProblemActions, { setProblem, resetProblem } from "../actions/problemActions";
import { IProblemState } from "../reducers/problemReducer";
import { setSaved } from "../actions/problemActions";
import { toast } from "react-toastify";
import { push } from "connected-react-router";


const { REACT_APP_API_SERVER } = process.env;

export function createProblem() {
    return async (dispatch: Dispatch<ProblemActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/problem`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await res.json();

            dispatch(setSaved(res.status === 200 && result.success, result.message));
            dispatch(resetProblem());
            dispatch(push("/challenge/edit/" + result.problemID));
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function editProblem(problem: IProblemState) {
    return async (dispatch: Dispatch<ProblemActions>) => {
        try {
            let formData = new FormData();
            if (problem.image !== undefined) {
                formData.append("image", problem.image);
            }
            formData.append("problem", JSON.stringify({ ...problem }))
            

            const res = await fetch(`${REACT_APP_API_SERVER}/problem`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData
            });
            const result = await res.json();

            dispatch(setSaved(res.status === 200 && result.success, result.message));
            if (res.status !== 200 || !result.success) {
                toast.error("Failed to save changes. (" + result.message + ")");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function getProblem(problemID: number) {
    return async (dispatch: Dispatch<ProblemActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/problem/${problemID}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(setProblem(result.problem));
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function rateProblem(problemID: number, score: number) {
    return async () => {
        try {
            await fetch(`${REACT_APP_API_SERVER}/problem/rate`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ problemID, score })
            });
        } catch (err) {
            toast.error(err.message);
        }
    };
}
