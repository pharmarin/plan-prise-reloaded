import React, { useState, useEffect } from 'react';
import { Redirect, Route as RouterRoute, useLocation } from 'react-router-dom';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import SplashScreen from 'components/App/SplashScreen';

type ProtectedRouteProps = WithSanctumProps<IModels.User> &
  IProps.ProtectedRoute;

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
  props
) => {
  const { checkAuthentication, user } = props;
  const location = useLocation();
  const redirectTo = location.pathname;
  const [authenticated, setAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    checkAuthentication().then(setAuthenticated);
  }, [checkAuthentication]);

  if (authenticated === false) {
    return (
      <Redirect
        to={{
          pathname: '/connexion',
          state: {
            message: "Vous devez vous connecter avant d'accéder à cette page. ",
            redirectTo,
          },
        }}
      />
    );
  }

  if (authenticated === true) {
    if (user?.admin !== true) {
      return (
        <Redirect
          to={{
            pathname: '/connexion',
            state: {
              message:
                'Vous devez être administrateur pour accéder à cette page. ',
              redirectTo,
            },
          }}
        />
      );
    }
    return <RouterRoute {...props} />;
  }

  return <SplashScreen message="Authentification en cours" type="load" />;
};

export default withSanctum(ProtectedRoute);
