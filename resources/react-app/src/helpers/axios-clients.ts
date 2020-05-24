import axios from 'axios';
import get from 'lodash/get';
import { store } from 'store/store';

const BASE_URL = `${process.env.REACT_APP_API_PATH}`;

const token = document.head.querySelector('meta[name="csrf-token"]');
if (!token) {
  throw new Error(
    'CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token'
  );
}

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': token.getAttribute('content'),
  },
  responseType: 'json',
});

client.interceptors.request.use((config) => {
  if (config.withCredentials === true) {
    const token = get(store.getState(), 'app.auth.tokens.access_token');
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
