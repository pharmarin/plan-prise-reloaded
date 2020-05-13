import cloneDeep from 'lodash/cloneDeep';
import startsWith from 'lodash/startsWith';

import { AuthState, AuthActions, LOGIN, LOGIN_RESTORE, RESET } from './types';
import { AxiosResponse } from 'helpers/async-types';
import get from 'lodash/get';

const initialState: AuthState = {
  isError: false,
  isLoading: false,
  tokens: null,
};

type MergedActions = AuthActions | AxiosResponse;

const loginReducer = (
  newState: AuthState,
  action: MergedActions
): AuthState => {
  switch (action.type) {
    case LOGIN.start:
      return {
        ...newState,
        isLoading: true,
        isError: false,
      };
    case LOGIN.success:
      if (get(action, 'payload.status') !== 200) return initialState;
      return {
        ...newState,
        tokens: get(action, 'payload.data'),
        isLoading: false,
      };
    case LOGIN.error:
      return { ...initialState, isError: get(action, 'error.data', true) };
    case LOGIN_RESTORE:
      return {
        ...newState,
        tokens: get(action, 'tokens'),
      };
    default:
      return initialState;
  }
};

const authReducer = (state = initialState, action: AuthActions): AuthState => {
  const newState = cloneDeep(state);
  if (startsWith(action.type, LOGIN.start))
    return loginReducer(newState, action);
  switch (action.type) {
    case RESET:
      return initialState;
    default:
      return newState;
  }
};

export default authReducer;
