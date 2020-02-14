import _ from 'lodash';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

export const saveModification = async (currentID, action, modifications) => {
  if (!window.planPrise) _.set(window, 'planPrise.apiCall', {})
  window.planPrise.apiCall.timeout && clearTimeout(window.planPrise.apiCall.timeout)
  window.planPrise.toast = toast.notify('Sauvegarde automatique', {
    duration: null,
    position: 'top-right'
  })
  window.planPrise.apiCall.timeout = setTimeout(async () => {
    return await axios.put(`${window.php.routes.api.planprise.update}/${currentID}`, {
      action: action,
      value: modifications
    }, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
      .then((response) => {
        console.log('close', window.planPrise.toast)
        toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
        if (!response.status === 200) throw new Error(response.statusText)
        return response.data.pp_id
      })
      .catch((error) => {
        toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
        console.log(error)
      })
  }, 1000)
}
