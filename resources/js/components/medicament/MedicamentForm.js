import React from 'react';
import {Select as ReactSelect} from 'react-select';

import GenericInput from '../generic/GenericInput';

export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)
    this.api_selected_detail = this.props.selected
    this.state = {}

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }
    this.state.substancesActives = this.getSubstancesActives()

  }

  handleInputChange = (event) => {
    const target = event.target,
          name = target.getAttribute('name').split('[')[0],
          parent = target.getAttribute('parent'),
          key = target.getAttribute('index')
    var value = target.type === 'checkbox' ? target.checked : target.value,
        newState = {}

    if (target.type === 'select-multiple') {
      const options = target.options
      value = []
      for (var i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }
    }

    if (key == undefined) {
      newState = {
        [name]: value
      }
    } else {
      var oldState = this.state[parent]
      if (parent == name) {
        oldState[key] = value
      } else {
        oldState[key][name] = value
      }
      newState = {
        [parent]: oldState
      }
    }
    this.setState(newState)
  }

  getInputList = (inputName) => {
    const inputValues = this.state[inputName],
          inputProperties = this.props.inputs[inputName]
    var returnComponents = []

    if (inputProperties.isRepeated) {
      returnComponents.push([
        inputValues.map((inputObject, index) => {
          return <div key={index} className="d-flex flex-row mb-1">
            {
              this.getInputLine(inputObject, inputName, index)
            }
            <button className="btn btn-primary" onClick={(event) => this.removeInputLine(event, inputName, index)}><i className="fa fa-minus"></i></button>
          </div>
        }),
        <div key={-1} className="d-flex flex-row-reverse">
          <button className="btn btn-primary float-right" onClick={(event) => this.addInputLine(event, inputName)}><i className="fa fa-plus"></i></button>
        </div>
      ])
    } else {
      returnComponents.push(<GenericInput key={inputName} name={inputName} value={inputValues} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />)
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

  getInputLine = (inputObject, inputParent, index) => {
    var inputLine = []
    const inputProperties = this.props.inputs[inputParent]
    for (var inputName in inputProperties.inputs) {
      inputLine.push(
        <GenericInput key={inputName} name={inputParent + '[' + index + '][' + inputName + ']'} parent={inputParent} index={index} value={inputObject[inputName]} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />
      )
    }
    return inputLine
  }

  addInputLine = (event, inputName) => {
    event.preventDefault()
    this.setState({
      inputName: this.state[inputName].push({[inputName]: ""})
    })
  }

  removeInputLine = (event, inputName, key) => {
    event.preventDefault()
    this.setState({
      inputName: this.state[inputName].splice(key, 1)
    })
  }

  getSubstancesActives = () => {
    if (!this.api_selected_detail) return []
    var substances = []
    for (var i = 0; i < this.api_selected_detail[0].compositions[0].substancesActives.length; i++) {
      const substanceActive = this.api_selected_detail[0].compositions[0].substancesActives[i]
      substances = Object.assign(substances, {[substanceActive.codeSubstance]: substanceActive.denominationSubstance + " " + substanceActive.dosageSubstance})
    }
    return substances
  }

  getDCIString = () => {
    var dciString = ""
    var first = true
    for (var substance in this.state.substancesActives) {
      const substancesActives = this.state.substancesActives
      const suffix = (first && this.api_selected_detail[0].compositions[0].substancesActives.length > 1) ? " + " : ""
      first = false
      dciString = dciString + substancesActives[substance] + " (" + substance + ")" + suffix
    }
    return dciString
  }

  render () {

    return (
      <div className="card">
        <div className="card-header">Ajout d'un nouveau médicament</div>

        <div className="card-body">

          <h6>Correspondance dans la Base de Données Publique des Médicaments</h6>
          <ul>
            {
              this.api_selected_detail.map(function (api_selected_medicament, index) {
                return (
                  <li key={index}>{ api_selected_medicament.denomination } ({ api_selected_medicament.codeCIS })</li>
                )
              })
            }
          </ul>
          <p>DCI : { this.getDCIString() }</p>


          <form action={this.props.route} method="POST">

            <input type="hidden" name="_token" value={this.props.csrf} />

            {
              this.api_selected_detail.map((api_selected_medicament, index) => <input key={index} type="hidden" name="api_selected[]" value={ api_selected_medicament.codeCIS } />)
            }

            {
              this.getInputList('customDenomination')
            }

            {
              this.getInputList('customIndications')
            }

            {
              this.getInputList('conservationFrigo')
            }

            {
              this.getInputList('conservationDuree')
            }

            {
              this.getInputList('voieAdministration')
            }

            {
              this.getInputList('commentaires')
            }

            <button type="submit" className="btn btn-primary">Ajouter</button>

          </form>

        </div>
      </div>
    )
  }
}
