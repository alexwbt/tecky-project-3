import { CallHistoryMethodAction } from "connected-react-router";


export function loadProfile (username:string, email:string, exp:number, location:string, 
    postRecord: [], solvedRecord: []) {
    return {
        type: "LOAD_PROFILE" as "LOAD_PROFILE",
        username,
        email,
        exp,
        location,
        postRecord,
        solvedRecord,
    };

}

type ActionCreators = typeof loadProfile;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
