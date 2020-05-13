import { UserState, User } from './types';
import { createReducer, PayloadAction } from '@reduxjs/toolkit';
import { doLoadUser } from './actions';

const initialState: UserState = {
  isError: false,
  isLoading: false,
  details: {},
};

export default createReducer(initialState, {
  [doLoadUser.pending.type]: (state) => {
    state.isLoading = true;
    state.isError = false;
  },
  [doLoadUser.fulfilled.type]: (state, action: PayloadAction<User>) => {
    state.isLoading = false;
    state.details = action.payload;
  },
  [doLoadUser.rejected.type]: (state) => {
    state.isLoading = false;
    state.isError = true;
  },
});
