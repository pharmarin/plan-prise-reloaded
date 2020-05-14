import { AuthState, Tokens } from './types';
import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { doLogin, doLogout } from './actions';

const initialState: AuthState = {
  isError: false,
  isLoading: false,
  tokens: null,
};

export default createReducer(initialState, {
  [doLogin.pending.type]: (state) => {
    state.isLoading = true;
    state.isError = false;
  },
  [doLogin.fulfilled.type]: (state, action: PayloadAction<Tokens>) => {
    state.isLoading = false;
    state.tokens = action.payload;
  },
  [doLogin.rejected.type]: (state, action: PayloadAction<string | false>) => {
    state = {
      ...initialState,
      isError: action.payload,
    };
  },
  [doLogout.pending.type]: () => initialState,
  [doLogout.fulfilled.type]: () => initialState,
  [doLogout.rejected.type]: () => initialState,
});
