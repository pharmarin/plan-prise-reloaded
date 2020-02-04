import React from 'react';
import Async from 'react-async';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import PPCard from './PPCard';
import SearchMedicament from '../generic/SearchMedicament';
import MESSAGES from '../messages.js';

const PPLogic = (props) => {
  const _handleAddLine = async (value) => {
    let medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type
    }
    let content = _.uniqBy(_.concat(props.currentContent, medicament), 'id')
    let needPush = content.length > props.currentContent.length
    if (!needPush) return null

    props.setCurrentContent(content)

    return await axios.post(window.php.routes.api.planprise.store, {
      id: props.currentID,
      value: value.value,
      type: value.type
    }, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
      .then((response) => {
        if (!response.status === 200) throw new Error(response.data.data)
        if (props.currentID === -1) props.setCurrentID(response.data.pp_id)
        return true
      })
      .catch((error) => this.props.alert.addAlert({
        header: "Erreur",
        body: error.response.data.data,
        delay: 3000
      })
      )
  }

  const _handleDeleteLine = (id, denomination = null) => {
    props.setCurrentContent(_.filter(state.currentContent, (medicament) => medicament.id != id))
    props.setCustomData(_.omit(state.customData, id))
    props.saveModification('delete', id, MESSAGES.planPrise.removeFromPP(denomination))
  }

  const _handleCustomDataChange = (input, value, lineId) => {
    let { id, child, multiple, parent } = input
    let { customData } = props
    if (multiple === true) {
      let currentState = _.get(customData, `${lineId}.${parent}`, {})
      if (value.action === "value") {
        _.set(currentState, `${id}.${child}`, value.value)
      } else if (value.action === "check") {
        _.set(currentState, `${id}.checked`, value.value)
      } else if (value.action === "choose") {
        _.set(currentState, `${id}`, value.value)
      } else if (value.action === "create") {
        _.set(currentState, `${id}.${child}`, value.value)
        _.set(currentState, `${id}.checked`, true)
      }
      _.set(customData, `${lineId}.${parent}`, currentState)
    } else {
      _.set(customData, `${lineId}.${parent}`, value.value)
    }

    props.setCustomData(customData)

    if (value.action === "create") return false
    return props.saveModification('edit', props.customData, MESSAGES.planPrise.editPP)
  }

  const _loadDetails = async (properties) => {
    let { id, type } = properties
    
    return await axios.post(window.php.routes.api.all.show, {
      id: id,
      type: type
    }, {
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

  return (
    <TransitionGroup
      className="plan-prise"
      enter={false}
    >
      {
        props.currentContent && props.currentContent.map(
          (medicament) =>
            <CSSTransition
              key={medicament.id}
              timeout={500}
              classNames="plan-prise-card"
            >
              <Async
                key={medicament.id}
                promiseFn={_loadDetails}
                id={medicament.id}
                denomination={medicament.denomination}
                type={medicament.type}
                watchFn={(prev, props) => {
                  console.log(prev.id, props.id, prev.id !== props.id)
                  return prev.id !== props.id
                }}
              >
                {
                  (asyncProps) =>

                    <PPCard
                      async={asyncProps}
                      lineId={medicament.id}
                      denomination={medicament.denomination}
                      customData={props.customData}
                      customSettings={props.customSettings}
                      inputs={props.inputs}
                      setCustomData={_handleCustomDataChange}
                      deleteLine={_handleDeleteLine}
                    />

                }
              </Async>
            </CSSTransition>
        )
      }
      <SearchMedicament
        multiple={false}
        onSelect={(value) => _handleAddLine(value)}
      />
    </TransitionGroup>
  )
}

export default PPLogic
