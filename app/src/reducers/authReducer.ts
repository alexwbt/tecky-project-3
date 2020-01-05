import AuthActions from "../actions/authActions";


export interface IAuthState {
    authenticated: boolean;
    error: boolean;
    message: string;
}

const initialState = {
    authenticated: !!localStorage.getItem("token"),
    error: false,
    message: ""
};

const authReducer = (state: IAuthState = initialState, action: AuthActions) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                authenticated: true,
                error: false,
                message: ""
            };
        case "LOGIN_FAILED":
            return {
                authenticated: false,
                error: true,
                message: action.message
            };
        case "REGISTER_SUCCESS":
            return {
                authenticated: state.authenticated,
                error: false,
                message: "Successfully Registered"
            };
        case "REGISTER_FAILED":
            return {
                authenticated: state.authenticated,
                error: true,
                message: action.message
            };
        case "LOGOUT":
            return {
                authenticated: false,
                error: false,
                message: ""
            };
        default:
            return state;
    }
};
export default authReducer;