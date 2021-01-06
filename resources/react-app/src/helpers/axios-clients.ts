import axiosStatic, { AxiosRequestConfig } from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_PATH}`;

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: undefined,
  withCredentials: true,
};

const axios = axiosStatic.create(config);

export default axios;
