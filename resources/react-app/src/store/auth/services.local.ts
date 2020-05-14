import jwt from 'jsonwebtoken';
import get from 'lodash/get';
import { Tokens } from 'store/auth/types';

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
