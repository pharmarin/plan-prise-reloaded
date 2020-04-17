import { TYPES } from './actions';
import {
  addDetailsToState
} from './services.local'
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
      return addDetailsToState(newState, action.details)
    }
    case TYPES.SET_STATUS:
      const key = _.findIndex(newState.data, item => item.id === action.medicament.id && item.type === action.medicament.type)
      if (key === -1) {
        newState.data.push({
          ...newState.empty,
          state: {
            ...newState.empty.state,
            [action.status]: action.value
          },
          ...action.medicament
        })
        return newState
      }
      return _.set(newState, `data.${key}.state.${action.status}`, action.value)
    default: return newState
  }
}

export default dataReducer
