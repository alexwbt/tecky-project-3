import { Dispatch } from "react";
import ProfileActions, { loadProfile } from "../actions/profileActions";
import { push } from "connected-react-router";
import { toast } from "react-toastify";


const { REACT_APP_API_SERVER } = process.env;

export function getProfile(username: string) {
    return async (dispatch: Dispatch<ProfileActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/user/profile/${username}`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(loadProfile(result.username, result.email, result.exp, result.location,
                    result.postsRecord, result.solvedRecord));
            } else {
                dispatch(push("/pageNotFound"));
                console.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function submitProgress(problemID: number, score: number) {
    return async () => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/progress`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ problemID, score })
            });
            const result = await res.json();

            if (res.status === 200 && result.success) {
                toast.success(`+ ${result.experience} exp`);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}
