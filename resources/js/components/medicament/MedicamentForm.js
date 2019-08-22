import React from 'react';

import Selectrix from 'react-selectrix';
import Alert from '../generic/Alert';
import GenericInput from '../generic/GenericInput';

export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      inputs: props.inputs,
      button_disabled: true,
      selected_from_api: [],
      api_selected_detail: null
    }

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }

  }

  handleInputChange = (event) => {
    const target = event.target,
          name = target.getAttribute('child'),
          parent = target.getAttribute('name').split('[')[0],
          key = target.getAttribute('index')
    var value = target.type === 'checkbox' ? target.checked : target.value,
        newState = {}

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
    this.setState(newState, () => this.populateDetails())
  }

  populateDetails = () => {
    var newInputs = this.state.inputs
    let options = newInputs.voieAdministration.inputs.voieAdministration.options
    let allowed = this.state.voieAdministration
    var voiesAdministration = Object.keys(options)
                              .filter(key => allowed.includes(key))
                              .reduce((obj, key) => {
                                obj[key] = options[key];
                                return obj;
                              }, {})
    newInputs.commentaires.inputs.voieAdministration.options = {
      0: 'Toutes voies d\'administration', ...voiesAdministration
    }
    newInputs.commentaires.inputs.cible.options = {
      0: 'Ce médicament', ...this.state.substancesActives
    }
    this.setState({
      inputs: newInputs
    })
  }

  getInputList = (inputName) => {
    const inputValues = this.state[inputName],
          inputProperties = this.state.inputs[inputName]
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
      returnComponents.push(<GenericInput key={inputName} name={inputName} child={inputName} value={inputValues} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />)
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
    const inputProperties = this.state.inputs[inputParent]
    for (var inputName in inputProperties.inputs) {
      inputLine.push(
        <GenericInput key={inputParent + '-' +inputName} name={inputParent + '[' + index + '][' + inputName + ']'} child={inputName} index={index} value={inputObject[inputName]} onChange={ (e) =>  this.handleInputChange(e) } {...inputProperties.inputs[inputName]} />
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

  getSubstancesActives = (api_selected_detail) => {
    var substances = []
    for (var i = 0; i < api_selected_detail[0].compositions[0].substancesActives.length; i++) {
      const substanceActive = api_selected_detail[0].compositions[0].substancesActives[i],
            codeSubstance = "S-" + substanceActive.codeSubstance,
            denominationSubstance = substanceActive.denominationSubstance + " " + substanceActive.dosageSubstance,
            newSubstance = {}
      newSubstance[codeSubstance] = denominationSubstance
      substances = Object.assign(substances, newSubstance)
    }
    return substances
  }

  getDCIString = () => {
    var dciString = ""
    var first = true
    for (var substance in this.state.substancesActives) {
      const substancesActives = this.state.substancesActives
      const suffix = (first && this.state.api_selected_detail[0].compositions[0].substancesActives.length > 1) ? " + " : ""
      first = false
      dciString = dciString + substancesActives[substance] + " (" + substance + ")" + suffix
    }
    return dciString
  }

  storeCISFromAPI = (values) => {
    this.setState({
      selected_from_api: values,
      button_disabled: false
    })
  }

  getDetailFromCIS = (e) => {
    e.preventDefault()
    axios.post(this.props.api, {
      data: this.state.selected_from_api
    })
    .then((response) => {
      if (response.data.status === 'success') {
        let jsonResponse = JSON.parse(response.data.data)
        this.setState({
          api_selected_detail: jsonResponse,
          substancesActives: this.getSubstancesActives(jsonResponse),
          button_disabled: true
        }, () => this.populateDetails())
      } else {
        this.setState({
          alert: {
            type: 'warning',
            message: response.data.data
          },
          button_disabled: true
        }, () => {
          setTimeout(() => this.setState({alert: null}), 3000)
        })
      }
    })
  }

  renderCard = () => {
    if (!this.state.api_selected_detail) return null // GUARD
    return (
      <div className="card">
        <div className="card-header">Ajout d'un nouveau médicament</div>

        <div className="card-body">

          <h6>Correspondance dans la Base de Données Publique des Médicaments</h6>
          <ul>
            {
              this.state.api_selected_detail.map((api_selected_medicament, index) => {
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
              this.props.old ? <input type="hidden" name="old_medicament" value={ this.props.old } /> : null
            }

            {
              this.state.api_selected_detail.map((api_selected_medicament, index) => <input key={index} type="hidden" name="api_selected[]" value={ api_selected_medicament.codeCIS } />)
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

  render () {
    return (
      <div>
        <div className="d-flex flex-row mb-4">
          <Selectrix
            ajax={{
              url: "https://cors-anywhere.herokuapp.com/https://www.open-medicaments.fr/api/v1/medicaments",
              fetchOnSearch: true,
              q: "?query={q}",
              minLength: 3,
            }}
            className={"flex-fill"}
          	customKeys={{
          		key: "codeCIS",
          		label: "denomination"
          	}}
          	multiple={true}
            onChange={(values) => this.storeCISFromAPI(values)}
            placeholder={"Importer depuis la base de données publique des médicaments"}
          	stayOpen={true}
          />
        <button className="btn btn-primary ml-1" onClick={(e) => this.getDetailFromCIS(e)} disabled={this.state.button_disabled}>
            Envoyer
          </button>
        </div>
        {
          this.state.alert ? <Alert type="warning" message={this.state.alert.message} /> : null
        }
        {
          this.state.api_selected_detail ? this.renderCard() : null
        }
      </div>
    )
  }
}
