import React from 'react';
import { connect } from 'react-redux';
import { Diff } from 'utility-types';
import get from 'lodash/get';
import keys from 'lodash/keys';

import { RootState } from 'store/store';
import { performValidation, getValue } from 'store/auth/services.local';

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
