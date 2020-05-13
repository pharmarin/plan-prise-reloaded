import {
  applyMiddleware,
  compose,
  createStore,
  combineReducers,
  Middleware,
} from 'redux';
import axiosMiddleware from 'redux-axios-middleware';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import logger from 'redux-logger';

import axiosClient, { middlewareConfig } from 'helpers/axios-clients';
import authReducer from 'store/auth/reducer';
import dataReducer from 'store/data/reducer';
import planPriseReducer from 'store/plan-prise/reducer';
import userReducer from 'store/user/reducer';
import { AuthState } from './auth/types';
import { UserState } from './user/types';

export interface RootState {
  auth: AuthState;
  user: UserState;
  data: any;
  planPrise: any;
}

const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  planPrise: planPriseReducer,
  user: userReducer,
});

const middlewares: Middleware[] = [];

middlewares.push(thunk as ThunkMiddleware<RootState, any>);

if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

middlewares.push(axiosMiddleware(axiosClient, middlewareConfig));

export default compose(applyMiddleware(...middlewares))(createStore)(
  rootReducer
);
