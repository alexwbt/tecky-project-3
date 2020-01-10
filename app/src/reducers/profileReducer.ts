import ProfileActions from "../actions/profileActions";


export interface IProfileState {
    username: string;
    email: string;
    exp: number;
    location: string;
}

const initialState: IProfileState = {
    username: "",
    email: "",
    exp: 0,
    location: "",
};

const profileReducer = (state: IProfileState = initialState, action: ProfileActions) => {
    switch (action.type) {
        case "LOAD_PROFILE":
            return {
                username: action.username,
                email: action.email,
                exp: action.exp,
                location: action.location,
            }
        default:
            return state;
        }
    };
export default profileReducer;