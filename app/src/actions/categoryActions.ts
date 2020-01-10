import { ICategory } from '../models/Category';

export const GET_CATEGORIES = "GET_CATEGORIES";

export function getCategories(categories: ICategory[]) {
    return {
        type: GET_CATEGORIES as typeof GET_CATEGORIES,
        categories
    }
}

type ActionCreators = typeof getCategories;
type ICategoryActions = ReturnType<ActionCreators>;
export default ICategoryActions;