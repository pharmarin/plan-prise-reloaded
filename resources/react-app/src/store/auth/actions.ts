import get from 'lodash/get';
import axios from 'axios';
import {
  performClearStorage,
  performRestoreTokens,
  performStoreTokens,
} from 'store/auth/services.local';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

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
    const source = axios.CancelToken.source();
    signal.addEventListener('abort', () => {
      source.cancel();
    });
    try {
      const response = await axios.post(
        `/api/v1/oauth/token`,
        { ...loginForm, ...clientCredentials },
        {
          cancelToken: source.token,
        }
      );
      try {
        if (response.status !== 200)
          throw new Error('User could not be logged in. ');
        const tokens = get(response, 'data');
        performStoreTokens(tokens);
      } catch (error) {
        console.log('Could not store tokens to localStorage', error);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const doLogout = createAsyncThunk('auth/logout', async () => {
  performClearStorage();
  await axios.delete(`/api/v1/oauth/token`);
});

export const doRestore = createAction('auth/restore', () => {
  const tokens = performRestoreTokens();
  return {
    payload: tokens || null,
  };
});
