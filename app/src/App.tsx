import React from 'react';
import { useDispatch } from 'react-redux';
import { history } from './store';

import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import Login from './containers/Login';
import Home from './containers/Home';
import Profile from './containers/Profile';
import LeaderBoard from './containers/LeaderBoard';
import Solver from './containers/Solver';
import Creator from './containers/Creator';
import PageNotFound from "./containers/PageNotFound";
import MessageBox from "./containers/MessageBox";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRole } from './thunks/authThunks';

const App: React.FC = () => {
    const dispatch = useDispatch();
    dispatch(getRole());
    return <>
        <MessageBox />
        <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar
            draggable={false} />
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/login" exact={true} component={Login} />
                <Route path="/" exact={true} component={Home} />
                <PrivateRoute path="/profile/:username" component={Profile} />
                <PrivateRoute path="/leaderBoard" exact={true} component={LeaderBoard} />
                <AdminRoute path="/auditList" exact={true} component={LeaderBoard} />
                <Route path="/challenge/solve/:problemId" exact={true} component={Solver} />
                <PrivateRoute path="/challenge/edit/:problemId" exact={true} component={Creator} />
                <Route component={PageNotFound} />
            </Switch>
        </ConnectedRouter>
    </>
};
export default App;
