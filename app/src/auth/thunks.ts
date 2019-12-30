import { Dispatch } from "react";
import { AuthActions, loginSuccess, logoutSuccess, loginFailed } from "./actions";
import { push } from "connected-react-router";


const { REACT_APP_API_SERVER } = process.env;

export function login(username: string, password: string) {
    return async (dispatch: Dispatch<AuthActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/user/login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await res.json();

        if (res.status === 200 && result.result) {
            localStorage.setItem('token',result.token);
            dispatch(loginSuccess());
            dispatch(push("/"));
        } else {
            dispatch(loginFailed(result.message));
        }
    };
}

export function logout() {
    return async (dispatch: Dispatch<AuthActions>) => {
        localStorage.removeItem('token');
        dispatch(logoutSuccess());
        dispatch(push("/"));
    };
}
