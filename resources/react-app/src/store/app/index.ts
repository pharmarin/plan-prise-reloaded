import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import { persistor } from 'store/store';

type Tokens = {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

type AppState = {
  title: string;
  return: {
    label: string;
    path: string;
  } | null;
  auth: {
    isError: boolean | string;
    isLoading: boolean;
    tokens: Tokens | null;
  };
};

if (!process.env.REACT_APP_OAUTH_ID || !process.env.REACT_APP_OAUTH_SECRET)
  throw new Error(
    'Please add REACT_APP_OAUTH_ID and REACT_APP_OAUTH_SECRET to .env'
  );

const clientCredentials = {
  client_id: process.env.REACT_APP_OAUTH_ID,
  client_secret: process.env.REACT_APP_OAUTH_SECRET,
  grant_type: 'password',
  scope: '',
};

const login = createAsyncThunk(
  'auth/login',
  async (
    loginForm: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/oauth/token`, {
        ...loginForm,
        ...clientCredentials,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const logout = createAsyncThunk('auth/logout', async () => {
  await axios.delete(`/oauth/token`, { withCredentials: true });
  await persistor.purge();
});

const initialState: AppState = {
  title: '',
  return: null,
  auth: { isLoading: false, isError: false, tokens: null },
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    update(state, action) {
      const {
        payload: { title, return: returnObject },
      } = action;
      state.title = title;
      state.return = returnObject || null;
    },
  },
  extraReducers: {
    [login.pending.type]: (state) => {
      state.auth = {
        ...initialState.auth,
        isLoading: true,
      };
    },
    [login.fulfilled.type]: (state, action: PayloadAction<Tokens>) => {
      state.auth = {
        ...initialState.auth,
        tokens: action.payload,
      };
    },
    [login.rejected.type]: (state, action: PayloadAction<string | false>) => {
      state.auth = {
        ...initialState.auth,
        isError: action.payload,
      };
    },
    [logout.pending.type]: () => initialState,
    [logout.fulfilled.type]: () => initialState,
    [logout.rejected.type]: () => initialState,
  },
});

export const { update } = appSlice.actions;
export { login, logout };
export type { AppState, Tokens };
export default appSlice.reducer;
