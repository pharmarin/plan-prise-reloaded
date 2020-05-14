import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from 'redux-logger';
import concat from 'lodash/concat';

import authReducer from './auth/reducer';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';
import userReducer from './user/reducer';
import { AuthState } from './auth/types';
import { UserState } from './user/types';

export interface RootState {
  auth: AuthState;
  data: any;
  planPrise: any;
  user: UserState;
}

const rootReducer = combineReducers({
  auth: persistReducer(
    {
      key: 'auth',
      storage,
    },
    authReducer
  ),
  data: dataReducer,
  planPrise: planPriseReducer,
  user: userReducer,
});

let store = configureStore({
  reducer: rootReducer,
  middleware: concat(
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    logger
  ),
});
let persistor = persistStore(store);

export { store, persistor };
