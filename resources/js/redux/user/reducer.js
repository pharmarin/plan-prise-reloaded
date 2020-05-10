import cloneDeep from 'lodash/cloneDeep';

import { TYPES } from './actions';

const initialState = {
  isLoaded: false,
  details: {},
};

const userReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  console.log(action);
  switch (action.type) {
    case TYPES.LOAD_USER:
      return {
        ...state,
        isLoading: true,
      };
    case TYPES.LOAD_USER_SUCCESS:
      if (action.payload.status !== 200) return initialState;
      return {
        ...state,
        details: action.payload.data,
        isLoading: false,
      };
    case TYPES.LOAD_USER_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return newState;
  }
};

export default userReducer;
