import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Route as RouterRoute } from 'react-router-dom';
import { performValidation } from '../../redux/auth/services.local';

// eslint-disable-next-line react/jsx-props-no-spreading
const PublicRoute = (props) => <RouterRoute {...props} />;

const ProtectedRoute = (props) => {
  const { user, path, tokens } = props;
  if (!tokens) {
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
  if (!user.isValid) {
    console.info('Cannot access route: Token expired', path);
    const redirectTo = path;
    return (
      <Redirect
        to={{
          pathname: '/connexion',
          state: {
            message: 'expired',
            redirectTo,
          },
        }}
      />
    );
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <RouterRoute {...props} />;
};

ProtectedRoute.propTypes = {
  path: PropTypes.string,
  user: PropTypes.shape({
    isAuth: PropTypes.bool,
    isValid: PropTypes.bool,
  }),
  tokens: PropTypes.shape({
    access_token: PropTypes.string,
    refresh_token: PropTypes.string,
    token_type: PropTypes.string,
    expires_in: PropTypes.number,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: {
      ...state.authReducer.user,
      isValid: performValidation(state.authReducer.tokens),
    },
    tokens: state.authReducer.tokens,
  };
};

const Route = connect(mapStateToProps)(ProtectedRoute);

export { Route, PublicRoute };
