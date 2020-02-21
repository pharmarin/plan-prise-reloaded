import _ from 'lodash';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

export const saveModification = async (pp_id, action, modifications) => {
  if (!window.planPrise) _.set(window, 'planPrise.apiCall', {})
  window.planPrise.apiCall.timeout && clearTimeout(window.planPrise.apiCall.timeout)
  if (_.get(window, 'planPrise.toast', null) === null) {
    window.planPrise.toast = toast.notify('Sauvegarde automatique', {
      duration: null,
      position: 'top-right'
    })
  }
  window.planPrise.apiCall.timeout = setTimeout(async () => {
    return await axios.put(`${window.php.routes.api.planprise.update}/${pp_id}`, {
      action: action,
      value: modifications
    }, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
    .then((response) => {
      window.planPrise.toast = toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
      if (!response.status === 200) throw new Error(response.statusText)
      return response.data.pp_id
    })
    .catch((error) => {
      toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
      console.log(error)
    })
  }, 1000)
}

export const loadList = async () => {
  return await axios.get(window.php.routes.api.planprise.index, {
    headers: {
      Authorization: `Bearer ${window.php.routes.token}`
    }
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
  })
}

export const loadDetails = async (id) => {
  return await axios.get(`${window.php.routes.api.planprise.index}/${id}`, {
    headers: {
      Authorization: `Bearer ${window.php.routes.token}`
    }
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
  })
}
