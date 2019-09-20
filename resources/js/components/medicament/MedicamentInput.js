import React from 'react';

import GenericInput from '../generic/GenericInput';

export default class MedicamentInput extends React.Component
{

  handleInputChange = (event) => {
    let target = event.target,
        name = target.getAttribute('child'),
        parent = target.getAttribute('name').split('[')[0],
        key = target.getAttribute('index'),
        value = target.type === 'checkbox' ? target.checked : target.value,
        newState = {}

    if (key == undefined) {
      newState = value
    } else {
      var oldState = this.props.inputValues
      oldState[key][name] = value
      newState = oldState
    }
    this.props.setState(newState)
  }

  getInputLine = (inputObject, inputParent, index) => {
    var inputLine = []
    let inputProperties = this.props.inputProperties
    for (var inputName in inputProperties.inputs) {
      let inputValueOrEmptyString = inputObject[inputName] !== null ? inputObject[inputName] : ""
      inputLine.push(
        <GenericInput key={inputParent + '-' +inputName} name={inputParent + '[' + index + '][' + inputName + ']'} child={inputName} index={index} value={inputValueOrEmptyString} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />
      )
    }
    return inputLine
  }

  addInputLine = (event, inputName) => {
    event.preventDefault()
    this.props.setState(this.props.inputValues.concat(this.props.inputProperties.emptyObject))
  }

  removeInputLine = (event, inputName, key) => {
    event.preventDefault()
    let inputValues = this.props.inputValues
    inputValues.splice(key, 1)
    console.log(inputValues, key)
    this.props.setState(inputValues)
  }

  render () {
    let inputName = this.props.inputName,
        inputValues = this.props.inputValues,
        inputProperties = this.props.inputProperties,
        returnComponents = []

    if (inputProperties.isRepeated) {
      returnComponents = (
        <div>
          {
            inputValues.map((inputObject, index) => {
              let classColor = " " + (
                  inputName === 'commentaires' ?
                  inputObject.cible_id && inputObject.cible_id.toString().split('-')[0] === 'S' ?
                    "border rounded border-warning" :
                    "border rounded border-success" :
                  ""
                )
              if (
                inputName === 'commentaires'
                && inputObject.voie_administration
                && !(this.props.voiesAdministration.map((voie) => Number(voie.voies_administration)).includes(Number(inputObject.voie_administration)))
                && !(Number(inputObject.voie_administration) === 0)
              ) {
                return null
              }
              return (
                <div key={index} className={"d-flex mb-1 p-1" + classColor}>
                  <div className="d-flex flex-fill flex-wrap">
                    { this.getInputLine(inputObject, inputName, index) }
                  </div>
                  <button
                    className="btn btn-primary align-self-start ml-1"
                    onClick={ (event) => {
                      event.preventDefault()
                      if (inputObject.cible_id && inputObject.cible_id.toString().split('-')[0] === 'S') {
                        if (!confirm ("La suppression de cette ligne affectera tous les médicaments contenant cette substance. Voulez-vous continuer ? ")) {
                          return
                        }
                      }
                      this.removeInputLine(event, inputName, index)
                    }}
                    >
                    <i className="fa fa-minus"></i>
                  </button>
                </div>
              )
            })
          }
          <div key={-1} className="d-flex flex-row-reverse mr-1">
            <button className="btn btn-primary float-right"
              onClick={(event) => this.addInputLine(event, inputName)}
              >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      )
    } else {
      let inputValueOrEmptyString = inputValues !== null ? inputValues : ""
      returnComponents.push(
        <div key={inputName} className="p-1">
          <GenericInput name={inputName} child={inputName} value={inputValueOrEmptyString} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />
        </div>
      )
    }

    return (
      <div className="form-group">
        {
          inputProperties.label ? <label htmlFor={ inputName }>{inputProperties.label}</label> : null
        }
        {
          returnComponents
        }
        {
          inputProperties.hint ? <small className="form-text text-muted mt-0 mr-1">{ inputProperties.hint }</small> : null
        }
      </div>
    )
  }

}
