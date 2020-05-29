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

import appReducer from './app';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise';

const rootReducer = combineReducers({
  app: appReducer,
  data: persistReducer({ key: 'cached_data', storage }, dataReducer),
  planPrise: planPriseReducer,
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
