import { debounce, get } from 'lodash';
import axios from 'helpers/axios-clients';
import { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  setSettings,
  removeValue,
  setValue,
  removeItem,
  addItem,
} from 'store/plan-prise';
import { addNotification, removeNotification } from 'store/app';

const update = debounce(
  (
    id: number,
    data: { data: { type: string; value: any }[] },
    onStart?: () => void,
    callback?: () => void
  ) => {
    const url = `/plan-prise/${id}`;
    onStart && onStart();
    return axios
      .patch(url, data, { withCredentials: true })
      .then((response) => {
        if (!(response.status === 200)) throw new Error(response.statusText);
        callback && callback();
        return true;
      })
      .catch((error) => {
        console.log(error);
        callback && callback();
        return false;
      });
  },
  5000
);

const allowedActions = [
  addItem.type,
  removeItem.type,
  removeValue.type,
  setValue.type,
  setSettings.type,
];
const SAVING_NOTIFICATION_TYPE = 'saving';

const switchAction = (type: string) => {
  switch (type) {
    case removeValue.type:
    case setValue.type:
      return ['custom_data'];
    case setSettings.type:
      return ['custom_settings'];
    case addItem.type:
      return ['medic_data'];
    case removeItem.type:
      return ['medic_data', 'custom_data'];
    default:
      throw new Error('No action type provided');
  }
};

const saveToAPI = ({
  dispatch,
  getState,
}: MiddlewareAPI<Dispatch, ReduxState>) => (next: Dispatch) => (
  action: Action
) => {
  next(action);
  if (allowedActions.includes(action.type)) {
    const state = getState();
    const parameters = switchAction(action.type);

    update(
      get(state, 'planPrise.id'),
      {
        data: parameters.map((p) => ({
          type: p,
          value: get(state.planPrise.content, p),
        })),
      },
      () =>
        dispatch(
          addNotification({
            id: SAVING_NOTIFICATION_TYPE,
            header: 'Sauvegarde en cours...',
            icon: 'spinner',
          })
        ),
      () => dispatch(removeNotification(SAVING_NOTIFICATION_TYPE))
    );

    if (action.type === setSettings.type) {
      update.flush();
    }
  }
};

export default saveToAPI;
