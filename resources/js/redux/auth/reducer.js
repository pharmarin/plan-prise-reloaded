import cloneDeep from 'lodash/cloneDeep';
import startsWith from 'lodash/startsWith';

import { TYPES } from './actions';

const initialState = {
  isLoading: false,
  tokens: null,
};

const loginReducer = (newState, action) => {
  switch (action.type) {
    case TYPES.LOGIN_START:
      return {
        ...newState,
        isLoading: true,
      };
    case TYPES.LOGIN_SUCCESS:
      return {
        ...newState,
        tokens: action.tokens || newState.tokens,
        status: action.status || null,
      };
    case TYPES.LOGIN_RESTORE:
      return {
        ...newState,
        tokens: action.tokens,
      };
    default:
      return newState;
  }
};

const authReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  if (startsWith(action.type, 'LOGIN_'))
    return loginReducer(newState, action);
  switch (action.type) {
    case TYPES.RESET:
      return initialState;
    default:
      return newState;
  }
};

export default authReducer;
