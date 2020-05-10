import asyncTypes from '../../helpers/async-types';

export const TYPES = {
  ...asyncTypes('LOAD_USER'),
};

// eslint-disable-next-line import/prefer-default-export
export const doLoadUser = () => {
  return {
    type: 'LOAD_USER',
    payload: {
      request: {
        url: '/user',
      },
    },
    auth: true,
  };
};
