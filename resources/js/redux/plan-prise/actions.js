import {
  loadDetails,
  loadList as performLoadList,
  saveModification
} from './services.api';
import { TYPES as DATA_TYPES } from '../data/actions';

export const TYPES = {
  SET_DEFAULTS: 'SET_DEFAULTS',
  SET_LOADING: 'SET_LOADING',
  INIT: 'INIT',
  RESET: 'RESET',
  UPDATE: 'UPDATE',
  UPDATE_LINE: 'UPDATE_LINE',
  LOAD_LINE: 'LOAD_LINE', // thunk
  LOAD_RESULT: 'LOAD_RESULT',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  LOAD_LIST: 'LOAD_LIST',
  LOAD_DETAILS: 'LOAD_DETAILS',
  ADD_CUSTOM_ITEM: 'ADD_CUSTOM_ITEM'
}

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

export const init = (id, reload = true) => (dispatch) => {
  let startLoading = {
    state: true,
    message: "Chargement en cours... "
  }
  let stopLoading = {
    state: false, message: ""
  }
  if (!(_.toNumber(id) > 0)) {
    return dispatch({
      type: TYPES.INIT,
      id: -1
    })
  }
  dispatch({
    type: TYPES.SET_LOADING,
    values: startLoading
  })
  dispatch({
    type: TYPES.INIT,
    id
  })
  if (!reload) {
    return dispatch({
      type: TYPES.SET_LOADING,
      values: stopLoading
    })
  }
  loadDetails(id).then((details) => {
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
  saveModification(getState().planPriseReducer.pp_id, 'edit', getState().planPriseReducer.customData)
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

export const addLine = (medicament, history) => async (dispatch, getState) => {
  dispatch(update({
    type: 'add',
    value: medicament
  }))
  saveModification(getState().planPriseReducer.pp_id, 'add', medicament, (pp_id) => {
    if (getState().planPriseReducer.pp_id === -1) {
      dispatch(init(pp_id))
      history.push(`/plan-prise/${pp_id}`)
    }
  })
  API_SERVICES.saveModification.flush()
}

export const addCustomItem = (lineId, input) => {
  return {
    type: TYPES.ADD_CUSTOM_ITEM,
    input,
    lineId
  }
}

export const removeLine = (id) => async (dispatch, getState) => {
  dispatch(update({
    type: 'remove',
    value: id
  }))
  saveModification(getState().planPriseReducer.pp_id, 'remove', id)
  saveModification.flush()
}

export const updateSettings = (input, value) => async (dispatch, getState) => {
  dispatch({
    type: TYPES.UPDATE_SETTINGS,
    input,
    value
  })
  saveModification(getState().planPriseReducer.pp_id, 'settings', getState().planPriseReducer.settings)
}

export const loadList = () => async (dispatch) => {
  performLoadList().then((list) => {
    if (Array.isArray(list)) dispatch({
      type: TYPES.LOAD_LIST,
      list
    })
  })
}
