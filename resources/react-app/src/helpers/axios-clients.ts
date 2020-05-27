import axios from 'axios';

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
  },
  responseType: 'json',
});

export default client;
