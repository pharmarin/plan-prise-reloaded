import { performLogin } from './services.api';
import {
  performClearStorage,
  performRestoreTokens,
  performStoreTokens,
} from './services.local';

const asyncTypes = (action) => ({
  [`${action}_START`]: `${action}_START`,
  [`${action}_SUCCESS`]: `${action}_SUCCESS`,
  [`${action}_ERROR`]: `${action}_ERROR`,
});

export const TYPES = {
  RESET: 'RESET',
  LOGIN_RESTORE: 'LOGIN_RESTORE',
  ...asyncTypes('LOGIN'),
};

export const doLogin = ({ username, password }) => async (
  dispatch,
) => {
  dispatch({ type: TYPES.LOGIN_START });
  try {
    const tokens = await performLogin(username, password);
    dispatch({ type: TYPES.LOGIN_SUCCESS, tokens });
    try {
      if (tokens) performStoreTokens(tokens);
    } catch (error) {
      console.log('Could not store tokens to localStorage', error);
    }
  } catch (error) {
    console.error('Could not perform login', error);
    dispatch({ type: TYPES.LOGIN_ERROR });
  }
};

export const doReset = () => {
  performClearStorage();
  return {
    type: TYPES.RESET,
  };
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
