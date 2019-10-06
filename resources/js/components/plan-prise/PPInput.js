import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormCheck } from 'react-bootstrap';
import autosize from 'autosize';

class PPInput extends React.Component {

  static propTypes = {
    input: PropTypes.object, 
    medicament: PropTypes.object
  }

  textarea = []

  componentDidMount () {
    this.textarea.forEach((textarea) => autosize(textarea))
  }

  componentDidUpdate (prevProps) {
    if (prevProps.isShowed !== this.props.isShowed) {
      setTimeout(() => this.textarea.forEach((textarea) => autosize.update(textarea)), 300)
    }
  }

  renderContentEditable = (inputProperties, dataObject) => {
    let input = inputProperties.input,
        needChoice = inputProperties.needChoice,
        data = dataObject.data,
        customData = dataObject.customData,
        codeCIS = dataObject.codeCIS,
        display = input.display ? input.display : input.id,
        value
    if (data || customData) {
      if (input.multiple && customData && customData[display]) {
        // Permet de récupérer les customData des commentaires (car needChoice mais on veut quand même les customData)
        value = customData[display]
      } else if (needChoice) {
        // Si needChoice -> Pas de customData
        value = data[display] || ""
      } else {
        value = customData || data || ""
      }
    } else {
      value = ""
    }
    if (input.readOnly === true) {
      return <span>{ value }</span>
    }
    return (
      <Form.Control as="textarea" rows={1} className="flex-fill border-light" value={value} ref={(input) => this.textarea.push(input)} onChange={(event) => this.props.setCustomData({ parent: input.id, child: display, id: (data ? data.id : null), readOnly: input.readOnly }, { action: 'value', value: event.target.value }, codeCIS)} />
    )
  }

  render () {
    let input = this.props.input,
        medicament = this.props.medicament,
        data = medicament.data[input.id],
        customData = medicament.customData && medicament.customData[input.id] ? medicament.customData[input.id] : null,
        needChoice = input.multiple || (!customData && Array.isArray(data)),
        codeCIS = medicament.codeCIS
    if (input.readOnly && (!medicament.data[input.id] || medicament.data[input.id].length === 0)) return null
    return (
      <div key={input.id}>
        <p className="text-muted mb-0 ml-1" style={{fontSize: ".8em"}}>{input.label}</p>
        <div className="flex-fill mb-2 py-1">
          <>
            {
              (input.multiple || (needChoice && data.length > 1)) ?
              data.map((item, index) => {
                let customItemData = item.id && customData && customData[item.id] ? customData[item.id] : null,
                    customItemChecked = customItemData && customItemData.checked !== undefined ? customItemData.checked : item.population === null
                return <div key={index}>
                  {
                    (input.help && item[input.help]) ? <p className="text-muted font-italic ml-4 mb-0" style={{fontSize: ".8em"}}>{item[input.help]}</p> : null
                  }
                  <Form>
                    <Form.Check
                      type={input.multiple ? 'checkbox' : 'radio'}
                      className="flex-fill mb-2"
                      children={
                        <>
                          <FormCheck.Input
                            type={input.multiple ? 'checkbox' : 'radio'}
                            checked={customItemChecked}
                            onChange={(event) => this.props.setCustomData({ parent: input.id, child: input.display, id: item.id }, { action: 'check', value: event.target.checked }, codeCIS)}
                            />
                          <FormCheck.Label className="d-flex">{
                            this.renderContentEditable(
                              { input: input, needChoice: needChoice },
                              { customData: customItemData, data: item, codeCIS: codeCIS }
                            )
                          }</FormCheck.Label>
                        </>
                      }
                      label={this.renderContentEditable(
                        { input: input, needChoice: needChoice },
                        { customData: customItemData, data: item, codeCIS: codeCIS }
                      )}
                      />
                  </Form>
                </div>
              }) :
              this.renderContentEditable(
                { input: input, needChoice: needChoice },
                { customData: customData, data: (needChoice ? data[0] : data), codeCIS: codeCIS }
              )
            }
            {
              input.multiple ? <Button variant="link">Ajouter une ligne</Button> : null
            }
          </>
        </div>
      </div>
    )
  }

}

export default PPInput
