import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";

import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory } from "history";

import authReducer, { IAuthState } from "./reducers/authReducer";
import AuthActions from "./actions/authActions";
import problemReducer, { IProblemState } from "./reducers/problemReducer";
import ProblemActions from "./actions/problemActions";
import profileReducer, { IProfileState } from "./reducers/profileReducer";
import ProfileActions from "./actions/profileActions";
import ICategoryActions from './actions/categoryActions';
import { ICategoryState, categoryReducer } from "./reducers/categoryReducer";
import IMessageBoxActions from './actions/messageBoxActions';
import { IMessageBoxState, messageBoxReducer } from "./reducers/messageBoxReducer";
import { IDifficultyState, difficultyReducer } from "./reducers/difficultyReducer";
import IDifficultyActions from "./actions/difficultyActions";
import { IProblemStatusesState, problemStatusesReducer } from "./reducers/problemStatusReducer";
import IProblemStatusActions from "./actions/problemStatusActions";

export const history = createBrowserHistory();

export interface IRootState {
    auth: IAuthState;
    message: IMessageBoxState;
    problem: IProblemState;
    profile: IProfileState;
    router: RouterState;
    category: ICategoryState;
    difficulty: IDifficultyState;
    problemStatuses: IProblemStatusesState;
}

type RootActions = AuthActions
    | IMessageBoxActions
    | ProblemActions
    | ProfileActions
    | ICategoryActions
    | IDifficultyActions
    | IProblemStatusActions;

const rootReducer = combineReducers<IRootState>({
    auth: authReducer,
    message: messageBoxReducer,
    problem: problemReducer,
    profile: profileReducer,
    router: connectRouter(history),
    category: categoryReducer,
    difficulty: difficultyReducer,
    problemStatuses: problemStatusesReducer,
});


export type ReduxThunkDispatch = ThunkDispatch<IRootState, null, RootActions>;


declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export default createStore<IRootState, RootActions, {}, {}>(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk),
        applyMiddleware(routerMiddleware(history))
    )
);