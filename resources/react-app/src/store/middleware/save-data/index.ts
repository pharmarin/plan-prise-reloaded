import { debounce, get } from 'lodash';
import axios from 'helpers/axios-clients';
import { MiddlewareAPI, Dispatch, Action } from 'redux';
import { setSettings, removeValue, setValue } from 'store/plan-prise';

const update = debounce((id: number, data: { action: string; value: any }) => {
  const url = `/plan-prise/${id}`;
  return axios
    .patch(url, data, { withCredentials: true })
    .then((response) => {
      if (!(response.status === 200)) throw new Error(response.statusText);
      return true;
    })
    .catch((error) => {
      console.log(error);
      return false;
    });
}, 5000);

const saveToAPI = (store: MiddlewareAPI<Dispatch, ReduxState>) => (
  next: Dispatch
) => (action: Action) => {
  next(action);
  if (action.type === removeValue.type || action.type === setValue.type) {
    const state = store.getState();
    update(get(state, 'planPrise.id'), {
      action: 'edit',
      value: get(state, 'planPrise.content.custom_data'),
    });
  }
  if (action.type === setSettings.type) {
    const state = store.getState();
    update(get(state, 'planPrise.id'), {
      action: 'settings',
      value: get(state, 'planPrise.content.custom_settings'),
    });
  }
};

export default saveToAPI;
