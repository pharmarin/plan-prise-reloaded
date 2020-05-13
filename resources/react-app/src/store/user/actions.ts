import { LOAD_USER, UserActions } from './types';

export const doLoadUser = (): UserActions => {
  return {
    type: LOAD_USER.start,
    payload: {
      request: {
        url: '/user',
      },
    },
    auth: true,
  };
};
