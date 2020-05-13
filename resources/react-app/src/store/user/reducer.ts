import cloneDeep from 'lodash/cloneDeep';
import { UserState, UserActions, LOAD_USER } from './types';
import { AxiosResponse } from 'helpers/async-types';
import get from 'lodash/get';

const initialState: UserState = {
  isError: false,
  isLoading: false,
  details: {},
};

type MergedActions = UserActions | AxiosResponse;

const userReducer = (
  state: UserState = initialState,
  action: MergedActions
): UserState => {
  const newState = cloneDeep(state);
  console.log(action);
  switch (action.type) {
    case LOAD_USER.start:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case LOAD_USER.success:
      if (get(action, 'payload.status') !== 200) return initialState;
      return {
        ...state,
        details: get(action, 'payload.data'),
        isLoading: false,
      };
    case LOAD_USER.error:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      return newState;
  }
};

export default userReducer;
