import React from 'react';
import { Redirect, Route as RouterRoute } from 'react-router-dom';
import { withSanctum, WithSanctumProps } from 'react-sanctum';

type ProtectedRouteProps = WithSanctumProps<Models.User> & {
  children: React.ReactNode;
  path: string;
};

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
  props
) => {
  const { authenticated, path } = props;
  if (!authenticated) {
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
  return <RouterRoute {...props} />;
};

export default withSanctum(ProtectedRoute);
