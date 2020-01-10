export const SHOW_MESSAGE_BOX = "SHOW_MESSAGE_BOX";
export const HIDE_MESSAGE_BOX = "HIDE_MESSAGE_BOX";

export function showMessageBox(title: string, body: string) {
    return {
        type: SHOW_MESSAGE_BOX as typeof SHOW_MESSAGE_BOX,
        title,
        body,
    }
}

export function hideMessageBox() {
    console.log("hideMessageBox action");
    
    return {
        type: HIDE_MESSAGE_BOX as typeof HIDE_MESSAGE_BOX,
    }
}

type ActionCreators = typeof showMessageBox | typeof hideMessageBox;
type IMessageBoxActions = ReturnType<ActionCreators>;
export default IMessageBoxActions;