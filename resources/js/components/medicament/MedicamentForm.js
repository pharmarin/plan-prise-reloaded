import React from 'react';

import Search from '../generic/Search';
import MedicamentInput from './MedicamentInput';

import { getAPIFromCIS } from '../generic/functions';
import { API_URL, SPINNER } from '../params';

export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      isLoading: false,
      inputs: props.inputs,
      api_selected_detail: []
    }

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }

    if (this.props.fromAPI && this.props.fromAPI[0] !== undefined) {
      this.state.api_selected_detail = this.props.fromAPI
      this.state.inputs.commentaires.inputs.cible_id.options = this.getSubstancesActivesObject(this.props.fromAPI[0].compositions_array)
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.inputs) {
      if (!(prevState.api_selected_detail.length > 0) && this.state.api_selected_detail[0]) {
        let substancesActivesObject = this.getSubstancesActivesObject(this.state.api_selected_detail[0].compositions_array),
          newInputs = this.state.inputs
        newInputs.commentaires.inputs.cible_id.options = substancesActivesObject
        this.setState({
          inputs: newInputs
        })
      }
    }
  }

  handleSearchSelect = async (selected) => {
    return await new Promise((resolve) => {
      this.setState({ isLoading: true })
      getAPIFromCIS(
        selected.map(selected => selected.codeCIS),
        (response, deselect) => {
          let newCommentaires = this.state.commentaires
          newCommentaires = newCommentaires.concat(response[0].associated_precautions)
          this.setState({
              commentaires: newCommentaires,
              api_selected_detail: response.sort((a, b) => {
              if (a.denomination < b.denomination) return -1
              if (a.denomination > b.denomination) return 1
              return 0
            })
          })
          resolve()
        },
        (response, deselect) => {
          this.props.alert.addAlert({
            header: 'Médicaments non commercialisés',
            body: response,
          })
          resolve({
            action: 'deselect',
            values: deselect
          })
        }
      )
      .then(() => {
        this.setState({ isLoading: false })
      })
    })
  }

  removeAPILine = (event, codeCIS) => {
    event.preventDefault()
    this.setState({
      api_selected_detail: this.state.api_selected_detail.filter((medicament) => {
        return medicament.code_cis !== codeCIS
      })
    })
  }

  getSubstancesActivesObject = (substancesArray) => {
    let substancesObject = {}
    if (substancesArray !== undefined) {
      substancesArray.forEach((substance) => substancesObject = Object.assign(substancesObject, {
        [substance.codeSubstance]: substance.denominationSubstance
      }))
    }
    return {0: 'Ce médicament', ...substancesObject}
  }

  render () {
    let cardTitle, submitButton
    switch (this.props.method) {
      case 'EDIT':
        cardTitle = "Modification d'un médicament"
        submitButton = "Modifier"
        break;
      case 'IMPORT':
        cardTitle = "Importation d'un médicament"
        submitButton = "Importer"
        break;
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
            <li key="add">
              <div className={this.state.isLoading ? "mb-1" : "d-none"}>
                { SPINNER }
                <span className="ml-2">Import des médicaments sélectionnés en cours...</span>
              </div>
              <Search
                disabled={this.state.isLoading}
                multiple={true}
                selected={this.state.api_selected_detail}
                defaultValue={this.state.inputs.custom_denomination.defaultValue}
                modal={this.state.api_selected_detail.length > 0}
                onSave={(values) => this.handleSearchSelect(values)}
                url={API_URL}
                api={this.props.api}
                />
            </li>
            {
              this.state.api_selected_detail.length > 0 && this.state.api_selected_detail.map((api_selected_medicament, index) => <li key={index}><button className="btn btn-link p-1" onClick={(e) => this.removeAPILine(e, api_selected_medicament.code_cis)}><i className="fa fa-minus-circle"></i></button> { api_selected_medicament.denomination } (<a href={`http://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=${api_selected_medicament.code_cis}&typedoc=R`} target="_blank">{ api_selected_medicament.code_cis }</a>)</li>
              )
            }
          </ul>

          {
            this.state.api_selected_detail.length > 0 ?
            <>
              <p>DCI : { this.state.api_selected_detail[0].compositions_string }</p>

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
                  this.state.api_selected_detail.map((api_selected_medicament, index) =>
                    <input key={index} type="hidden" name="api_selected[]" value={ api_selected_medicament.code_cis } />
                  )
                }

                {
                  Object.keys(this.state.inputs).map(inputName =>
                    <MedicamentInput
                      key={inputName}
                      inputName={inputName}
                      inputValues={this.state[inputName]}
                      inputProperties={this.state.inputs[inputName]}
                      setState={newState => this.setState({ [inputName]: newState })}
                      voiesAdministration={this.state.voies_administration}
                      />)
                }

                <button type="submit" className="btn btn-primary">{ submitButton }</button>

              </form>
            </> : null
          }
        </div>
        {
          this.renderHelpModal()
        }
      </div>
    )
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
}
