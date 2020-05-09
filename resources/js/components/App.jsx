/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

import store from '../redux/store';
import Accueil from './app/Accueil';
import Navigation from './app/Navigation';
import Authentification from './app/Authentification';
import { Route as ProtectedRoute } from './app/Routes';
import Profile from './app/Profile';
import PlanPrise from './PlanPrise';

import { doRestore } from '../redux/auth/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    const state = store.getState();
    if (!state.authReducer.token) {
      store.dispatch(doRestore());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Navigation />
          <Switch>
            <Route path="/" exact>
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
