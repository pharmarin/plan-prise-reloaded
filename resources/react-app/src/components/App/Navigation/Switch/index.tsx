import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Accueil from 'components/Accueil';
import Authentification, { Role } from 'components/App/Authentification';
import ProtectedRoute from '../ProtectedRoute';
import ErrorBoundary from 'components/App/ErrorBoundary';
import Profil from 'components/Profil';
import PlanPrise from 'components/PlanPrise';
import Backend from 'components/Backend';

export default () => (
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
    <ErrorBoundary returnTo="/connexion">
      <ProtectedRoute path="/profil">
        <ErrorBoundary returnTo="/">
          <Profil />
        </ErrorBoundary>
      </ProtectedRoute>
      <ProtectedRoute path="/plan-prise/:id?/:action?">
        <ErrorBoundary returnTo="/">
          <PlanPrise />
        </ErrorBoundary>
      </ProtectedRoute>
      <ProtectedRoute admin path="/admin">
        <ErrorBoundary returnTo="/">
          <Backend />
        </ErrorBoundary>
      </ProtectedRoute>
    </ErrorBoundary>
  </Switch>
);
