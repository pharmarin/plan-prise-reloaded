import * as API_SERVICES from '../../redux/user/services.api';
import * as LOCAL_SERVICES from '../../redux/user/services.local';

export const TYPES = {
  LOADING: 'LOADING',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT'
}

export const login = (credentials) => {
  if (credentials.token) LOCAL_SERVICES.storeToken(credentials.token)
  if (credentials.user) LOCAL_SERVICES.storeUser(credentials.user)
  return {
    type: TYPES.LOGIN,
    token: credentials.token,
    user: credentials.user
  }
}

export const logout = () => {
  return {
    type: TYPES.LOGOUT
  }
}

export const restoreToken = () => (dispatch) => {
  let token = LOCAL_SERVICES.restoreToken()
  let user = LOCAL_SERVICES.restoreUser()
  if (token) {
    dispatch(login({
      token
    }))
    if (!user) {
      dispatch(restoreUser(token))
    }
  }
}

const restoreUser = (token) => (dispatch) => {
  API_SERVICES.info(token).then((user) => {
    console.log(user)
    if (user) {
      dispatch(login({
        user
      }))
    } else {
      dispatch(logout())
    }
  })
}