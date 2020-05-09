/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import get from 'lodash/get';
import {
  performValidation,
  getValue,
} from '../../redux/auth/services.local';
import { doRestore } from '../../redux/auth/actions';

const authenticate = (WrappedComponent) => {
  const component = (props) => {
    if (!('tokens' in props) && !('doRestore' in props))
      throw new Error(
        'Authentication needs to have access to tokens',
      );
    const tokens = get(props, 'tokens');
    if (!tokens) doRestore();
    const isValid = performValidation(tokens);
    const user = getValue(get(tokens, 'access_token'), 'usr') || {};
    return <WrappedComponent {...props} auth={{ isValid, user }} />;
  };
  return component;
};

export default authenticate;
