import { createSlice } from '@reduxjs/toolkit';

const initialState: ReduxState.Data = {
  medicaments: [],
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    storeMedicament(state, action) {
      state.medicaments.push(action.payload);
    },
  },
});

export const { storeMedicament } = dataSlice.actions;
export default dataSlice.reducer;
