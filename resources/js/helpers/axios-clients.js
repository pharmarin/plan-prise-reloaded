import axios from 'axios';
import env from '@root/env.json';
import get from 'lodash/get';

const BASE_URL = `http://${env.BASE_URL}${env.API_PATH}`;

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default client;

export const middlewareConfig = {
  interceptors: {
    request: [
      ({ getState, getSourceAction }, request) => {
        const needAuth = get(getSourceAction(request), 'auth');
        if (needAuth) {
          const token = get(getState(), 'auth.tokens.access_token');
          request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
      },
    ],
  },
};
