import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import uniqid from 'uniqid';
import PPInput from './PPInput';
import PPInputMultiple from './PPInputMultiple';

export default class PPInputGroup extends React.Component {

  static propTypes = {
    input: PropTypes.object,
    medicament: PropTypes.object
  }

  render() {
    let input = this.props.input,
        medicament = this.props.medicament,
        data = medicament.data[input.id],
        customData = medicament.customData && medicament.customData[input.id] ? medicament.customData[input.id] : null,
        needChoice = input.multiple || (!customData && Array.isArray(data)),
        codeCIS = medicament.codeCIS,
        addedData = input.multiple && medicament.customData && medicament.customData["custom_" + input.id] && Object.keys(medicament.customData["custom_" + input.id]).length > 0 ? medicament.customData["custom_" + input.id] : null
    if (input.readOnly && (!medicament.data[input.id] || medicament.data[input.id].length === 0)) return null
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
                    customData={customData}
                    codeCIS={codeCIS}
                    setCustomData={this.props.setCustomData}
                  />
                ) :
                <PPInput
                  isShowed={this.props.isShowed}
                  codeCIS={codeCIS}
                  customData={customData}
                  data={needChoice ? data[0] : data}
                  input={input}
                  needChoice={needChoice}
                  setCustomData={this.props.setCustomData}
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
                  codeCIS={codeCIS}
                  setCustomData={this.props.setCustomData}
                />
              }) : null
            }
            {
              input.multiple ? <Button variant="link" onClick={() => this.props.setCustomData({ parent: 'custom_precautions', child: 'custom_precautions', id: uniqid(), multiple: true }, { action: 'create', value: "" }, codeCIS)}>Ajouter une ligne</Button> : null
            }
          </>
        </div>
      </div>
    )
  }

}
