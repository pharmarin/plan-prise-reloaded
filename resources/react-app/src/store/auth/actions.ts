import { ThunkAction } from 'redux-thunk';
import get from 'lodash/get';
import { RootState } from 'store/store';
import {
  performClearStorage,
  performRestoreTokens,
  performStoreTokens,
} from 'store/auth/services.local';
import {
  AuthActions,
  LOGIN,
  LOGIN_RESTORE,
  LOGOUT,
  RESET,
  Tokens,
  UserCredentials,
} from 'store/auth/types';
import { AxiosSuccess } from 'helpers/async-types';

if (!process.env.REACT_APP_OAUTH_ID || !process.env.REACT_APP_OAUTH_SECRET)
  throw new Error(
    'Please add REACT_APP_OAUTH_ID and REACT_APP_OAUTH_SECRET to .env'
  );
const clientCredentials = {
  client_id: process.env.REACT_APP_OAUTH_ID,
  client_secret: process.env.REACT_APP_OAUTH_SECRET,
  grant_type: 'password',
  scope: '',
};

export interface AxiosAction<TAction, TDispatchResponse = void> {
  (
    dispatch: (action: TAction) => TDispatchResponse,
    getState: () => RootState
  ): void;
}

export const doLogin = ({
  username,
  password,
}: UserCredentials): AxiosAction<AuthActions, Promise<AxiosSuccess>> => (
  dispatch
) => {
  dispatch({
    type: LOGIN.start,
    auth: true,
    payload: {
      request: {
        method: 'POST',
        data: {
          username,
          password,
          ...clientCredentials,
        },
        url: '/oauth/token',
      },
    },
  }).then((response) => {
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

export const doReset = (): AuthActions => {
  performClearStorage();
  return {
    type: RESET,
  };
};

export const doLogout = (): AxiosAction<AuthActions, Promise<AxiosSuccess>> => (
  dispatch
) => {
  dispatch({
    type: LOGOUT.start,
    auth: true,
    payload: {
      request: {
        method: 'DELETE',
        url: `/oauth/token`,
      },
    },
  })
    .then(() => dispatch(doReset()))
    .catch(() => dispatch(doReset()));
};

export const doRestore = (): ThunkAction<
  void,
  RootState,
  unknown,
  AuthActions
> => (dispatch) => {
  const tokens = performRestoreTokens();
  if (tokens) {
    dispatch({
      type: LOGIN_RESTORE,
      tokens: tokens as Tokens,
    });
  }
};
