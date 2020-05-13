import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect, Route as RouterRoute } from "react-router-dom";
import authenticator, { AuthProps } from "components/auth/AuthGate";

interface RootState {
  auth: {
    tokens: {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

const mapState = (state: RootState) => ({
  tokens: state.auth.tokens,
});

const connector = connect(mapState);

type StoreProps = ConnectedProps<typeof connector>;

type ProtectedRouteProps = StoreProps &
  AuthProps & {
    children: React.ReactNode;
    path: string;
  };

const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
  props
) => {
  const { auth, path } = props;
  if (!auth.hasToken) {
    console.info("Cannot access route: No token provided", path);
    const redirectTo = path;
    return (
      <Redirect
        to={{
          pathname: "/connexion",
          state: {
            message: "unauthorized",
            redirectTo,
          },
        }}
      />
    );
  }
  if (!auth.isValid) {
    console.info("Cannot access route: Token expired", path);
    const redirectTo = path;
    return (
      <Redirect
        to={{
          pathname: "/connexion",
          state: {
            message: "expired",
            redirectTo,
          },
        }}
      />
    );
  }
  return <RouterRoute {...props} />;
};

export default connector(authenticator(ProtectedRoute));
