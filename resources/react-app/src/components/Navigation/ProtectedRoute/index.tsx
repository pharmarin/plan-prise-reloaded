import React, { useState, useEffect } from 'react';
import { Redirect, Route as RouterRoute } from 'react-router-dom';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import SplashScreen from 'components/App/SplashScreen';

type ProtectedRouteProps = WithSanctumProps<Models.User> & {
  children: React.ReactNode;
  path: string;
};

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
  props
) => {
  const { checkAuthentication, path } = props;
  const [authenticated, setAuthenticated] = useState<null | boolean>(null);

  useEffect(() => {
    checkAuthentication().then(setAuthenticated);
  }, [checkAuthentication]);

  if (authenticated === false) {
    console.info('Cannot access route: No token provided', path);
    const redirectTo = path;
    return (
      <Redirect
        to={{
          pathname: '/connexion',
          state: {
            message: 'unauthorized',
            redirectTo,
          },
        }}
      />
    );
  }

  if (authenticated === true) {
    return <RouterRoute {...props} />;
  }

  return <SplashScreen type="loading" />;
};

export default withSanctum(ProtectedRoute);
