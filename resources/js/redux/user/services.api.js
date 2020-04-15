import axios from 'axios';

/**
 * 
 * @param {string} email Issu du formulaire de connexion
 * @param {string} password Issu du formulaire de connexion
 * 
 * @returns {}
 */
export const login = async (email, password) => {
  return await axios.post(window.php.routes.api.auth.login, {
    email,
    password
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response)
    return response.data
  })
  .catch((error) => {
    console.log(error)
    return false
  })
}