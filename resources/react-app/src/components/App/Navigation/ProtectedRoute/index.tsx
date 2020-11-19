import React, { useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import SplashScreen from 'components/App/SplashScreen';

type ProtectedRouteProps = Props.Frontend.App.ProtectedRoute;

export default ({ admin, children }: ProtectedRouteProps) => {
  const { authenticated, user } = useContext(SanctumContext);

  const { pathname } = useLocation();

  if (authenticated === false) {
    return (
      <Redirect
        to={{
          pathname: '/connexion',
          state: {
            message: "Vous devez vous connecter avant d'accéder à cette page. ",
            redirectTo: pathname,
          },
        }}
      />
    );
  }

  if (authenticated === true) {
    if (admin && user?.admin !== true) {
      return (
        <Redirect
          to={{
            pathname: '/connexion',
            state: {
              message:
                'Vous devez être administrateur pour accéder à cette page. ',
              redirectTo: pathname,
            },
          }}
        />
      );
    }

    return children || null;
  }

  return <SplashScreen message="Authentification en cours" type="load" />;
};
