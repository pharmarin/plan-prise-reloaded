import * as TYPES from './types';
import * as API_SERVICES from './services.api';

export const setDefaults = (values) => {
  return {
    type: TYPES.SET_DEFAULTS,
    values
  }
}

export const reset = () => {
  return {
    type: TYPES.RESET
  }
}

export const init = (id) => {
  return {
    type: TYPES.INIT,
    id
  }
}

export const updateLine = (lineId, action, input = {}) => (dispatch, getState) => {
  dispatch(updateLineState(lineId, action, input))
  API_SERVICES.saveModification(getState().planPriseReducer.currentID, 'edit', getState().planPriseReducer.currentCustomData)
}

const updateLineState = (lineId, action, input = {}) => {
  return {
    type: TYPES.UPDATE_LINE,
    input,
    action,
    lineId
  }
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
  API_SERVICES.saveModification(getState().planPriseReducer.currentID, 'add', medicament).then((pp_id) => {
    if (getState().planPriseReducer.currentID === -1) dispatch(init(pp_id))
  })
}

export const removeLine = (id) => async (dispatch, getState) => {
  dispatch(update({
    type: 'remove',
    value: id
  }))
  API_SERVICES.saveModification(getState().planPriseReducer.currentID, 'remove', id)
}

export const updateSettings = (input, value) => async (dispatch, getState) => {
  dispatch(updateSettingsState(input, value))
  API_SERVICES.saveModification(getState().planPriseReducer.currentID, 'settings', getState().planPriseReducer.currentSettings)
}

const updateSettingsState = (input, value) => {
  return {
    type: TYPES.UPDATE_SETTINGS,
    input,
    value
  }
}
