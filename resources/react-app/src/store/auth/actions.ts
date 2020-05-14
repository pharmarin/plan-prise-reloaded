import axios from 'helpers/axios-clients';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { persistor } from 'store/store';

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

export const doLogin = createAsyncThunk(
  'auth/login',
  async (
    loginForm: { username: string; password: string },
    { rejectWithValue, signal }
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

export const doLogout = createAsyncThunk('auth/logout', async () => {
  await axios.delete(`/oauth/token`, { withCredentials: true });
  await persistor.purge();
});
