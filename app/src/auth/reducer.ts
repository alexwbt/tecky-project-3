import IAuthState from "./state";
import { AuthActions } from "./actions";


const initialState = {
    authenticated: !!localStorage.getItem("token"),
    message: ""
};

const authReducer = (state: IAuthState = initialState, action: AuthActions) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                authenticated: true,
                message: ""
            };
        case "LOGIN_FAILED":
            return {
                authenticated: false,
                message: action.message
            };
        case "LOGOUT":
            return {
                authenticated: false,
                message: ""
            };
        default:
            return state;
    }
};
export default authReducer;