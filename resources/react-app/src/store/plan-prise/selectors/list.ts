import { createSelector } from '@reduxjs/toolkit';
import { isArray } from 'lodash';

const selectList = (state: IRedux.State) => state.planPrise.list;

export const isLoaded = (
  content: IRedux.PlanPrise['list']
): content is { status: 'loaded'; data: IModels.PlanPrise['id'][] } => {
  if (content.status === 'loaded' && isArray(content.data)) {
    return true;
  }
  return false;
};

const isLoading = (
  content: IRedux.PlanPrise['list']
): content is { status: 'loading'; data: undefined } => {
  if (content.status === 'loading' && content.data === undefined) return true;
  return false;
};

const isNotLoaded = (
  content: IRedux.PlanPrise['list']
): content is { status: 'not-loaded'; data: undefined } => {
  if (content.status === 'not-loaded' && content.data === undefined)
    return true;
  return false;
};

export const selectListStatus = createSelector([selectList], (list) => {
  return {
    isLoaded: isLoaded(list),
    isLoading: isLoading(list),
    isNotLoaded: isNotLoaded(list),
  };
});
