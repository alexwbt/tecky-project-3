import React from 'react';
import { Provider } from 'react-redux';
import store, { history } from './store';

import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

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

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <MessageBox />
      <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar
      draggable={false}/>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" exact={true} component={Login} />
          <PrivateRoute path="/" exact={true} component={Home} />
          <PrivateRoute path="/profile/:username" component={Profile} />
          <PrivateRoute path="/leaderBoard" exact={true} component={LeaderBoard} />
          <PrivateRoute path="/challenge/:problemId" exact={true} component={Solver} />
          <PrivateRoute path="/challenge/edit/:problemId" exact={true} component={Creator} />
          <Route component={PageNotFound} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};
export default App;
