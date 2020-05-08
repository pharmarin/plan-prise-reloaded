import isEmpty from 'lodash/isEmpty';
import { createSelector } from 'reselect';
import { performValidate } from './services.local';

const user = (state) => state.userReducer.user || {};
const tokens = (state) => state.userReducer.tokens;

const isAuth = createSelector(tokens, (t) => !isEmpty(t));

const isValid = createSelector(
  tokens,
  isAuth,
  (t, a) => a && performValidate(t.access_token || null),
);

const isAdmin = createSelector(
  user,
  isValid,
  (u, v) => v && u.admin === 1,
);

export default function userSelector(state) {
  return {
    details: user(state),
    isAuth: isAuth(state),
    isValid: isValid(state),
    isAdmin: isAdmin(state),
  };
}
