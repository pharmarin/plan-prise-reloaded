export const updateLine = (newState, action) => {
  let { id, child, multiple, parent, readOnly } = action.input
  let { type, value } = action.action
  let { lineId } = action
  let { customData, loadedData } = newState

  if (type === 'data') {
    _.set(loadedData, lineId, _.merge(_.get(loadedData, lineId, {}), value))
    return {
      ...newState,
      loadedData: loadedData
    }
  }
  if (readOnly) return newState
  if (multiple === true) {
    let currentState = _.get(customData, `${lineId}.${parent}`, {})
    if (type === "value") {
      _.set(currentState, `${id}.${child}`, value)
    } else if (type === "check") {
      _.set(currentState, `${id}.checked`, value)
      console.log('check', currentState)
    } else if (type === "choose") {
      _.set(currentState, `${id}`, value)
    } else if (type === "create") {
      _.set(currentState, `${id}.${child}`, value)
      _.set(currentState, `${id}.checked`, true)
    }
    _.set(customData, `${lineId}.${parent}`, currentState)
  } else {
    _.set(customData, `${lineId}.${parent}`, value)
  }

  return {
    ...newState,
    customData: customData
  }
}

export const update = (newState, action) => {
  let { type, value } = action.action
  let content, customContent
  switch (type) {
    case "add":
      content = _.uniqBy(_.concat(newState.content, value), 'id')
      return {
        ...newState,
        content: content
      }
    case "remove":
      content = _.filter(newState.content, (medicament) => medicament.id != value)
      customContent = _.omit(newState.customData, value)
      return {
        ...newState,
        content: content,
        customData: customContent
      }
    default:
      console.log(action)
      throw 'No action type'
  }
}
