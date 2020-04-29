import axiosWithToken from "../../helpers/axios.helper";

export const TYPES = {
  CACHE_DETAILS: 'CACHE_DETAILS',
  LOAD_DETAILS: 'LOAD_DETAILS',
  SET_STATUS: 'SET_STATUS'
}

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
  dispatch(setStatus(medicament, 'isLoading', true))
  return await axiosWithToken().post(window.php.routes.api.all.show, {
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
