import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";

import IAuthState from "./auth/state";
import authReducer from "./auth/reducer";
import { AuthActions } from "./auth/actions";

import { routerMiddleware, connectRouter, RouterState } from 'connected-react-router';
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

export interface IRootState {
    auth: IAuthState,
    router: RouterState
}

type RootActions = AuthActions;

const rootReducer = combineReducers<IRootState>({
    auth: authReducer,
    router: connectRouter(history)
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