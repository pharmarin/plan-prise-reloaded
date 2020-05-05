import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import set from 'lodash/set';
import { TYPES } from './actions';
import performAddDetailsToState from './services.local';

const initialState = {
  empty: {
    state: {
      isLoading: false,
    },
    data: null,
  },
  data: [],
};

const dataReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case TYPES.CACHE_DETAILS: {
      return performAddDetailsToState(newState, action.details);
    }
    case TYPES.SET_STATUS: {
      const key = findIndex(newState.data, {
        id: action.medicament.id,
        type: action.medicament.type,
      });
      if (key === -1) {
        newState.data.push({
          ...newState.empty,
          state: {
            ...newState.empty.state,
            [action.status]: action.value,
          },
          ...action.medicament,
        });
        return newState;
      }
      return set(
        newState,
        `data.${key}.state.${action.status}`,
        action.value,
      );
    }
    default:
      return newState;
  }
};

export default dataReducer;
