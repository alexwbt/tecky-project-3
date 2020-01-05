import { CallHistoryMethodAction } from "connected-react-router";

export function loginSuccess() {
    return {
        type: "LOGIN_SUCCESS" as "LOGIN_SUCCESS"
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

type ActionCreators = typeof loginSuccess
                    | typeof loginFailed
                    | typeof registerSuccess
                    | typeof registerFailed
                    | typeof logoutSuccess;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
