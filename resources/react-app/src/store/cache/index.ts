import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ReduxState.Cache = {
  medicaments: [],
};

const cacheSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    cache(state, action: PayloadAction<Medicament>) {
      state.medicaments.push(action.payload);
    },
  },
});

export const { cache } = cacheSlice.actions;
export default cacheSlice.reducer;
