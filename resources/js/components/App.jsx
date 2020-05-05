import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch } from 'react-router-dom';

import store from '../redux/store';
import Accueil from './app/Accueil';
import Navigation from './app/Navigation';
import Authentification from './app/Authentification';
import { PublicRoute, Route as ProtectedRoute } from './app/Routes';
import Profile from './app/Profile';
import PlanPrise from './PlanPrise';

import { doRestore } from '../redux/user/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
    const state = store.getState();
    if (!state.userReducer.token) {
      store.dispatch(doRestore());
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Navigation />
          <Switch>
            <PublicRoute path="/" exact>
              <Accueil />
            </PublicRoute>
            <PublicRoute path="/inscription">
              <Authentification to="register" />
            </PublicRoute>
            <PublicRoute path="/connexion">
              <Authentification to="signin" />
            </PublicRoute>
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
