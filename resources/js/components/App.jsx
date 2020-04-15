import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch
} from "react-router-dom";

import store from '../redux/store';
import Navigation from './app/Navigation';
import Authentification from './app/Authentification';
import { PublicRoute, Route as ProtectedRoute } from './app/Routes';
import Profile from './app/Profile';
import PlanPrise from './PlanPrise';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Navigation />
          <Switch>
            <PublicRoute path="/" exact>
              <div>ROOT</div>
            </PublicRoute>
            <PublicRoute path="/inscription">
              <Authentification role="register" />
            </PublicRoute>
            <PublicRoute path="/connexion">
              <Authentification role="signin"/>
            </PublicRoute>
            <ProtectedRoute path="/deconnexion">
              <Authentification role="signout"/>
            </ProtectedRoute>
            <ProtectedRoute path="/profile">
              <Profile/>
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
    )
  }
}

export default App
