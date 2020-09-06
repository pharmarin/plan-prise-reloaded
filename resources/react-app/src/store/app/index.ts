import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ReduxState.App = {
  title: '',
  returnTo: {
    path: '/',
    label: '',
  },
  options: undefined,
  auth: { isLoading: false, isError: false, tokens: null },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateAppNav(
      state,
      action: PayloadAction<{
        title: string;
        returnTo?: { path: string; label: string };
        options?: { path: string; label: string }[];
      }>
    ) {
      const {
        payload: { options, returnTo, title },
      } = action;
      state.title = title;
      state.returnTo = returnTo;
      state.options = options;
    },
  },
});

export const { updateAppNav } = appSlice.actions;
export default appSlice.reducer;
