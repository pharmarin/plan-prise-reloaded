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

import appReducer, { AppState } from './app';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';
import userReducer, { UserState } from './user';

export interface RootState {
  app: AppState;
  data: any;
  planPrise: any;
  user: UserState;
}

const rootReducer = combineReducers({
  app: persistReducer(
    {
      key: 'auth',
      storage,
      whitelist: ['auth'],
    },
    appReducer
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
