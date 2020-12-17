import Dashboard from 'containers/Backend/Dashboard';
import MedicamentsBackend from 'containers/Backend/MedicamentsBackend';
import UsersBackend from 'containers/Backend/UsersBackend';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Backend = () => {
  return (
    <Switch>
      <Route path="/admin/medicaments/:id?">
        <MedicamentsBackend />
      </Route>
      <Route path="/admin/utilisateurs">
        <UsersBackend />
      </Route>
      <Route path="/admin" exact>
        <Dashboard />
      </Route>
    </Switch>
  );
};

export default Backend;
