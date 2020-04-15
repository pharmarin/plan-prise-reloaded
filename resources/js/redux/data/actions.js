import axios from 'axios';
import * as TYPES from './types';

import store from '../store';

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

export const load = (medicament) => async (dispatch) => {
  let token = store.getState().userReducer.token
  dispatch(setStatus(medicament, 'isLoading', true))
  return await axios.post(window.php.routes.api.all.show, {
    token,
    id: medicament.id,
    type: medicament.type
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    dispatch(cacheDetails(response.data))
    dispatch(setStatus(medicament, 'isLoading', false))
    return true
  })
  .catch((error) => {
    console.log(error)
    return document.location.reload()
  })
}
