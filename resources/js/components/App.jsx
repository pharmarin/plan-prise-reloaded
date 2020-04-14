import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import store from '../redux/store';
import Navigation from './app/Navigation';
import Authentification from './app/Authentification';
import PlanPrise from './PlanPrise';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router basename="/">
          <Navigation />
          <Switch>
            <Route path="/connexion">
              <Authentification role="signin"/>
            </Route>
            <Route path="/inscription">
              <Authentification role="register" />
            </Route>
            <Route path="/plan-prise/:id">
              <PlanPrise />
            </Route>
            <Route path="/plan-prise">
              <PlanPrise />
            </Route>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App
