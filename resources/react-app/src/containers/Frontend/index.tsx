import Authentification, { Role } from 'containers/App/Authentification';
import Accueil from 'containers/Frontend/Accueil';
import PlanPriseContainer from 'containers/Frontend/PlanPriseContainer';
import Profil from 'containers/Frontend/Profil';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import ProtectedRoute from 'containers/Utility/ProtectedRoute';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import CalendarContainer from './CalendarContainer';

const Frontend = () => {
  return (
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
      <Route path="/deconnexion">
        <ProtectedRoute>
          <ErrorBoundary returnTo="/">
            <Authentification role={Role.signout} />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>
      <Route path="/profil">
        <ProtectedRoute>
          <ErrorBoundary returnTo="/">
            <Profil />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>
      <Route path="/plan-prise/:id?/:action?">
        <ProtectedRoute>
          <ErrorBoundary returnTo="/">
            <PlanPriseContainer />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>
      <Route path="/calendrier/:id?/:action?">
        <ProtectedRoute>
          <ErrorBoundary returnTo="/">
            <CalendarContainer />
          </ErrorBoundary>
        </ProtectedRoute>
      </Route>
    </Switch>
  );
};

export default Frontend;
