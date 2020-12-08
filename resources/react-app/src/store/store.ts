import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { reducer as jsonApi, setAxiosConfig } from 'redux-json-api';
import logger from 'redux-logger';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appReducer from 'store/app';
import cacheReducer from 'store/cache';
import saveToAPI from 'store/middleware/save-data';
import planPriseReducer from 'store/plan-prise';

const rootReducer = combineReducers({
  app: appReducer,
  api: jsonApi,
  cache: persistReducer({ key: 'pp_cache', storage }, cacheReducer),
  planPrise: planPriseReducer,
});

let store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(logger, saveToAPI),
});

let persistor = persistStore(store);

store.dispatch(
  setAxiosConfig({
    baseUrl: 'http://localhost:3000/api/v1',
  })
);

export { store, persistor };
