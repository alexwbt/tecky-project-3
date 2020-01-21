import AuthActions from "../actions/authActions";


export interface IAuthState {
    authenticated: boolean | null;
    error: boolean;
    message: string;
    role: number;
}

const initialState: IAuthState = {
    authenticated: null,
    error: false,
    message: "",
    role: 0
};

const authReducer = (state: IAuthState = initialState, action: AuthActions) => {
    switch (action.type) {
        case "SET_ROLE":
            return {
                authenticated: true,
                error: false,
                message: "",
                role: action.role
            };
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
                role: 0
            };
        case "REGISTER_SUCCESS":
            return {
                authenticated: state.authenticated,
                error: false,
                message: "Successfully Registered",
                role: 0
            };
        case "REGISTER_FAILED":
            return {
                authenticated: state.authenticated,
                error: true,
                message: action.message,
                role: 0
            };
        case "LOGOUT":
            return {
                authenticated: false,
                error: false,
                message: "",
                role: 0
            };
        default:
            return state;
    }
};
export default authReducer;