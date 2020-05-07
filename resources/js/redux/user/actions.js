import { performInfo } from './services.api';
import {
  performClearStorage,
  performRestoreTokens,
  performRestoreUser,
  performStoreTokens,
  performStoreUser,
} from './services.local';

export const TYPES = {
  LOADING: 'LOADING',
  LOGIN: 'LOGIN',
  RESET: 'RESET',
};

export const doLogin = (credentials) => {
  const { user, ...tokens } = credentials;
  if (tokens) performStoreTokens(tokens);
  if (user) performStoreUser(user);
  return {
    type: TYPES.LOGIN,
    tokens,
    user,
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
  const token = performRestoreTokens();
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
