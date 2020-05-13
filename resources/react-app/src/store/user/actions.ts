import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const doLoadUser = createAsyncThunk(
  'user/load',
  async () => await axios.get(`/api/v1/user`)
);
