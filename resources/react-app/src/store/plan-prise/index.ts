import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import find from 'lodash/find';
import { cache } from 'store/cache';
import { set } from 'lodash';
import CatchableError from 'helpers/catchable-error';

const loadList = createAsyncThunk('planPrise/loadList', async () => {
  const response = await axios.get('/plan-prise');
  return response.data;
});

const loadContent = createAsyncThunk(
  'planPrise/loadContent',
  async (id: number, { dispatch, getState }) => {
    const response = await axios.get(`/plan-prise/${id}`);
    const cachedMedicaments = (getState() as ReduxState).cache.medicaments;
    forEach(get(response, 'data.source', []), (medicament) => {
      const isInStore = find(cachedMedicaments, medicament);
      if (!isInStore) {
        dispatch(cache(medicament));
      }
    });
    return response.data.data;
  }
);

const initialState: ReduxState.PlanPrise = {
  id: null,
  list: null,
  content: null,
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number | null>) => {
      state.id = action.payload;
      state.content = null;
    },
    setValue: (state, action: PayloadAction<{ id: string; value: any }>) => {
      if (
        state.content === null ||
        state.content === 'error' ||
        state.content === 'loading'
      )
        throw new CatchableError(
          'Impossible de mettre à jour un plan de prise inexistant'
        );
      set(state.content.custom_data, action.payload.id, action.payload.value);
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

export const { setId, setValue } = ppSlice.actions;
export { loadContent, loadList };
export default ppSlice.reducer;
