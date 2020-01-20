import { CallHistoryMethodAction } from "connected-react-router";


export function loadProfile(username: string, email: string, exp: number, level: {
    lvl: number,
    exp: number,
    req: number
}, location: string, postsRecord: [], solvedRecord: []) {
    return {
        type: "LOAD_PROFILE" as "LOAD_PROFILE",
        username,
        email,
        exp,
        level,
        location,
        postsRecord,
        solvedRecord
    };
}

export function loadPostRecord(postsRecord: []) {
    return {
        type: "LOAD_POST_RECORD" as "LOAD_POST_RECORD",
        postsRecord
    };
}

type ActionCreators = typeof loadProfile | typeof loadPostRecord;
type Actions = ReturnType<ActionCreators> | CallHistoryMethodAction;
export default Actions;
