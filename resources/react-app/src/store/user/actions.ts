import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';

export const doLoadUser = createAsyncThunk('user/load', async () => {
  const response = await axios.get(`/user`, { withCredentials: true });
  return response.data;
});
