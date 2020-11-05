import React, { useState, useEffect, useContext } from 'react';
import { Redirect, Route as RouterRoute, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import SplashScreen from 'components/App/SplashScreen';

type ProtectedRouteProps = IProps.ProtectedRoute;

export default (props: ProtectedRouteProps) => {
  const { authenticated, checkAuthentication, user } = useContext(
    SanctumContext
  );

  const { pathname } = useLocation();

  const [checkDone, setCheckDone] = useState<null | boolean>(null);

  if (!checkAuthentication) throw new Error('Sanctum props are missing');

  useEffect(() => {
    checkAuthentication().then(() => setCheckDone(true));
  }, [checkAuthentication]);

  if (checkDone && authenticated === false) {
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

  if (checkDone && authenticated === true) {
    if (user?.admin !== true) {
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
    return <RouterRoute {...props} />;
  }

  return <SplashScreen message="Authentification en cours" type="load" />;
};
