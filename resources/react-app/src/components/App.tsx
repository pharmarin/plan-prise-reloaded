import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { store, persistor } from 'store/store';
import Accueil from 'components/app/Accueil';
import Navigation from 'components/app/Navigation';
import Authentification, { Role } from 'components/auth/Authentification';
import ProtectedRoute from 'components/app/ProtectedRoute';
import Profile from 'components/app/Profile';
import PlanPrise from 'components/PlanPrise';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading="Chargement en cours" persistor={persistor}>
          <Router basename="/">
            <Navigation />
            <Switch>
              <Route exact path="/">
                <Accueil />
              </Route>
              <Route path="/inscription">
                <Authentification role={Role.register} />
              </Route>
              <Route path="/connexion">
                <Authentification role={Role.signin} />
              </Route>
              <ProtectedRoute path="/deconnexion">
                <Authentification role={Role.signout} />
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
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
