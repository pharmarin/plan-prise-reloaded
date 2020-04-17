import { createSelector } from "reselect";
import _ from "lodash";
import * as USER_LOCAL_SERVICES from "./services.local";

const user = state => state.userReducer.user || {}
const token = state => state.userReducer.token

const isAuth = createSelector(
  token,
  (token) => !_.isEmpty(token)
)

const isValid = createSelector(
  token, 
  isAuth,
  (token, isAuth) => isAuth && USER_LOCAL_SERVICES.isValid(token)
)

const isAdmin = createSelector(
  token,
  isValid, 
  (token, isValid) => isValid && USER_LOCAL_SERVICES.get(token, "admin")
)

export default function userSelector(state) {
  return {
    details: user(state),
    isAuth: isAuth(state),
    isValid: isValid(state),
    isAdmin: isAdmin(state)
  }
}