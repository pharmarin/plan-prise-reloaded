import {
  info
} from '../../redux/user/services.api';
import {
  clearStorage,
  restoreToken, 
  restoreUser,
  storeToken, 
  storeUser
} from '../../redux/user/services.local';

export const TYPES = {
  LOADING: 'LOADING',
  LOGIN: 'LOGIN',
  RESET: 'RESET'
}

export const login = (credentials) => {
  if (credentials.token) storeToken(credentials.token)
  if (credentials.user) storeUser(credentials.user)
  return {
    type: TYPES.LOGIN,
    token: credentials.token,
    user: credentials.user
  }
}

export const reset = () => {
  clearStorage()
  return {
    type: TYPES.RESET
  }
}

export const restore = () => (dispatch) => {
  let token = restoreToken()
  let user = restoreUser()
  if (token) {
    dispatch(login({
      token, 
      user
    }))
    if (!user) {
      dispatch(fetch(token))
    }
  }
}

const fetch = (token) => (dispatch) => {
  info(token).then((user) => {
    console.log(user)
    if (user) {
      dispatch(login({
        user
      }))
    } else {
      dispatch(reset())
    }
  })
}