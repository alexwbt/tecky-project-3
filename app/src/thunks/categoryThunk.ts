import { Dispatch } from "react";
import { toast } from "react-toastify";
import ICategoryActions, { getCategories } from '../actions/categoryActions';


const { REACT_APP_API_SERVER } = process.env;

export function getCategoriesThunk() {
    return async (dispatch: Dispatch<ICategoryActions>) => {
        try {
            const res = await fetch(`${REACT_APP_API_SERVER}/category/`);
            const result = await res.json();

            if (res.status === 200 && result.success) {
                dispatch(getCategories(result.categories));
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Cannot connect to server!");
        }
        
    }
}