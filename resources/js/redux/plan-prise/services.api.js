import _ from 'lodash';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

export const saveModification = async (pp_id, action, modifications, callback) => {
  if (!window.planPrise) _.set(window, 'planPrise.apiCall', {})
  window.planPrise.apiCall.timeout && clearTimeout(window.planPrise.apiCall.timeout)
  if (_.get(window, 'planPrise.toast', null) === null) {
    window.planPrise.toast = toast.notify('Sauvegarde automatique', {
      duration: null,
      position: 'top-right'
    })
  }
  let url = action === 'add' ? window.php.routes.api.planprise.store : `${window.php.routes.api.planprise.update}/${pp_id}`
  let timeout = action === 'add' ? 0 : 1000
  
  window.planPrise.apiCall.timeout = setTimeout(async () => {
    return await axios({
      method: action === 'add' ? 'post' : 'put',
      url: url, 
      data: {
        token: window.php.routes.token,
        action: action,
        value: modifications
      }
    })
    .then((response) => {
      window.planPrise.toast = toast.close(window.planPrise.toast.id || null, window.planPrise.toast.position)
      if (!response.status === 200) throw new Error(response.statusText)
      console.log('response', response)
      return callback(response.data.pp_id)
    })
    .catch((error) => {
      toast.close(window.planPrise.toast.id || null, window.planPrise.toast.position)
      console.log(error)
    })
  }, timeout)
}

export const loadList = async () => {
  return await axios.get(window.php.routes.api.planprise.index, {
    params: {
      token: window.php.routes.token
    }
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
    return document.location.reload()
  })
}

export const loadDetails = async (id) => {
  return await axios.get(`${window.php.routes.api.planprise.index}/${id}`, {
    params: {
      token: window.php.routes.token
    }
  })
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
    return document.location.reload()
  })
}
