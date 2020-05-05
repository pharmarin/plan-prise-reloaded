import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';
import { getValue, performValidate } from './services.local';

const user = (state) => state.userReducer.user || {};
const token = (state) => state.userReducer.token;

const isAuth = createSelector(token, (t) => !isEmpty(t));

const isValid = createSelector(
  token,
  isAuth,
  (t, a) => a && performValidate(t),
);

const isAdmin = createSelector(
  token,
  isValid,
  (t, v) => v && getValue(t, 'admin'),
);

export default function userSelector(state) {
  return {
    details: user(state),
    isAuth: isAuth(state),
    isValid: isValid(state),
    isAdmin: isAdmin(state),
  };
}
