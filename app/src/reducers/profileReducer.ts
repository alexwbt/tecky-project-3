import ProfileActions from "../actions/profileActions";


export interface IProfileState {
    username: string;
    email: string;
    exp: number;
    location: string;
    postsRecord: {
        title: string;
        name: string;
        status: boolean;
        created_at: string;
        updated_at: string;
    }[];
    solvedRecord: {
        title: string;
        name: string;
        score: number;
        created_at: string;
    }[];
    rankingList: {
        username:string;
        experience:number;
        name:string;
    }[];
    auditList:{
        title: string;
        username: string;
        diffName: string;
        cateName: string;
        statusName: string;
        created_at: string;
    }[];
}

const initialState: IProfileState = {
    username: "",
    email: "",
    exp: 0,
    location: "",
    postsRecord: [],
    solvedRecord: [],
    rankingList: [],
    auditList: [],
};

const profileReducer = (state: IProfileState = initialState, action: ProfileActions) => {
    switch (action.type) {
        case "LOAD_PROFILE":
            return {
                username: action.username,
                email: action.email,
                exp: action.exp,
                location: action.location,
                postsRecord: action.postRecord,
                solvedRecord: action.solvedRecord,
                rankingList: action.rankingList,
                auditList: action.auditList,
            }
        default:
            return state;
    }
};
export default profileReducer;