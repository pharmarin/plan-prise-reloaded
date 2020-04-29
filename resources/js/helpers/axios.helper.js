import axios from "axios";
import _ from "lodash";

import store from "../redux/store";
import {
  login,
  reset
} from "../redux/user/actions";

export default function axiosWithToken (options = {}, defaultToken = null) {
console.log(defaultToken)
  let token = defaultToken ? defaultToken : store.getState().userReducer.token
  let defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const instance = axios.create(_.defaults(defaultOptions, options))

  instance.interceptors.response.use((response) => {
    let newToken = _.get(response, 'headers.authorization')
    newToken = _.replace(newToken, 'Bearer ', '')
    if (newToken) {
      console.info('Received new token', 'Storing the new token')
      store.dispatch(login({ token: newToken }))
    }
    return response
  }, function (error) {
    switch (error.response.status) {
      case 401:
        store.dispatch(reset())
        break
      default:
        console.log(error.response)
    }
    return Promise.reject(error)
  })

  return instance
}