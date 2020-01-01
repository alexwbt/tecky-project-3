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
import PageNotFound from "./containers/PageNotFound";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" exact={true} component={Login} />
          <PrivateRoute path="/" exact={true} component={Home} />
          <PrivateRoute path="/profile/:username" component={Profile} />
          <PrivateRoute path="/leaderBoard" exact={true} component={LeaderBoard} />
          <PrivateRoute path="/problem/:problemId" exact={true} component={Solver} />
          <Route component={PageNotFound} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};
export default App;
