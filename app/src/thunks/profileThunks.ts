import { Dispatch } from "react";
import ProfileActions, { loadProfile } from "../actions/profileActions";
import { push } from "connected-react-router";


const { REACT_APP_API_SERVER } = process.env;

export function getProfile(username: string) {
    return async (dispatch: Dispatch<ProfileActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/user/profile/${username}`);
        const result = await res.json();

        if (res.status === 200 && result.success) {
            dispatch(loadProfile(result.username, result.email, result.exp));
        } else {
            dispatch(push("/pageNotFound"));
            console.error(result.message);
        }
    };
}
