import {
  info, 
  refresh as performRefresh
} from '../../redux/user/services.api';
import {
  clearStorage,
  restoreToken, 
  restoreUser,
  storeToken, 
  storeUser
} from '../../redux/user/services.local';
import userSelector from "../../redux/user/selector";

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
  let selector = userSelector({
    userReducer: {
      user: {
        token,
        details: user
      }
    }
  })
  if (token) {
    if (true) { //(!selector.isValid) {
      dispatch(refresh(token))
    } else {
      dispatch(login({
        token,
        user
      }))
      if (!user) {
        dispatch(fetch())
      }
    }
  }
}

const refresh = (token) => (dispatch) => {
  console.log(token)
  performRefresh(token).then((details) => console.log(details))
}

const fetch = () => (dispatch) => {
  info().then((user) => {
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