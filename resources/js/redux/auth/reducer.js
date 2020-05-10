import cloneDeep from 'lodash/cloneDeep';
import startsWith from 'lodash/startsWith';

import { TYPES } from './actions';

const initialState = {
  isLoading: false,
  tokens: null,
};

const loginReducer = (newState, action) => {
  switch (action.type) {
    case TYPES.LOGIN:
      return {
        ...newState,
        isLoading: true,
      };
    case TYPES.LOGIN_SUCCESS:
      if (action.payload.status !== 200) return initialState;
      return {
        ...newState,
        tokens: action.payload.data,
        isLoading: false,
      };
    case TYPES.LOGIN_ERROR:
      return initialState;
    case TYPES.LOGIN_RESTORE:
      return {
        ...newState,
        tokens: action.tokens,
      };
    default:
      return initialState;
  }
};

const authReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  if (startsWith(action.type, 'LOGIN'))
    return loginReducer(newState, action);
  switch (action.type) {
    case TYPES.RESET:
      return initialState;
    default:
      return newState;
  }
};

export default authReducer;
