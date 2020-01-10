import { Dispatch } from "react";
import { toast } from "react-toastify";
import IDifficultyActions, { getDifficulties } from "../actions/difficultyActions";

const { REACT_APP_API_SERVER } = process.env;

export function getDifficultiesThunk() {
    return async (dispatch: Dispatch<IDifficultyActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/difficulty/`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(getDifficulties(result.difficulties));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Cannot connect to server!")
        }

    }
}
