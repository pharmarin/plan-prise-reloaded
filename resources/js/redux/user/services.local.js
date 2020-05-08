import jwt from 'jsonwebtoken';

const STORAGE_KEYS = {
  tokens: 'state.auth.tokens',
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
  localStorage.removeItem(STORAGE_KEYS.tokens);
  sessionStorage.removeItem(STORAGE_KEYS.user);
};

export const performStoreTokens = (tokens) => {
  try {
    localStorage.setItem(STORAGE_KEYS.tokens, JSON.stringify(tokens));
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

export const performRestoreTokens = () => {
  try {
    const token =
      JSON.parse(localStorage.getItem(STORAGE_KEYS.tokens)) ||
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

  const expirationTime = getValue(token, 'exp') * 1000; // PHP timestamp is in s
  const timeNow = new Date().getTime(); // JS timestamp is in ms

  if (expirationTime > timeNow) {
    // Si le token expire plus tard que maintenant
    return true;
  }

  return false;
};
