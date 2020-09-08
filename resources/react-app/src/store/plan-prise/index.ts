import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import set from 'lodash/set';
import { cache } from 'store/cache';
import CatchableError from 'helpers/catchable-error';
import { unset } from 'lodash';

const loadList = createAsyncThunk('planPrise/loadList', async () => {
  const response = await axios.get('/plan-prise');
  return map(response.data.data, (pp: any) => pp.attributes['pp-id']);
});

const loadContent = createAsyncThunk(
  'planPrise/loadContent',
  async (id: number, { dispatch, getState }) => {
    const response = await axios.get(`/plan-prise/${id}?include=medicaments`);
    const cachedMedicaments = (getState() as ReduxState).cache.medicaments;
    forEach(get(response, 'data.included', []), (medicament) => {
      const isInStore = find(cachedMedicaments, {
        type: medicament.type,
        id: medicament.id,
      });
      if (!isInStore) {
        dispatch(cache(medicament));
      }
    });
    const data = response.data.data;
    return {
      id: Number(data.attributes['pp-id']),
      medic_data: data.relationships.medicaments.data,
      custom_data: data.attributes['custom-data'],
      custom_settings: data.attributes['custom-settings'],
    };
  }
);

const initialState: ReduxState.PlanPrise = {
  id: null,
  list: null,
  content: null,
};

const checkLoaded = (state: ReduxState.PlanPrise) => {
  if (
    state.content === null ||
    state.content === 'error' ||
    state.content === 'loading'
  ) {
    throw new CatchableError(
      'Impossible de mettre à jour un plan de prise inexistant'
    );
  }
  return true;
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number | null>) => {
      return {
        ...initialState,
        id: action.payload ? action.payload : null,
        list: state.list,
      };
    },
    resetId: (state, action: PayloadAction<undefined>) => {
      return { ...initialState, list: state.list };
    },
    setSettings: (state, action: PayloadAction<{ id: string; value: any }>) => {
      if (checkLoaded(state))
        set(
          state,
          `content.custom_settings.${action.payload.id}`,
          action.payload.value
        );
    },
    setValue: (state, action: PayloadAction<{ id: string; value: any }>) => {
      if (checkLoaded(state))
        set(
          state,
          `content.custom_data.${action.payload.id}`,
          action.payload.value
        );
    },
    removeValue: (state, action: PayloadAction<{ id: string }>) => {
      if (checkLoaded(state))
        unset(state, `content.custom_data.${action.payload.id}`);
    },
  },
  extraReducers: {
    [loadList.pending.type]: (state) => {
      state.list = 'loading';
    },
    [loadList.rejected.type]: (state) => {
      state.list = 'error';
    },
    [loadList.fulfilled.type]: (state, action) => {
      if (isArray(action.payload)) {
        state.list = action.payload;
      } else {
        state.list = 'error';
      }
    },
    [loadContent.pending.type]: (state) => {
      state.content = 'loading';
    },
    [loadContent.rejected.type]: (state) => {
      state.content = 'error';
    },
    [loadContent.fulfilled.type]: (state, action) => {
      state.content = action.payload;
    },
  },
});

export const {
  removeValue,
  resetId,
  setId,
  setSettings,
  setValue,
} = ppSlice.actions;
export { loadContent, loadList };
export default ppSlice.reducer;
