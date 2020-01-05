import { Dispatch } from "react";
import AuthActions, { loginSuccess, loginFailed, registerSuccess, registerFailed, logoutSuccess } from "../actions/authActions";
import { push } from "connected-react-router";


const { REACT_APP_API_SERVER } = process.env;

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

export function register(email: string, username: string, password: string, cpassword: string) {
    return async (dispatch: Dispatch<AuthActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/user/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                username,
                password,
                cpassword
            })
        });
        const result = await res.json();

        if (res.status === 200 && result.result) {
            dispatch(registerSuccess());
        } else {
            dispatch(registerFailed(result.message));
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
