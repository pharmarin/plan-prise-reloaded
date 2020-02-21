import * as TYPES from './types';
import * as API_SERVICES from './services.api';
import * as DATA_TYPES from '../data/types';

export const setLoading = (values) => {
  return {
    type: TYPES.SET_LOADING,
    values
  }
}

export const reset = (history) => {
  history.push('/plan-prise')
  return {
    type: TYPES.RESET
  }
}

export const init = (id) => (dispatch) => {
  let startLoading = {
    state: true,
    message: "Chargement en cours... "
  }
  let stopLoading = {
    state: false, message: ""
  }
  dispatch({
    type: TYPES.SET_LOADING,
    values: startLoading
  })
  dispatch({
    type: TYPES.INIT,
    id
  })
  API_SERVICES.loadDetails(id).then((details) => {
    dispatch({
      type: TYPES.LOAD_DETAILS,
      values: {
        content: details.medicaments.map((medicament) => ({
          id: medicament.value.id,
          denomination: medicament.value.denomination,
          type: medicament.type
        })),
        customData: details.custom_data || {},
        settings: details.custom_settings
      }
    })
    dispatch({
      type: DATA_TYPES.CACHE_DETAILS,
      details: details.medicaments
    })
    dispatch({
      type: TYPES.SET_LOADING,
      values: stopLoading
    })
  })
}

export const updateLine = (lineId, action, input = {}) => (dispatch, getState) => {
  dispatch({
    type: TYPES.UPDATE_LINE,
    input,
    action,
    lineId
  })
  API_SERVICES.saveModification(getState().planPriseReducer.pp_id, 'edit', getState().planPriseReducer.customData)
}

export const update = (action) => {
  return {
    type: TYPES.UPDATE,
    action
  }
}

export const loadResult = (medicament) => {
  return {
    type: TYPES.LOAD_RESULT,
    medicament
  }
}

export const addLine = (medicament) => async (dispatch, getState) => {
  dispatch(update({
    type: 'add',
    value: medicament
  }))
  API_SERVICES.saveModification(getState().planPriseReducer.pp_id, 'add', medicament).then((pp_id) => {
    if (getState().planPriseReducer.pp_id === -1) dispatch(init(pp_id))
  })
}

export const removeLine = (id) => async (dispatch, getState) => {
  dispatch(update({
    type: 'remove',
    value: id
  }))
  API_SERVICES.saveModification(getState().planPriseReducer.pp_id, 'remove', id)
}

export const updateSettings = (input, value) => async (dispatch, getState) => {
  dispatch({
    type: TYPES.UPDATE_SETTINGS,
    input,
    value
  })
  API_SERVICES.saveModification(getState().planPriseReducer.pp_id, 'settings', getState().planPriseReducer.settings)
}

export const loadList = () => async (dispatch, getState) => {
  API_SERVICES.loadList().then((list) => {
    if (Array.isArray(list)) dispatch({
      type: TYPES.LOAD_LIST,
      list
    })
  })
}
