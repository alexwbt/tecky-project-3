import { Dispatch } from "react";
import { toast } from "react-toastify";
import IProblemStatusActions ,{ getProblemStatuses } from '../actions/problemStatusActions';

const { REACT_APP_API_SERVER } = process.env;

export function getProblemStatusesThunk() {
    return async (dispatch: Dispatch<IProblemStatusActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/problem/statuses/`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(getProblemStatuses(result.statuses));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Cannot connect to server!")
        }
    }
}