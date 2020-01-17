import { CallHistoryMethodAction } from "connected-react-router";


export function loadProfile(username: string, email: string, exp: number, level: {
        lvl: number,
        exp: number,
        req: number
    }, location: string, postRecord: [], solvedRecord: []) {
    return {
        type: "LOAD_PROFILE" as "LOAD_PROFILE",
        username,
        email,
        exp,
        level,
        location,
        postRecord,
        solvedRecord
    };

}

type ActionCreators = typeof loadProfile;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
