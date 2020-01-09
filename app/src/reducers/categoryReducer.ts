import ICategoryActions, { GET_CATEGORIES } from "../actions/categoryActions";
import { ICategory } from '../models/Category';

export interface ICategoryState {
    list: ICategory[] | null
}

const initialState: ICategoryState = {
    list: null,
}

export const categoryReducer = (state: ICategoryState = initialState, action: ICategoryActions) => {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                list: action.categories,
            }
        default:
            return state;
    }
}