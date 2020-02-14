import axios from 'axios';
import * as TYPES from './types';

export const cacheDetails = (details) => {
  return {
    type: TYPES.CACHE_DETAILS,
    details
  }
}

export const setStatus = (medicament, status, value) => {
  return {
    type: TYPES.SET_STATUS,
    medicament,
    status,
    value
  }
}

export const load = (medicament) => async (dispatch, getState) => {
  dispatch(setStatus(medicament, 'isLoading', true))
  return await axios.post(window.php.routes.api.all.show, {
    id: medicament.id,
    type: medicament.type
  }, {
    headers: {
      Authorization: `Bearer ${window.php.routes.token}`
    }
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    dispatch(setStatus(medicament, 'isLoading', false))
    dispatch(cacheDetails(response.data))
    return true
  })
  .catch((error) => {
    console.log(error)
    return dispatch(setStatus(medicament, 'isLoading', false))
  })
}
