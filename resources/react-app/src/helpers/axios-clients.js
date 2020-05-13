import axios from 'axios';
import get from 'lodash/get';

const BASE_URL = `${process.env.REACT_APP_API_PATH}`;

const token = document.head.querySelector('meta[name="csrf-token"]');
if (!token) {
  console.error(
    'CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token'
  );
}

const client = axios.create({
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': token.content,
  },
  withCredentials: true,
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
