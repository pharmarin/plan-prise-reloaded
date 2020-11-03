import { debounce, fromPairs, get } from 'lodash';
import axios from 'helpers/axios-clients';
import { MiddlewareAPI, Dispatch, Action } from 'redux';
import {
  setSettings,
  removeValue,
  setValue,
  removeItem,
  addItem,
  setId,
} from 'store/plan-prise';
import { addNotification, removeNotification } from 'store/app';
import { requestUrl } from 'helpers/hooks/use-json-api';

const update = debounce(
  (
    id: string,
    data: { data: { id: string; type: string; attributes: any } },
    onStart?: () => void,
    callback?: (response: any) => void
  ) => {
    const url = requestUrl('plan-prises', { id }).url;

    onStart && onStart();

    return axios
      .patch(url, data, { withCredentials: true })
      .then((response) => {
        if (!(response.status === 200)) throw new Error(response.statusText);
        callback && callback(response.data);
        return true;
      })
      .catch((error) => {
        console.log(error);
        callback && callback(error.data);
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
      return ['medicaments'];
    case removeItem.type:
      return ['medicaments', 'custom_data'];
    default:
      throw new Error('No action type provided');
  }
};

const saveToAPI = ({
  dispatch,
  getState,
}: MiddlewareAPI<Dispatch, IRedux.State>) => (next: Dispatch) => (
  action: Action
) => {
  next(action);

  if (allowedActions.includes(action.type)) {
    const state = getState();

    const parameters = switchAction(action.type);

    const content = state.planPrise.content.data;

    if (!content?.id)
      throw new Error(
        'Impossible de mettre à jour un plan de prise inexistant'
      );

    update(
      content.id,
      {
        data: {
          id: content.id,
          type: content.type,
          attributes: fromPairs(
            parameters.map((p) => [p, get(state.planPrise.content.data, p)])
          ),
        },
      },
      () =>
        dispatch(
          addNotification({
            id: SAVING_NOTIFICATION_TYPE,
            header: 'Sauvegarde en cours...',
            icon: 'spinner',
          })
        ),
      (response) => {
        if (state.planPrise.id === -1 && response && response.id) {
          dispatch(setId(response.id));
        }
        dispatch(removeNotification(SAVING_NOTIFICATION_TYPE));
      }
    );

    if (
      action.type === setSettings.type ||
      action.type === addItem.type ||
      action.type === removeItem.type
    ) {
      update.flush();
    }
  }
};

export default saveToAPI;
