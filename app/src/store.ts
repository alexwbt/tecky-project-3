import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";

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

import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

export interface IRootState {
    auth: IAuthState;
    problem: IProblemState;
    profile: IProfileState;
    router: RouterState;
    category: ICategoryState;
    message: IMessageBoxState;
}

type RootActions = AuthActions | ProblemActions | ProfileActions | ICategoryActions | IMessageBoxActions;

const rootReducer = combineReducers<IRootState>({
    auth: authReducer,
    problem: problemReducer,
    profile: profileReducer,
    router: connectRouter(history),
    category: categoryReducer,
    message: messageBoxReducer,
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