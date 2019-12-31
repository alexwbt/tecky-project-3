import { Dispatch } from "react";
import { AuthActions, loginSuccess, logoutSuccess, loginFailed } from "../actions/authActions";
import { push } from "connected-react-router";


const { REACT_APP_API_SERVER } = process.env;
// const REACT_APP_API_SERVER = "http://192.168.0.101:8080";

export function login(username: string, password: string) {
    return async (dispatch: Dispatch<AuthActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/user/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const result = await res.json();

        if (res.status === 200 && result.result) {
            localStorage.setItem('token', result.token);
            localStorage.setItem('username', username);
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
        localStorage.removeItem('username');
        dispatch(logoutSuccess());
        dispatch(push("/"));
    };
}
