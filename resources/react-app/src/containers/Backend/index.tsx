import Dashboard from 'containers/Backend/Dashboard';
import Medicaments from 'containers/Backend/Medicaments';
import Users from 'containers/Backend/Users';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Backend = () => {
  return (
    <Switch>
      <Route path="/admin/medicaments/:id?">
        <Medicaments />
      </Route>
      <Route path="/admin/utilisateurs">
        <Users />
      </Route>
      <Route path="/admin" exact>
        <Dashboard />
      </Route>
    </Switch>
  );
};

export default Backend;
