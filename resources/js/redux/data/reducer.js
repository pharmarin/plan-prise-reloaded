import * as TYPES from './types';
import * as LOCAL_SERVICES from './services.local'
import _ from 'lodash';

const initialState = {
  empty: {
    state: {
      isLoading: false
    },
    data: null
  },
  data: []
}

const dataReducer = (state = initialState, action) => {
  const newState = _.cloneDeep(state)
  switch (action.type) {
    case TYPES.CACHE_DETAILS: {
      return LOCAL_SERVICES.addDetailsToState(newState, action.details)
    }
    case TYPES.SET_STATUS:
      const key = _.findIndex(newState.data, item => item.id === action.medicament.id && item.type === action.medicament.type)
      if (key === -1) {
        newState.data.push({
          ...newState.empty,
          ...action.medicament
        })
      }
      return _.set(newState, `data.${key}.state.${action.status}`, action.value)
    default: return newState
  }
}

export default dataReducer
