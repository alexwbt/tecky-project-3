import { Dispatch } from "react";
import AuthActions, { loginSuccess, loginFailed, registerSuccess, registerFailed, logoutSuccess, setRole } from "../actions/authActions";
import { push } from "connected-react-router";
import { toast } from "react-toastify";


const { REACT_APP_API_SERVER } = process.env;

export function login(username: string, password: string) {
    return async (dispatch: Dispatch<AuthActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/user/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await res.json();
    
            if (res.status === 200 && result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('username', username);
                dispatch(loginSuccess(result.role));
                dispatch(push("/"));
            } else {
                dispatch(loginFailed(result.message));
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}

export function register(email: string, username: string, password: string, cpassword: string, year: number) {
    return async (dispatch: Dispatch<AuthActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/user/register`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                    cpassword,
                    year
                })
            });
            const result = await res.json();
    
            if (res.status === 200 && result.success) {
                dispatch(registerSuccess());
            } else {
                dispatch(registerFailed(result.message));
            }
        } catch (err) {
            toast.error(err.message);
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

export function getRole() {
    return async (dispatch: Dispatch<AuthActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/user/role`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const result = await res.json();
    
            if (res.status === 200 && result.success) {
                dispatch(setRole(result.role));
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
}
