import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';

type User = {
  name?: string;
  display_name?: string;
  email?: string;
};

type UserState = {
  isError: boolean;
  isLoading: boolean;
  details: User;
};

const initialState: UserState = {
  isError: false,
  isLoading: false,
  details: {},
};

const loadUser = createAsyncThunk('user/load', async () => {
  const response = await axios.get(`/user`, { withCredentials: true });
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    [loadUser.pending.type]: (state) => ({
      ...initialState,
      isLoading: true,
    }),
    [loadUser.fulfilled.type]: (state, action: PayloadAction<User>) => ({
      ...state,
      isLoading: false,
      details: action.payload,
    }),
    [loadUser.rejected.type]: (state) => ({
      ...state,
      isLoading: false,
      isError: true,
    }),
  },
});

export { loadUser };
export type { User, UserState };
export default userSlice.reducer;
