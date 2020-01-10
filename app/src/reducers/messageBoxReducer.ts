import IMessageBoxActions, { SHOW_MESSAGE_BOX, HIDE_MESSAGE_BOX } from "../actions/messageBoxActions";
import { IMessage } from '../models/Message';

export interface IMessageBoxState extends IMessage { }

const initialState: IMessageBoxState = {
    show: false,
    title: "",
    body: "",
}

export const messageBoxReducer = (state: IMessageBoxState = initialState, action: IMessageBoxActions) => {
    switch (action.type) {
        case SHOW_MESSAGE_BOX:
            return {
                show: true,
                title: action.title,
                body: action.body,
            }
        case HIDE_MESSAGE_BOX:
            return {
                show: false,
                title: "",
                body: "",
            }
        default:
            return initialState;
    }
}