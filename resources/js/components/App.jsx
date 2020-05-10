/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import store from 'redux/store';
import Accueil from 'components/app/Accueil';
import Navigation from 'components/app/Navigation';
import Authentification from 'components/app/Authentification';
import { Route as ProtectedRoute } from 'components/app/Routes';
import Profile from 'components/app/Profile';
import PlanPrise from 'components/PlanPrise';

import { doRestore } from 'redux/auth/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    const state = store.getState();
    if (!state.auth.token) {
      store.dispatch(doRestore());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Navigation />
          <Switch>
            <Route exact path="/">
              <Accueil />
            </Route>
            <Route path="/inscription">
              <Authentification to="register" />
            </Route>
            <Route path="/connexion">
              <Authentification to="signin" />
            </Route>
            <ProtectedRoute path="/deconnexion">
              <Authentification to="signout" />
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <Profile />
            </ProtectedRoute>
            <ProtectedRoute path="/plan-prise/:id">
              <PlanPrise />
            </ProtectedRoute>
            <ProtectedRoute path="/plan-prise">
              <PlanPrise />
            </ProtectedRoute>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
