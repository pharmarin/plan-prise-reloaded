import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from 'redux-logger';

import authReducer from 'store/auth/reducer';
import dataReducer from 'store/data/reducer';
import planPriseReducer from 'store/plan-prise/reducer';
import userReducer from 'store/user/reducer';
import { AuthState } from './auth/types';
import { UserState } from './user/types';
import concat from 'lodash/concat';

export interface RootState {
  auth: AuthState;
  data: any;
  planPrise: any;
  user: UserState;
}

export default configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    planPrise: planPriseReducer,
    user: userReducer,
  },
  middleware: concat(getDefaultMiddleware(), logger),
});
