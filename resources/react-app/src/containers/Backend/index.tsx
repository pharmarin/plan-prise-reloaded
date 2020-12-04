import MedicamentsBackend from 'containers/Backend/MedicamentsBackend';
import UsersBackend from 'containers/Backend/UsersBackend';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { updateAppNav } from 'store/app';

const Backend = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateAppNav({
        title: 'Administration',
        returnTo: {
          label: 'arrow-left',
          path: '/',
        },
      })
    );
  });

  return (
    <Switch>
      <Route path="/admin/medicaments/:id?/:edit?">
        <MedicamentsBackend />
      </Route>
      <Route path="/admin/utilisateurs">
        <UsersBackend />
      </Route>
      <Route path="/admin" exact>
        <div>
          <div>
            <Link to="/admin/medicaments">Médicaments</Link>
          </div>
          <div>
            <Link to="/admin/utilisateurs">Utilisateurs</Link>
          </div>
        </div>
      </Route>
    </Switch>
  );
};

export default Backend;
