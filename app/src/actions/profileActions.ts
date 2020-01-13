import { CallHistoryMethodAction } from "connected-react-router";


export function loadProfile (username:string, email:string, exp:number, location:string, 
    postRecord: [], solvedRecord: [], rankingList:[]) {
    return {
        type: "LOAD_PROFILE" as "LOAD_PROFILE",
        username,
        email,
        exp,
        location,
        postRecord,
        solvedRecord,
        rankingList,
    };

}

type ActionCreators = typeof loadProfile;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
