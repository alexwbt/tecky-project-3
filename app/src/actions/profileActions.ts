import { CallHistoryMethodAction } from "connected-react-router";


export function loadProfile (username:string, email:string, exp:number, location:string, 
    postsTitle:string, postsName:string, status:boolean, postsCreatedAt:string, postsUpdatedAt:string, 
    solvedTitle:string, solvedName:string, score:number, solvedCreatedAt:string) {
    return {
        type: "LOAD_PROFILE" as "LOAD_PROFILE",
        username,
        email,
        exp,
        location,

        postsTitle,
        postsName,
        status,
        postsCreatedAt,
        postsUpdatedAt,

        solvedTitle,
        solvedName,
        score,
        solvedCreatedAt,
    };
}


type ActionCreators = typeof loadProfile;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
