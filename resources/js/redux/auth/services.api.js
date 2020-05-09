import axios from 'axios';
import axiosWithToken from '../../helpers/axios.helper';
import clientCredentials from '../../../../oauth2-client.json';

/**
 *
 * @param {string} email Issu du formulaire de connexion
 * @param {string} password Issu du formulaire de connexion
 *
 * @returns {}
 */
export const performLogin = async (email, password) => {
  return axios
    .post(window.php.routes.api.auth.login, {
      username: email,
      password,
      ...clientCredentials,
    })
    .then((response) => {
      if (!response.status === 200) throw new Error(response);
      return response.data;
    });
};

export const performLogout = async () => {
  return axiosWithToken()
    .post(window.php.routes.api.auth.logout)
    .then((response) => {
      if (!response.status === 200) throw new Error(response);
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};

export const performRefresh = async (token) => {
  console.log(token);
  return axiosWithToken({}, token)
    .post(window.php.routes.api.auth.refresh)
    .then((response) => {
      if (!response.status === 200) throw new Error(response);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
};
