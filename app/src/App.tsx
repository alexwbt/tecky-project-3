import React from 'react';
import Login from './Login';
import { Provider } from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.css';

import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import { history } from "./store";
// import { PrivateRoute } from './PrivateRoute';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          {/* <PrivateRoute path="/" exact={true} component={} /> */}
        </Switch>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;
