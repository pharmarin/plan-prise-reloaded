import jwt from 'jsonwebtoken';
import get from 'lodash/get';
import { Tokens } from 'store/auth/types';

const STORAGE_KEYS = {
  tokens: 'state.auth.tokens',
};

const decodeToken = (token: string): { [key: string]: any } | null => {
  const decodedToken = jwt.decode(token, { complete: true });
  if (decodedToken) return get(decodedToken, 'payload');
  return null;
};

export const getValue = (
  token: string,
  key: string
): string | number | null => {
  const payload = decodeToken(token);
  if (payload) return payload[key];
  return null;
};

export const performClearStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.tokens);
};

export const performStoreTokens = (tokens: Tokens) => {
  try {
    localStorage.setItem(STORAGE_KEYS.tokens, JSON.stringify(tokens));
    return true;
  } catch (err) {
    return console.error('Error storing token', err);
  }
};

export const performRestoreTokens = (): Tokens | undefined => {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.tokens);
    if (!json) throw new Error();
    const token = JSON.parse(json) || undefined;
    return token;
  } catch (err) {
    return undefined;
  }
};

export const performValidation = (tokens: Tokens) => {
  if (!tokens) return false;

  const accessToken = tokens.access_token;
  const expirationTime = getValue(accessToken, 'exp'); // PHP timestamp in s
  if (typeof expirationTime !== 'number')
    throw new Error('Expiration date should be a number. ');
  const timeNow = new Date().getTime(); // JS timestamp in ms

  if (expirationTime * 1000 > timeNow) {
    // Si le token expire plus tard que maintenant
    return true;
  }

  return false;
};
