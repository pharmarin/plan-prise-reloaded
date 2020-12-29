import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
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
  cache: persistReducer({ key: 'pp_cache', storage }, cacheReducer),
  planPrise: planPriseReducer,
});

let store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat(saveToAPI),
});

let persistor = persistStore(store);

export { store, persistor };
