import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import uniqueId from 'lodash/uniqueId';
import { TYPES } from './actions';
import { update, updateLine } from './services.local';

const initialState = {
  content: null,
  customData: null,
  isLoading: {
    state: false,
    message: '',
  },
  list: null,
  pp_id: null,
  settings: null,
};

const planPriseReducer = (state = initialState, action) => {
  const newState = cloneDeep(state);
  switch (action.type) {
    case TYPES.SET_LOADING:
      return {
        ...newState,
        isLoading: action.values,
      };
    case TYPES.INIT:
      return {
        ...newState,
        pp_id: action.id,
      };
    case TYPES.LOAD_DETAILS: {
      return {
        ...newState,
        ...action.values,
      };
    }
    case TYPES.RESET:
      return {
        ...initialState,
        list: newState.list,
      };
    case TYPES.UPDATE_LINE:
      return updateLine(newState, action);
    case TYPES.UPDATE:
      return update(newState, action);
    case TYPES.LOAD_RESULT:
      return newState;
    case TYPES.UPDATE_SETTINGS: {
      const { parent, id } = action.input;
      if (action.value.action === 'check') {
        set(
          newState,
          `settings.${parent}.${id}.checked`,
          action.value.value,
        );
      }
      return newState;
    }
    case TYPES.LOAD_LIST:
      return {
        ...newState,
        list: action.list,
      };
    case TYPES.ADD_CUSTOM_ITEM:
      set(
        newState,
        `customData.${action.lineId}.custom_${
          action.input
        }.${uniqueId(`custom_${action.input}_`)}`,
        {
          checked: true,
          [`custom_${action.input}`]: '',
        },
      );
      return newState;
    default:
      return newState;
  }
};

export default planPriseReducer;
