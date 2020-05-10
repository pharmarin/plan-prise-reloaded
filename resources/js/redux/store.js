import {
  applyMiddleware,
  compose,
  createStore,
  combineReducers,
} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import axiosClient, {
  middlewareConfig,
} from '@helpers/axios-clients';
import authReducer from '@redux/auth/reducer';
import dataReducer from '@redux/data/reducer';
import planPriseReducer from '@redux/plan-prise/reducer';
import userReducer from '@redux/user/reducer';

const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  planPrise: planPriseReducer,
  user: userReducer,
});

const middlewares = [];

middlewares.push(thunk);

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

middlewares.push(axiosMiddleware(axiosClient, middlewareConfig));

const store = compose(applyMiddleware(...middlewares))(createStore)(
  rootReducer,
);

export default store;
