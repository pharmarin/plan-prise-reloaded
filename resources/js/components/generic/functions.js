export async function getAPIFromCIS (cisArray, onSuccessCallback, onErrorCallback) {
  let route = document.head.querySelector('meta[name="medicament-api"]').getAttribute('content')
  try {
    await axios.post(route, {
      data: cisArray
    })
    .then((response) => {
      if (response.data.status === 'success') {
        onSuccessCallback(response.data.data)
      } else {
        onErrorCallback(response.data.data)
      }
      return true
    })
  } catch (error) {
    console.log(error)
    return true
  }
}

/*export async function getMedicamentFromCIS (cisArray, onSuccessCallback, onErrorCallback) {
  let route = document.head.querySelector('meta[name="medicament-custom"]').getAttribute('content')
  try {
    await axios.post(route, {
      data: cisArray
    })
    .then((response) => {
      if (response.data.status === 'success') {
        let jsonResponse = JSON.parse(response.data.data)
        onSuccessCallback(jsonResponse, response.data.deselect)
      } else {
        onErrorCallback(response.data.data, response.data.deselect)
      }
      return true
    })
  } catch (error) {
    console.log(error)
    return true
  }
}*/

export async function managePP (pp_id, pp_data, onSuccessCallback, onErrorCallback) {
  let route = document.head.querySelector('meta[name="plan-prise-api"]').getAttribute('content')
  try {
    await axios.post(route, {
      pp_id: pp_id,
      request: {
        action: pp_data.action,
        value: pp_data.value
      }
    })
    .then((response) => {
      if (response.data.status === 'success') {
        onSuccessCallback(response.data.data)
      } else {
        onErrorCallback(response.data.data)
      }
      return true
    })
  } catch (error) {
    console.log(error)
    return true
  }
}
