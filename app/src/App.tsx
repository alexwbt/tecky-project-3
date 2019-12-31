import React from 'react';
import { Provider } from 'react-redux';
import store, { history } from './store';

import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import LeaderBoard from './LeaderBoard';
import PageNotFound from "./PageNotFound";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" exact={true} component={Login} />
          <PrivateRoute path="/" exact={true} component={Home} />
          <PrivateRoute path="/profile/:username" component={Profile} />
          <PrivateRoute path="/leaderBoard" exact={true} component={LeaderBoard} />
          <Route component={PageNotFound} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};
export default App;
