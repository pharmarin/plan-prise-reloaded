import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import isArray from 'lodash/isArray';

const loadList = createAsyncThunk('planPrise/loadList', async () => {
  const response = await axios.get('/plan-prise');
  return response.data;
});

const loadContent = createAsyncThunk(
  'planPrise/loadContent',
  async (id: number) => {
    const response = await axios.get(`/plan-prise/${id}`);
    return response.data;
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

export const { setId } = ppSlice.actions;
export { loadContent, loadList };
export default ppSlice.reducer;