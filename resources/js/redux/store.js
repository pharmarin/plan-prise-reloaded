import {
  applyMiddleware,
  compose,
  createStore,
  combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import userReducer from './user/reducer';
import dataReducer from './data/reducer';
import planPriseReducer from './plan-prise/reducer';

const rootReducer = combineReducers({
  userReducer,
  dataReducer,
  planPriseReducer,
});

const middlewares = [];
middlewares.push(thunk);

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

const store = compose(applyMiddleware(...middlewares))(createStore)(
  rootReducer,
);

export default store;
