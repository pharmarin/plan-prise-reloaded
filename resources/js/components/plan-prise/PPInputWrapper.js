import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import uniqid from 'uniqid';
import _ from 'lodash';
import PPInput from './PPInput';
import PPInputMultiple from './PPInputMultiple';

export default class PPInputWrapper extends React.Component {

  static propTypes = {
    input: PropTypes.object,
    medicament: PropTypes.object
  }

  render() {
    let { input, medicament, customData, ...props } = this.props
    let { lineId } = this.props
    let data = _.get(medicament, `${input.id}`, null)
    let inputCustomData = customData && customData[input.id] ? customData[input.id] : null
    let needChoice = input.multiple || (!inputCustomData && Array.isArray(data))
    let addedData = input.multiple && customData && customData["custom_" + input.id] && Object.keys(customData["custom_" + input.id]).length > 0 ? customData["custom_" + input.id] : null

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
                    customData={inputCustomData}
                    setCustomData={this.props.setCustomData}
                    {...props}
                  />
                ) :
                <PPInput
                  isShowed={this.props.isShowed}
                  customData={inputCustomData}
                  data={needChoice ? data[0] : data}
                  input={input}
                  needChoice={needChoice}
                  setCustomData={this.props.setCustomData}
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
                  customData={addedData}
                  setCustomData={this.props.setCustomData}
                  {...props}
                />
              }) : null
            }
            {
              input.multiple ? <Button variant="link" onClick={() => this.props.setCustomData({ parent: 'custom_precautions', child: 'custom_precautions', id: uniqid(), multiple: true }, { action: 'create', value: "" }, lineId)}>Ajouter une ligne</Button> : null
            }
          </>
        </div>
      </div>
    )
  }

}
