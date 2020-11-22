import React from 'react';
import { Route, Switch } from 'react-router-dom';
import MedicamentsBackend from './MedicamentsBackend';

const Backend = () => {
  return (
    <Switch>
      <Route path="/admin/:id?/:edit?">
        <MedicamentsBackend />
      </Route>
    </Switch>
  );
};

export default Backend;
