import React from 'react';
import { Subtract } from 'utility-types';
import get from 'lodash/get';
import { performValidation, getValue } from 'store/auth/services.local';
import keys from 'lodash/keys';

/**
 * TODO: Ne pas devoir appeler connect dans le composant parent
 * -> Accéder au store directement depuis AuthGate
 */

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

const authenticate = <P extends AuthProps>(Component: React.ComponentType<P>) =>
  class Authenticator extends React.Component<Subtract<P, AuthProps>> {
    render() {
      if (!('tokens' in this.props) && !('doRestore' in this.props))
        throw new Error('Authentication needs direct access to tokens');
      const tokens = get(this.props, 'tokens');
      const isValid = performValidation(tokens);
      const hasToken = keys(tokens).includes('access_token');
      const user = getValue(get(tokens, 'access_token'), 'usr') || {};
      return (
        <Component {...(this.props as P)} auth={{ hasToken, isValid, user }} />
      );
    }
  };

export default authenticate;
