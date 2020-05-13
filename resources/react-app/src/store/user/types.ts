import asyncTypes, {
  AsyncActionInterface,
  AsyncObjectType,
  ValueOf,
} from 'helpers/async-types';

export type UserState = {
  isError: boolean;
  isLoading: boolean;
  details: {
    name?: string;
    display_name?: string;
    email?: string;
  };
};

export const LOAD_USER: AsyncObjectType = asyncTypes('LOAD_USER');
type LOAD_USER_TYPE = ValueOf<typeof LOAD_USER>;

interface LoadUserAction extends AsyncActionInterface {
  type: LOAD_USER_TYPE;
}

export type UserActions = LoadUserAction;
