import ProfileActions from "../actions/profileActions";


export interface IProfileState {
    username: string;
    email: string;
    exp: number;
    location: string;

    postsTitle: string;
    postsName: string;
    status: boolean;
    postsCreatedAt: string;
    postsUpdatedAt: string;

    solvedTitle: string;
    solvedName: string;
    score: number;
    solvedCreatedAt: string;
}

const initialState: IProfileState = {
    username: "",
    email: "",
    exp: 0,
    location: "",

    postsTitle: "",
    postsName: "",
    status: false,
    postsCreatedAt: "",
    postsUpdatedAt: "",

    solvedTitle: "",
    solvedName: "",
    score: 0,
    solvedCreatedAt: "",

};

const profileReducer = (state: IProfileState = initialState, action: ProfileActions) => {
    switch (action.type) {
        case "LOAD_PROFILE":
            return {
                username: action.username,
                email: action.email,
                exp: action.exp,
                location: action.location,

                postsTitle: action.postsTitle,
                postsName: action.postsName,
                status: action.status,
                postsCreatedAt: action.postsCreatedAt,
                postsUpdatedAt: action.postsUpdatedAt,

                solvedTitle: action.solvedTitle,
                solvedName: action.solvedName,
                score: action.score,
                solvedCreatedAt: action.solvedCreatedAt,
            }
        default:
            return state;
    }
};
export default profileReducer;