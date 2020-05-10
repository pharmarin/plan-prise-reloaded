import isArray from 'lodash/isArray';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';
import {
  performLoadDetails,
  performLoadList,
  performSaveModification,
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
  ADD_CUSTOM_ITEM: 'ADD_CUSTOM_ITEM',
};

export const doSetLoading = (values) => {
  return {
    type: TYPES.SET_LOADING,
    values,
  };
};

export const doReset = (history) => {
  history.push('/plan-prise');
  return {
    type: TYPES.RESET,
  };
};

export const doInit = (id, reload = true) => (dispatch) => {
  const startLoading = {
    state: true,
    message: 'Chargement en cours... ',
  };
  const stopLoading = {
    state: false,
    message: '',
  };
  if (!(toNumber(id) > 0)) {
    return dispatch({
      type: TYPES.INIT,
      id: -1,
    });
  }
  dispatch({
    type: TYPES.SET_LOADING,
    values: startLoading,
  });
  dispatch({
    type: TYPES.INIT,
    id,
  });
  if (!reload) {
    return dispatch({
      type: TYPES.SET_LOADING,
      values: stopLoading,
    });
  }
  performLoadDetails(id).then((details) => {
    dispatch({
      type: TYPES.LOAD_DETAILS,
      values: {
        content: map(details.medicaments, (medicament) => ({
          id: medicament.value.id,
          denomination: medicament.value.denomination,
          type: medicament.type,
        })),
        customData: details.custom_data || {},
        settings: details.custom_settings,
      },
    });
    dispatch({
      type: DATA_TYPES.CACHE_DETAILS,
      details: details.medicaments,
    });
    dispatch({
      type: TYPES.SET_LOADING,
      values: stopLoading,
    });
  });
  return true;
};

export const doUpdateLine = (lineId, action, input = {}) => (
  dispatch,
  getState,
) => {
  dispatch({
    type: TYPES.UPDATE_LINE,
    input,
    action,
    lineId,
  });
  performSaveModification(
    getState().planPrise.pp_id,
    'edit',
    getState().planPrise.customData,
  );
};

export const doUpdate = (action) => {
  return {
    type: TYPES.UPDATE,
    action,
  };
};

export const doLoadResult = (medicament) => {
  return {
    type: TYPES.LOAD_RESULT,
    medicament,
  };
};

export const doAddLine = (medicament, history) => async (
  dispatch,
  getState,
) => {
  dispatch(
    doUpdate({
      type: 'add',
      value: medicament,
    }),
  );
  performSaveModification(
    getState().planPrise.pp_id,
    'add',
    medicament,
    (ppId) => {
      if (getState().planPrise.ppId === -1) {
        dispatch(doInit(ppId));
        history.push(`/plan-prise/${ppId}`);
      }
    },
  );
  performSaveModification.flush();
};

export const doAddCustomItem = (lineId, input) => {
  return {
    type: TYPES.ADD_CUSTOM_ITEM,
    input,
    lineId,
  };
};

export const doRemoveLine = (id) => async (dispatch, getState) => {
  dispatch(
    doUpdate({
      type: 'remove',
      value: id,
    }),
  );
  performSaveModification(getState().planPrise.pp_id, 'remove', id);
  performSaveModification.flush();
};

export const doUpdateSettings = (input, value) => async (
  dispatch,
  getState,
) => {
  dispatch({
    type: TYPES.UPDATE_SETTINGS,
    input,
    value,
  });
  performSaveModification(
    getState().planPrise.pp_id,
    'settings',
    getState().planPrise.settings,
  );
};

export const doLoadList = () => async (dispatch) => {
  performLoadList().then((list) => {
    if (isArray(list))
      dispatch({
        type: TYPES.LOAD_LIST,
        list,
      });
  });
};
