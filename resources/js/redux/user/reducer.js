import { TYPES } from './actions';
import _ from 'lodash';

const initialState = {
  status: null,
  token: null,
  user: null
}

const userReducer = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case TYPES.LOADING: 
      return {
        ...newState, 
        status: action.status
      }
    case TYPES.LOGIN:
      return {
        ...newState,
        token: action.token || newState.token,
        user: action.user || newState.user,
        status: action.status || null
      }
    case TYPES.LOGOUT: 
      return initialState
    default: return newState
  }
}

export default userReducer
