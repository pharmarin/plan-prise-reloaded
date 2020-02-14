import React from 'react';
import { connect } from 'react-redux';
import Async from 'react-async';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';
import * as DATA_ACTIONS from '../../redux/data/actions';

import PPCard from './PPCard';
import SearchMedicament from '../generic/SearchMedicament';

const PPLogic = (props) => {

  const _getInputs = () => {
    let inputs = _.cloneDeep(window.php.default.inputs)
    let posologies = inputs.posologies.inputs

    inputs.posologies.inputs = _.compact(Object.keys(posologies).map((key) => {
      let posologie = posologies[key]
      let isChecked = _.get(props.settings, `inputs.${posologie.id}.checked`, null)
      let isDefault = posologie.default
      let isDisplayed = isChecked || (isChecked === null && isDefault)
      return isDisplayed ? posologie : null
    }))

    return inputs
  }

  const _handleAddLine = async (value) => {
    let medicament = {
      id: value.value,
      denomination: value.label,
      type: value.type
    }
    return props.addLine(medicament)
  }


  return (
    <TransitionGroup
      className="plan-prise"
      enter={false}
    >
      {
        props.content && props.content.map(
          (medicament) => {
            let details = _.find(props.data, (item) => item.id === medicament.id && item.type === medicament.type) || props.emptyObject
            if (!(details.data || details.state.isLoading)) props.load(medicament)
            return (
              <CSSTransition
                key={medicament.id}
                timeout={500}
                classNames="plan-prise-card"
              >
                <PPCard
                  details={details}
                  lineId={medicament.id}
                  denomination={medicament.denomination}
                  inputs={_getInputs()}
                />
              </CSSTransition>
            )
          }
        )
      }
      <SearchMedicament
        multiple={false}
        onSelect={(value) => _handleAddLine(value)}
      />
    </TransitionGroup>
  )
}

const mapStateToProps = (state) => {
  return {
    content: state.planPriseReducer.content,
    settings: state.planPriseReducer.settings,
    data: state.dataReducer.data,
    emptyObject: state.dataReducer.empty
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(PP_ACTIONS.init(id)),
    addLine: (medicament) => dispatch(PP_ACTIONS.addLine(medicament)),
    load: (properties) => dispatch(DATA_ACTIONS.load(properties))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PPLogic)
