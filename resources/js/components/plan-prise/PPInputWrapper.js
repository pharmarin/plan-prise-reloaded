import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import uniqid from 'uniqid';
import _ from 'lodash';
import PPInput from './PPInput';
import PPInputMultiple from './PPInputMultiple';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPInputWrapper extends React.Component {

  static propTypes = {
    input: PropTypes.object,
    medicament: PropTypes.object
  }

  render() {
    let { input, medicament, currentCustomData, ...props } = this.props
    let data = _.get(medicament, `${input.id}`, null)
    let inputCustomData = _.get(currentCustomData, `${medicament.id}.${input.id}`, null)
    let needChoice = input.multiple || (!inputCustomData && Array.isArray(data))
    let addedData = input.multiple ? _.get(currentCustomData, `${medicament.id}.custom_${input.id}`, null) : null

    if (input.readOnly && (!medicament[input.id] || medicament[input.id].length === 0)) return null
    if (!data && (needChoice || input.multiple)) data = []

    return (
      <div key={input.id}>
        <p className="text-muted mb-0 ml-1" style={{fontSize: ".8em"}}>{input.label}</p>
        <div className="flex-fill mb-2 py-1">
          <>
            {
              (input.multiple || (needChoice && data.length > 1)) ?
                data.map((item, index) =>
                  <PPInputMultiple
                    key={input.id + "_" + index}
                    input={input}
                    needChoice={needChoice}
                    item={item}
                    lineId={medicament.id}
                    currentCustomData={inputCustomData}
                    {...props}
                  />
                ) :
                <PPInput
                  isShowed={this.props.isShowed}
                  currentCustomData={inputCustomData}
                  data={needChoice ? data[0] : data}
                  input={input}
                  lineId={medicament.id}
                  needChoice={needChoice}
                  {...props}
                />
            }
            {
              addedData ? Object.keys(addedData).map((id, index) => {
                let customID = "custom_" + input.id
                return <PPInputMultiple
                  key={customID + "_" + index}
                  input={{ id: customID, multiple: true }}
                  needChoice={needChoice}
                  item={{ id: id }}
                  lineId={medicament.id}
                  currentCustomData={addedData}
                  {...props}
                />
              }) : null
            }
            {
              input.multiple ? <Button variant="link" onClick={() => this.props.updateLine(medicament.id, { type: 'create', value: "" }, { parent: 'custom_precautions', child: 'custom_precautions', id: uniqid(), multiple: true })}>Ajouter une ligne</Button> : null
            }
          </>
        </div>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    currentCustomData: state.planPriseReducer.currentCustomData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (lineId, action, input) => dispatch(PP_ACTIONS.updateLine(lineId, action, input))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PPInputWrapper)
