import get from 'lodash/get';
import {
  performClearStorage,
  performRestoreTokens,
  performStoreTokens,
} from '@redux/auth/services.local';
import asyncTypes from '@helpers/async-types';
import clientCredentials from '@root/oauth2-client.json';

export const TYPES = {
  ...asyncTypes('LOGIN'),
  ...asyncTypes('LOGOUT'),
  RESET: 'RESET',
  LOGIN_RESTORE: 'LOGIN_RESTORE',
};

export const doLogin = ({ username, password }) => (dispatch) => {
  dispatch({
    auth: true,
    type: 'LOGIN',
    payload: {
      request: {
        method: 'post',
        data: {
          username,
          password,
          ...clientCredentials,
        },
        url: '/oauth/token',
      },
    },
  }).then((response) => {
    console.log('response', response);
    try {
      if (response.payload.status !== 200)
        throw new Error('User could not be logged in. ');
      const tokens = get(response, 'payload.data');
      performStoreTokens(tokens);
    } catch (error) {
      console.log('Could not store tokens to localStorage', error);
    }
  });
};

export const doReset = () => {
  performClearStorage();
  return {
    type: TYPES.RESET,
  };
};

export const doLogout = () => (dispatch) => {
  dispatch({
    type: 'LOGOUT',
    auth: true,
    payload: {
      request: {
        method: 'delete',
        url: `/oauth/token`,
      },
    },
  })
    .then(() => dispatch(doReset()))
    .catch(() => dispatch(doReset()));
};

export const doRestore = () => (dispatch) => {
  const tokens = performRestoreTokens();
  if (tokens) {
    dispatch({
      type: TYPES.LOGIN_RESTORE,
      tokens,
    });
  }
};
