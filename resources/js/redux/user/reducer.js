import cloneDeep from 'lodash/cloneDeep';
import { TYPES } from './actions';

const initialState = {
  status: null,
  token: null,
  user: null,
};

const userReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case TYPES.LOADING:
      return {
        ...newState,
        status: action.status,
      };
    case TYPES.LOGIN:
      return {
        ...newState,
        token: action.token || newState.token,
        user: action.user || newState.user,
        status: action.status || null,
      };
    case TYPES.RESET:
      return initialState;
    default:
      return newState;
  }
};

export default userReducer;
