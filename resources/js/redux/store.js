import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './user/reducer';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';

const logger = process.env.APP_DEBUG
  ? require('redux-logger')
  : false;

const rootReducer = combineReducers({
  userReducer,
  dataReducer,
  planPriseReducer,
});

const middlewares = [thunk];

if (logger) {
  middlewares.push(logger);
}

console.log(middlewares, process.env);

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(...middlewares),
);

export default store;
