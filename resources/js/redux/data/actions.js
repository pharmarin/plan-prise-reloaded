import axiosWithToken from '@helpers/axios-clients';

export const TYPES = {
  CACHE_DETAILS: 'CACHE_DETAILS',
  LOAD_DETAILS: 'LOAD_DETAILS',
  SET_STATUS: 'SET_STATUS',
};

export const doCacheDetails = (details) => {
  return {
    type: TYPES.CACHE_DETAILS,
    details,
  };
};

export const doSetStatus = (medicament, status, value) => {
  return {
    type: TYPES.SET_STATUS,
    medicament,
    status,
    value,
  };
};

export const doLoad = (medicament) => async (dispatch) => {
  dispatch(doSetStatus(medicament, 'isLoading', true));
  return axiosWithToken()
    .post(window.php.routes.api.all.show, {
      id: medicament.id,
      type: medicament.type,
    })
    .then((response) => {
      if (!response.status === 200)
        throw new Error(response.statusText);
      dispatch(doCacheDetails(response.data));
      dispatch(doSetStatus(medicament, 'isLoading', false));
      return true;
    })
    .catch((error) => {
      console.log(error);
      return document.location.reload();
    });
};
