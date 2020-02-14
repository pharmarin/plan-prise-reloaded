import {
  applyMiddleware,
  createStore,
  combineReducers,
  compose
} from 'redux'
import thunk from 'redux-thunk';

import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';

const rootReducer = combineReducers({
  dataReducer,
  planPriseReducer
})

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const store = compose(applyMiddleware(...middlewares))(createStore)(rootReducer)

export default store
