import compact from 'lodash/compact';
import concat from 'lodash/concat';
import get from 'lodash/get';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import reject from 'lodash/reject';
import set from 'lodash/set';
import uniqBy from 'lodash/uniqBy';

export const updateLine = (newState, action) => {
  const { id, child, multiple, parent, readOnly } = action.input;
  const { type, value } = action.action;
  const { lineId } = action;
  const { customData, loadedData } = newState;

  if (type === 'data') {
    set(
      loadedData,
      lineId,
      merge(get(loadedData, lineId, {}), value),
    );
    return {
      ...newState,
      loadedData,
    };
  }
  if (readOnly) return newState;
  if (multiple === true) {
    const currentState = get(customData, `${lineId}.${parent}`, {});
    if (type === 'value') {
      set(currentState, `${id}.${child}`, value);
    } else if (type === 'check') {
      set(currentState, `${id}.checked`, value);
      console.log('check', currentState);
    } else if (type === 'choose') {
      set(currentState, `${id}`, value);
    } else if (type === 'create') {
      set(currentState, `${id}.${child}`, value);
      set(currentState, `${id}.checked`, true);
    }
    set(customData, `${lineId}.${parent}`, currentState);
  } else {
    set(customData, `${lineId}.${parent}`, value);
  }

  return {
    ...newState,
    customData,
  };
};

export const update = (newState, action) => {
  const { type, value } = action.action;
  let content;
  let customContent;
  switch (type) {
    case 'add':
      content = uniqBy(concat(newState.content, value), 'id');
      return {
        ...newState,
        content: compact(content), // Remove falsey/null values
      };
    case 'remove':
      content = reject(newState.content, ['id', value]);
      customContent = omit(newState.customData, value);
      return {
        ...newState,
        content,
        customData: customContent,
      };
    default:
      console.log(action);
      throw Error('No action type');
  }
};
