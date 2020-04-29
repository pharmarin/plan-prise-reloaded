import _ from 'lodash';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

import axiosWithToken from "../../helpers/axios.helper";

export const saveModification = _.debounce(async (pp_id, action, modifications, callback) => {
  let url = `${window.php.routes.api.planprise.update}/${pp_id}`
  if (_.get(window, 'planPrise.toast', null) === null) {
    _.set(window, 'planPrise.toast', toast.notify('Sauvegarde automatique', {
      duration: null,
      position: 'top-right'
    }))
  }
  return await axiosWithToken().put(url, {
    action: action,
    value: modifications
  })
  .then((response) => {
    if (window.planPrise.toast) {
      toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
    }
    window.planPrise.toast = null
    if (!response.status === 200) throw new Error(response.statusText)
    return callback ? callback(response.data.pp_id) : true
  })
  .catch((error) => {
    if (window.planPrise.toast) {
      toast.close(window.planPrise.toast.id, window.planPrise.toast.position)
    }
    window.planPrise.toast = null
    console.log(error)
  })
}, 5000)

export const loadList = async () => {
  return await axiosWithToken().get(window.php.routes.api.planprise.index)
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
    throw new Error(error)
  })
}

export const loadDetails = async (id) => {
  return await axiosWithToken().get(`${window.php.routes.api.planprise.index}/${id}`)
  .then((response) => {
    if (!response.status === 200) throw new Error(response.statusText)
    return response.data
  })
  .catch((error) => {
    console.log(error)
    throw new Error(error)
  })
}
