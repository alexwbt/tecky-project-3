import React from 'react';
import { Provider } from 'react-redux';
import store, { history } from './store';
import 'bootstrap/dist/css/bootstrap.css';

import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Home from './Home';
import Profile from './Profile';
import LeaderBoard from './LeaderBoard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <PrivateRoute path="/" exact={true} component={Home} />
          <PrivateRoute path="/profile" exact={true} component={Profile} />
          <PrivateRoute path="/leaderBoard" exact={true} component={LeaderBoard} />
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
};
export default App;
