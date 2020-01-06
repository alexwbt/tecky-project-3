import { Dispatch } from "react";
import ProfileActions, { loadProfile } from "../actions/profileActions";
import { push } from "connected-react-router";
import { ICanvasContent } from "../components/canvas/CanvasContent";


const { REACT_APP_API_SERVER } = process.env;

export function uploadProblem(title: string, description: string, canvas: ICanvasContent, avalibleBlockls: string[], gameCode: string) {
    return async (dispatch: Dispatch<ProfileActions>) => {
        const res = await fetch(`${REACT_APP_API_SERVER}/problem`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({

            })
        });
        const result = await res.json();

        if (res.status === 200 && result.success) {

        } else {

        }
    };
}
