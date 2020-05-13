import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const doLoadUser = createAsyncThunk(
  'user/load',
  async (arg, { dispatch }) => {
    try {
      await axios.post(`/api/v1/user`);
    } catch (error) {}
  }
);
