import * as TYPES from './types';
import * as LOCAL_SERVICES from '../../redux/user/services.local';

export const login = (credentials) => {
  LOCAL_SERVICES.storeToken(credentials.token)
  return {
    type: TYPES.LOGIN,
    token: credentials.token
  }
}

export const logout = () => {
  return {
    type: TYPES.LOGOUT
  }
}

export const restoreToken = () => (dispatch) => {
  let restored = LOCAL_SERVICES.restoreToken()
  if (restored) {
    dispatch(login({
      token: restored
    }))
  }
}