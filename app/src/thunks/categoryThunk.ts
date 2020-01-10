import { Dispatch } from "react";
import IMessageBoxActions, { showMessageBox } from '../actions/messageBoxActions';
import ICategoryActions, { getCategories } from '../actions/categoryActions';

const { REACT_APP_API_SERVER } = process.env;

export function getCategoriesThunk() {
    return async (dispatch: Dispatch<ICategoryActions | IMessageBoxActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/category/`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(getCategories(result.categories));
            } else {
                dispatch(showMessageBox("Oops!" ,result.message));
            }
        } catch (error) {
            dispatch(showMessageBox("Oops!" , "Something went wrong!"));
        }
        
    }
}