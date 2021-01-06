export type ValueOf<T> = T[keyof T];

const asyncTypes = (action: string): AsyncObjectType => ({
  start: `${action}`,
  success: `${action}_SUCCESS`,
  error: `${action}_FAIL`,
});

export type AsyncObjectType = {
  start: string;
  success: string;
  error: string;
};

export interface AsyncActionInterface {
  type: any;
  payload: {
    request: {
      data?: any;
      method?: 'POST' | 'GET' | 'DELETE' | 'PUT';
      params?: any;
      url: string;
    };
  };
  auth?: boolean;
}

export interface AxiosSuccess {
  type: string;
  payload: {
    status: number;
    data: any;
    headers?: any;
  };
  meta: {
    previousAction: any;
  };
}

export interface AxiosError {
  type: string;
  error: {
    status: number;
    message: string;
  };
  meta: {
    previousAction: any;
  };
}

export type AxiosResponse = AxiosSuccess | AxiosError;

export default asyncTypes;
