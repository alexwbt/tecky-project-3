import { CallHistoryMethodAction } from "connected-react-router";

export function loginSuccess(role: number) {
    return {
        type: "LOGIN_SUCCESS" as "LOGIN_SUCCESS",
        role
    };
}

export function loginFailed(message: string) {
    return {
        type: "LOGIN_FAILED" as "LOGIN_FAILED",
        message
    };
}

export function registerSuccess() {
    return {
        type: "REGISTER_SUCCESS" as "REGISTER_SUCCESS"
    };
}

export function registerFailed(message: string) {
    return {
        type: "REGISTER_FAILED" as "REGISTER_FAILED",
        message
    };
}

export function logoutSuccess() {
    return {
        type: "LOGOUT" as "LOGOUT"
    };
}

export function setRole(role: number) {
    return {
        type: "SET_ROLE" as "SET_ROLE",
        role
    };
}

type ActionCreators = typeof loginSuccess
                    | typeof loginFailed
                    | typeof registerSuccess
                    | typeof registerFailed
                    | typeof logoutSuccess
                    | typeof setRole;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
