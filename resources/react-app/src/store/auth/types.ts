import asyncTypes, {
  AsyncActionInterface,
  AsyncObjectType,
  ValueOf,
} from 'helpers/async-types';

export interface UserCredentials {
  username: string;
  password: string;
}

export interface Tokens {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthState {
  isError: boolean | string;
  isLoading: boolean;
  tokens: Tokens | null;
}

export const LOGIN: AsyncObjectType = asyncTypes('LOGIN');
type LOGIN_TYPE = ValueOf<typeof LOGIN>;
export const LOGOUT: AsyncObjectType = asyncTypes('LOGOUT');
type LOGOUT_TYPE = ValueOf<typeof LOGOUT>;
export const RESET = 'RESET';
type RESET_TYPE = string;
export const LOGIN_RESTORE = 'LOGIN_RESTORE';
type LOGIN_RESTORE_TYPE = string;

interface AuthLoginAction extends AsyncActionInterface {
  type: LOGIN_TYPE;
}

interface AuthRestoreTokensAction {
  type: LOGIN_RESTORE_TYPE;
  tokens: Tokens;
}

interface AuthLogoutAction extends AsyncActionInterface {
  type: LOGOUT_TYPE;
}

interface AuthResetAction {
  type: RESET_TYPE;
}

export type AuthActions =
  | AuthLoginAction
  | AuthLogoutAction
  | AuthRestoreTokensAction
  | AuthResetAction;
