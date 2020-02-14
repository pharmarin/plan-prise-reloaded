import * as TYPES from './types';
import * as SERVICES from './services.local';
import _ from 'lodash';

const initialState = {
  currentID: null,
  currentContent: [],
  currentCustomData: {},
  currentSettings: {}
}

const planPriseReducer = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case TYPES.SET_DEFAULTS:
      return {
        ...newState,
        ...action.values
      }
    case TYPES.INIT:
      return {
        ...newState,
        currentID: action.id
      }
    case TYPES.RESET:
      return initialState
    case TYPES.UPDATE_LINE:
      return SERVICES.updateLine(newState, action)
    case TYPES.UPDATE:
      return SERVICES.update(newState, action)
    case TYPES.LOAD_RESULT:
      return newState
    case TYPES.UPDATE_SETTINGS:
      let { parent, id } = action.input
      if (action.value.action === "check") {
        _.set(newState, `currentSettings.${parent}.${id}.checked`, action.value.value)
      }
      return newState
    default: return newState
  }
}

export default planPriseReducer
