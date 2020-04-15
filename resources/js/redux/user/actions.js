import * as TYPES from './types';

export const login = (credentials) => {
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