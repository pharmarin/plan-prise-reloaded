import axiosStatic, { AxiosRequestConfig } from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_PATH}`;

const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
  withCredentials: true,
};

const axios = axiosStatic.create(config);

export default axios;
