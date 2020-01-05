import React from 'react';

import Search from '../generic/Search';
import MedicamentInput from './MedicamentInput';

import { getAPIFromCIS } from '../generic/functions';
import { SPINNER } from '../params';

export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      inputs: props.inputs,
      bdpm: [],
      composition: []
    }

    this.initCommentaires = []

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }

    if (this.props.medicament && this.props.medicament.bdpm && this.props.medicament.bdpm[0] !== undefined) {
      this.state.bdpm = this.props.medicament.bdpm
      this.state.inputs.commentaires.inputs.cible_id.options = this.getSubstancesActivesObject(this.props.medicament.composition.composition_parsed)
    }
  }

  handleSearchSelect = async (selected) => {
    return await new Promise((resolve) => {
      this.setState({ isLoading: true })
      getAPIFromCIS(
        selected.map(selected => selected.code_cis),
        (response) => {
          let substances_actives = this.getSubstancesActivesObject(response.composition)
          let new_inputs = this.state.inputs
          new_inputs.commentaires.inputs.cible_id.options = substances_actives
          let newCommentaires = this.state.commentaires
          newCommentaires = newCommentaires.concat(response.detail[0].composition_precautions)
          this.initCommentaires = this.initCommentaires.concat(response.detail[0].composition_precautions)
          this.setState({
            commentaires: newCommentaires,
            bdpm: response.detail.sort((a, b) => {
              if (a.denomination < b.denomination) return -1
              if (a.denomination > b.denomination) return 1
              return 0
            }),
            inputs: new_inputs
          })
          resolve()
        },
        (response) => {
          this.props.alert.addAlert({
            header: 'Erreur lors de l\'ajout des médicaments',
            body: response,
          })
          resolve()
        }
      )
      .then(() => {
        this.setState({ isLoading: false })
      })
    })
  }

  removeAPILine = (event, code_cis) => {
    event.preventDefault()
    this.setState({
      bdpm: this.state.bdpm.filter((medicament) => {
        return medicament.code_cis !== code_cis
      })
    })
  }

  getSubstancesActivesObject = (compositions) => {
    console.log(compositions)
    let substances_object = {}
    if (compositions !== undefined) {
      compositions.forEach((composition) => {
        console.log(composition)
        let code_substance = composition.code_substance.map((code) => 'S-' + code).join('+')
        Object.assign(substances_object, {
          [code_substance]: composition.denomination_substance
        })
      })
    }
    return { 0: 'Ce médicament', ...substances_object}
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
                {SPINNER}
                <span className="ml-2">Import des médicaments sélectionnés en cours...</span>
              </div>
              <Search
                disabled={false}
                multiple={true}
                selected={this.state.bdpm}
                defaultValue={this.state.inputs.custom_denomination.defaultValue}
                modal={this.state.bdpm.length > 0}
                onSave={(values) => this.handleSearchSelect(values)}
                url={window.php.routes.api.bdpm.search}
                api={this.props.api}
                />
            </li>
            {
              this.state.bdpm.length > 0 && this.state.bdpm.map((medicament, index) => <li key={index}><button className="btn btn-link p-1" onClick={(e) => this.removeAPILine(e, medicament.code_cis)}><i className="fa fa-minus-circle"></i></button> { medicament.denomination } (<a href={`http://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid=${medicament.code_cis}&typedoc=R`} target="_blank">{ medicament.code_cis }</a>)</li>
              )
            }
          </ul>

          {
            this.state.bdpm.length > 0 ?
            <>
              <p>DCI : { this.props.method === 'EDIT' ? this.props.medicament.composition_string : this.state.bdpm[0].composition_string }</p>

              <form action={window.php.routes.action} method="POST">

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
                  this.state.bdpm.map((medicament, index) =>
                    <input key={index} type="hidden" name="bdpm[]" value={ medicament.code_cis } />
                  )
                }

                {
                  this.initCommentaires.map((commentaire, index) =>
                    <input key={index} type="hidden" name="previous_prec_id[]" value={commentaire.id} />
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
