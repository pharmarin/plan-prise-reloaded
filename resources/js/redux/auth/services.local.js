import jwt from 'jsonwebtoken';

const STORAGE_KEYS = {
  tokens: 'state.auth.tokens',
};

const decodeToken = (token) => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken) return decodedToken.payload;
  return null;
};

export const getValue = (token, key) => {
  const payload = decodeToken(token);
  if (payload) return payload[key];
  return null;
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

export const performValidation = (tokens) => {
  if (!tokens) return false;

  const accessToken = tokens.access_token;
  const expirationTime = getValue(accessToken, 'exp') * 1000; // PHP timestamp in s
  const timeNow = new Date().getTime(); // JS timestamp in ms

  if (expirationTime > timeNow) {
    // Si le token expire plus tard que maintenant
    return true;
  }

  return false;
};
