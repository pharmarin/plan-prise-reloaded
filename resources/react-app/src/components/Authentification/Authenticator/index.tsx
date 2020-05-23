import React from 'react';
import { connect } from 'react-redux';
import { Diff } from 'utility-types';
import jwt from 'jsonwebtoken';
import get from 'lodash/get';
import keys from 'lodash/keys';

import { RootState } from 'store/store';
import { Tokens } from 'store/app';

export type AuthProps = {
  auth: {
    hasToken: boolean;
    isValid: boolean;
    user: {
      admin: boolean;
      name: string;
    };
  };
};

const decodeToken = (token: string): { [key: string]: any } | null => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken) return get(decodedToken, 'payload');
  return null;
};

const getValue = (token: string, key: string): string | number | null => {
  const payload = decodeToken(token);
  if (payload) return payload[key];
  return null;
};

const performValidation = (tokens: Tokens | null) => {
  if (!tokens) return false;

  const accessToken = tokens.access_token;
  const expirationTime = getValue(accessToken, 'exp'); // PHP timestamp in s
  if (typeof expirationTime !== 'number')
    throw new Error('Expiration date should be a number. ');
  const timeNow = new Date().getTime(); // JS timestamp in ms

  if (expirationTime * 1000 > timeNow) {
    // Si le token expire plus tard que maintenant
    return true;
  }

  return false;
};

export default <BaseProps extends AuthProps>(
  Component: React.ComponentType<BaseProps>
) => {
  const mapStateToProps = (state: RootState) => {
    const tokens = get(state, 'auth.tokens');
    const isValid = performValidation(tokens);
    const hasToken = keys(tokens).includes('access_token');
    const user = tokens ? getValue(get(tokens, 'access_token'), 'usr') : {};
    return {
      auth: {
        hasToken,
        isValid,
        user,
      },
    };
  };

  type HocProps = ReturnType<typeof mapStateToProps>;

  class Authenticator extends React.Component<HocProps> {
    render() {
      const { auth, ...restProps } = this.props;
      return <Component {...(restProps as BaseProps)} auth={auth} />;
    }
  }

  return connect<
    ReturnType<typeof mapStateToProps>,
    undefined,
    Diff<BaseProps, AuthProps>,
    RootState
  >(mapStateToProps)(Authenticator);
};
