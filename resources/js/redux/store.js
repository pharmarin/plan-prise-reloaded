import {
  applyMiddleware,
  createStore,
  combineReducers,
  compose
} from 'redux'
import thunk from 'redux-thunk';

import userReducer from './user/reducer';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';

const rootReducer = combineReducers({
  userReducer,
  dataReducer,
  planPriseReducer
})

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const store = createStore(rootReducer, {}, applyMiddleware(...middlewares))

export default store
