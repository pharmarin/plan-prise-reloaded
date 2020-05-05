import { performInfo } from './services.api';
import {
  performClearStorage,
  performRestoreToken,
  performRestoreUser,
  performStoreToken,
  performStoreUser,
} from './services.local';

export const TYPES = {
  LOADING: 'LOADING',
  LOGIN: 'LOGIN',
  RESET: 'RESET',
};

export const doLogin = (credentials) => {
  if (credentials.token) performStoreToken(credentials.token);
  if (credentials.user) performStoreUser(credentials.user);
  return {
    type: TYPES.LOGIN,
    token: credentials.token,
    user: credentials.user,
  };
};

export const doReset = () => {
  performClearStorage();
  return {
    type: TYPES.RESET,
  };
};

/* const doRefresh = (token) => {
  console.log(token);
  performRefresh(token).then((details) => console.log(details));
}; */

const doFetch = () => (dispatch) => {
  performInfo().then((user) => {
    console.log(user);
    if (user) {
      dispatch(
        doLogin({
          user,
        }),
      );
    } else {
      dispatch(doReset());
    }
  });
};

export const doRestore = () => (dispatch) => {
  const token = performRestoreToken();
  const user = performRestoreUser();
  if (token) {
    dispatch(
      doLogin({
        token,
        user,
      }),
    );
    if (!user) {
      dispatch(doFetch());
    }
  }
};
