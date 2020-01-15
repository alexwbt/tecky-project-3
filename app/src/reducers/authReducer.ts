import AuthActions from "../actions/authActions";


export interface IAuthState {
    authenticated: boolean;
    error: boolean;
    message: string;
    role: number;
}

const initialState: IAuthState = {
    authenticated: !!localStorage.getItem("token"),
    error: false,
    message: "",
    role: 2
};

const authReducer = (state: IAuthState = initialState, action: AuthActions) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                authenticated: true,
                error: false,
                message: "",
                role: action.role
            };
        case "LOGIN_FAILED":
            return {
                authenticated: false,
                error: true,
                message: action.message,
                role: 2
            };
        case "REGISTER_SUCCESS":
            return {
                authenticated: state.authenticated,
                error: false,
                message: "Successfully Registered",
                role: 2
            };
        case "REGISTER_FAILED":
            return {
                authenticated: state.authenticated,
                error: true,
                message: action.message,
                role: 2
            };
        case "LOGOUT":
            return {
                authenticated: false,
                error: false,
                message: "",
                role: 2
            };
        default:
            return state;
    }
};
export default authReducer;