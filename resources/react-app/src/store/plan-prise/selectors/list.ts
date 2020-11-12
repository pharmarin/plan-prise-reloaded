import { createSelector } from '@reduxjs/toolkit';

const selectListStatus = (state: Redux.State) => state.planPrise.list.status;

export const selectListState = createSelector(
  [selectListStatus],
  (listStatus) => {
    return {
      isLoaded: listStatus === 'loaded',
      isLoading: listStatus === 'loading',
      isNotLoaded: listStatus === 'not-loaded',
    };
  }
);
