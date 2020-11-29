import MedicamentsBackend from 'components/Backend/MedicamentsBackend';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

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
