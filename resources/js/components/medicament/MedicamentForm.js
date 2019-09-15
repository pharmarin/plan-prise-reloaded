import React from 'react';

import Search from '../generic/Search';
import GenericInput from '../generic/GenericInput';

export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      inputs: props.inputs,
      api_selected_detail: []
    }

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }

    if (this.props.fromAPI) {
      this.state.api_selected_detail = this.props.fromAPI
      this.state.inputs.commentaires.inputs.cible_id.options = this.getSubstancesActivesObject(this.props.fromAPI[0].compositionsArray)
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.inputs) {
      if (!(prevState.api_selected_detail.length > 0)) {
        let substancesActivesObject = this.getSubstancesActivesObject(this.state.api_selected_detail[0].compositionsArray),
          newInputs = this.state.inputs
        console.log(substancesActivesObject, this.state.api_selected_detail[0].compositionsArray)
        newInputs.commentaires.inputs.cible_id.options = substancesActivesObject
        this.setState({
          inputs: newInputs
        })
      }
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
      oldState[key][name] = value
      newState = {
        [parent]: oldState
      }
    }
    this.setState(newState)
  }

  getInputList = (inputName) => {
    const inputValues = this.state[inputName],
          inputProperties = this.state.inputs[inputName]
    var returnComponents = []

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
                && (!this.state.voiesAdministration.map((voie) => Number(voie.voiesAdministration)).includes(Number(inputObject.voie_administration))
                && !Number(inputObject.voie_administration) === 0)
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
      const inputValueOrEmptyString = inputValues !== null ? inputValues : ""
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

  getInputLine = (inputObject, inputParent, index) => {
    var inputLine = []
    let inputProperties = this.state.inputs[inputParent]
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
    this.setState({
      inputName: this.state[inputName].push(this.state.inputs[inputName].emptyObject)
    })
  }

  removeInputLine = (event, inputName, key) => {
    event.preventDefault()
    this.setState({
      inputName: this.state[inputName].splice(key, 1)
    })
  }

  removeAPILine = (event, codeCIS) => {
    event.preventDefault()
    this.setState({
      api_selected_detail: this.state.api_selected_detail.filter((medicament) => {
        return medicament.codeCIS !== codeCIS
      })
    })
  }

  getSubstancesActivesObject = (substancesArray) => {
    let substancesObject = {}
    if (substancesArray !== undefined) {
      substancesArray.forEach((substance) => substancesObject = Object.assign(substancesObject, {
        [substance.codeSubstance]: substance.denominationSubstance + " " + substance.dosageSubstance
      }))
    }
    return {0: 'Ce médicament', ...substancesObject}
  }

  renderHelpModal = () => {
    return (
      <div id="helpModal" className="modal fade" tabIndex="-1" role="info" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Aide</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead className="thead-light">
                  <tr>
                    <th>Element</th>
                    <th>Markdown Syntax</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bold</td>
                    <td><code>**bold text**</code></td>
                  </tr>
                  <tr>
                    <td>Italic</td>
                    <td><code>*italicized text*</code></td>
                  </tr>
                  <tr>
                    <td>Link</td>
                    <td><code>[title](https://www.example.com)</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render () {
    if (!(this.state.api_selected_detail.length > 0)) {
      return <Search selected={this.state.api_selected_detail}
        defaultValue={this.state.inputs.customDenomination.defaultValue}
        modal={false}
        onSave={(values) => {
          let newCommentaires = this.state.commentaires
          newCommentaires = newCommentaires.concat(values[0].associatedPrecautions)
          this.setState({
            api_selected_detail: values,
            commentaires: newCommentaires
          })
        }}
        url="https://cors-anywhere.herokuapp.com/https://www.open-medicaments.fr/api/v1/medicaments/" api={this.props.api} />
    } else {
      let cardTitle
      let submitButton
      switch (this.props.method) {
        case 'EDIT':
          cardTitle = "Modification d'un médicament"
          submitButton = "Modifier"
          break;
        case 'IMPORT':
          cardTitle = "Importation d'un médicament"
          submitButton = "Importer"
        default:
          cardTitle = "Ajout d'un nouveau médicament"
          submitButton = "Ajouter"
      }
      return (
        <div className="card">
          <div className="card-header">{ cardTitle }</div>

          <div className="card-body">

            <h6>Correspondance dans la Base de Données Publique des Médicaments</h6>
            <ul className="list-unstyled">
              {
                this.state.api_selected_detail.map((api_selected_medicament, index) => <li key={index}><button className="btn btn-link p-1" onClick={(e) => this.removeAPILine(e, api_selected_medicament.codeCIS)}><i className="fa fa-minus-circle"></i></button> { api_selected_medicament.denomination } (<a href={`http://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=${api_selected_medicament.codeCIS}&typedoc=R`} target="_blank">{ api_selected_medicament.codeCIS }</a>)</li>
                )
              }
              <li key="add">
                <Search selected={this.state.api_selected_detail} onSave={(values) => this.setState({ api_selected_detail: values })} url="https://cors-anywhere.herokuapp.com/https://www.open-medicaments.fr/api/v1/medicaments/" api={this.props.api} />
              </li>
            </ul>

            <p>DCI : { this.state.api_selected_detail[0].compositionsString }</p>

            <form action={this.props.route} method="POST">

              {
                this.props.method === "EDIT" ? <input type="hidden" name="_method" value="PUT" /> : null
              }

              {
                this.props.method === "IMPORT" ? <input type="hidden" name="old_medicament" value={this.state.inputs.old_medicament.defaultValue} /> : null
              }

              <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]').getAttribute('content')} />

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
                this.getInputList('voiesAdministration')
              }

              {
                this.getInputList('commentaires')
              }

              <button type="submit" className="btn btn-primary">{ submitButton }</button>

            </form>

          </div>
          {
            this.renderHelpModal()
          }
        </div>
      )
    }
  }
}
