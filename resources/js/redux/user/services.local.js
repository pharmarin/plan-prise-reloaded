import jwt from 'jsonwebtoken';
import get from 'lodash/get';

const STORAGE_KEYS = {
  token: 'state.auth.token',
  user: 'state.auth.user',
};

const decodeToken = (token) => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken) return decodedToken.payload;
  return false;
};

export const getValue = (token, key) => {
  const payload = decodeToken(token);
  if (payload) return payload[key];
  return false;
};

export const performClearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  sessionStorage.removeItem(STORAGE_KEYS.user);
};

export const performStoreToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.token, JSON.stringify(token));
    return true;
  } catch (err) {
    return console.error('Error storing token', err);
  }
};

export const performStoreUser = (user) => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    return true;
  } catch (err) {
    return console.error('Error storing user', err);
  }
};

export const performRestoreToken = () => {
  try {
    const token =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.token)) ||
      undefined;
    return token;
  } catch (err) {
    return undefined;
  }
};

export const performRestoreUser = () => {
  try {
    const user =
      JSON.parse(sessionStorage.getItem(STORAGE_KEYS.user)) ||
      undefined;
    return user;
  } catch (err) {
    return undefined;
  }
};

export const performValidate = (token) => {
  if (!token) return false;

  const expirationTime = get(token, 'exp') * 1000; // PHP timestamp is in s
  const timeNow = new Date().getTime(); // JS timestamp is in ms

  if (expirationTime > timeNow) {
    // Si le token expire plus tard que maintenant
    return true;
  }

  return false;
};
