import axios from 'axios';
import defaults from 'lodash/defaults';
import get from 'lodash/get';
import replace from 'lodash/replace';

import store from '../redux/store';
import { doLogin, doReset } from '../redux/user/actions';

export default function axiosWithToken(
  options = {},
  defaultToken = null,
) {
  console.log(defaultToken);
  const token = defaultToken || store.getState().userReducer.token;
  const defaultOptions = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const instance = axios.create(defaults(defaultOptions, options));

  instance.interceptors.response.use(
    (response) => {
      let newToken = get(response, 'headers.authorization');
      newToken = replace(newToken, 'Bearer ', '');
      if (newToken) {
        console.info('Received new token', 'Storing the new token');
        store.dispatch(doLogin({ token: newToken }));
      }
      return response;
    },
    (error) => {
      switch (error.response.status) {
        case 401:
          store.dispatch(doReset());
          break;
        default:
          console.log(error.response);
      }
      return Promise.reject(error);
    },
  );

  return instance;
}
