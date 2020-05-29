import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Accueil from 'components/Accueil';
import Authentification, { Role } from 'components/Authentification';
import ProtectedRoute from 'components/Navigation/ProtectedRoute';
import Profil from 'components/Profil';
import PlanPrise from 'components/PlanPrise';

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
    <ProtectedRoute path="/profil">
      <Profil />
    </ProtectedRoute>
    <ProtectedRoute path="/plan-prise/:id?">
      <PlanPrise />
    </ProtectedRoute>
  </Switch>
);
