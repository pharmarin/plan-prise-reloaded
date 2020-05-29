import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ReduxState.App = {
  title: '',
  return: null,
  auth: { isLoading: false, isError: false, tokens: null },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateAppNav(state, action) {
      const {
        payload: { title, return: returnObject },
      } = action;
      state.title = title;
      state.return = returnObject || null;
    },
  },
});

export const { updateAppNav } = appSlice.actions;
export default appSlice.reducer;
