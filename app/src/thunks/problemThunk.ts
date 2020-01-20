import { Dispatch } from "react";
import ProblemActions, { setProblem, resetProblem, setCode } from "../actions/problemActions";
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

export function editProblem(problem: IProblemState, mode: "edit" | "audit") {
    return async (dispatch: Dispatch<ProblemActions>) => {
        try {
            let formData = new FormData();
            const image = problem.image.slice();

            problem.image = "";
            formData.append("problem", JSON.stringify(problem))

            if (image) {
                const arr = image.split(',');

                const arr2 = arr[0].match(/:(.*?);/);

                if (arr2) {
                    const mime = arr2[1];
                    const bstr = atob(arr[1]);
                    let n = bstr.length;
                    const u8arr = new Uint8Array(n);
                    while (n--) {
                        u8arr[n] = bstr.charCodeAt(n);
                    }

                    const file = new File([u8arr], "cropped.png", { type: mime });
                    formData.append("image", file);
                }
            }

            let link = "";
            if (mode === "edit") {
                link = `${REACT_APP_API_SERVER}/problem`
            } else {
                link = `${REACT_APP_API_SERVER}/audit`
            }

            const res = await fetch(link, {
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
            const res = await fetch(`${REACT_APP_API_SERVER}/problem/${problemID}`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(setProblem(result.problem));
                const data = localStorage.getItem("savedCodes");
                if (data) {
                    const problem = JSON.parse(data).find((save: any) => save.pid === problemID);
                    if (problem) {
                        dispatch(setCode(problem.code, 0));
                    }
                }
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function getProblemAsCreator(problemID: number) {
    return async (dispatch: Dispatch<ProblemActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/problem/creator/${problemID}`, {
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

