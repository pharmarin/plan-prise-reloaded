import debounce from 'lodash/debounce';
import get from 'lodash/get';
import set from 'lodash/set';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

import axios from 'helpers/axios-clients';

export const performSaveModification = () => {
  debounce(async (ppId, action, modifications, callback) => {
    const url = `${window.php.routes.api.planprise.update}/${ppId}`;
    if (get(window, 'planPrise.toast', null) === null) {
      set(
        window,
        'planPrise.toast',
        toast.notify('Sauvegarde automatique', {
          duration: null,
          position: 'top-right',
        })
      );
    }
    return axios
      .put(
        url,
        {
          action,
          value: modifications,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (window.planPrise.toast) {
          toast.close(
            window.planPrise.toast.id,
            window.planPrise.toast.position
          );
        }
        window.planPrise.toast = null;
        if (!response.status === 200) throw new Error(response.statusText);
        return callback ? callback(response.data.pp_id) : true;
      })
      .catch((error) => {
        if (window.planPrise.toast) {
          toast.close(
            window.planPrise.toast.id,
            window.planPrise.toast.position
          );
        }
        window.planPrise.toast = null;
        console.log(error);
      });
  }, 5000);
};

export const performLoadList = async () => {
  return axios
    .get('/plan-prise', { withCredentials: true })
    .then((response) => {
      if (!response.status === 200) throw new Error(response.statusText);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
};

export const performLoadDetails = async (id) => {
  return axios
    .get(`/plan-prise/${id}`, { withCredentials: true })
    .then((response) => {
      if (!response.status === 200) throw new Error(response.statusText);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      throw new Error(error);
    });
};
