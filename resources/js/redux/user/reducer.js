import * as TYPES from './types';
import _ from 'lodash';

const initialState = {
  status: null,
  name: null,
  mail: null,
  token: null
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
        token: action.token,
        name: action.name,
        mail: action.mail,
        status: null
      }
    case TYPES.LOGOUT: 
      return initialState
    default: return newState
  }
}

export default userReducer
