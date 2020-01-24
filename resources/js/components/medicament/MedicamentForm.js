import React from 'react';

import Search from '../generic/Search';
import SearchComposition from './SearchComposition';
import MedicamentInput from './MedicamentInput';


export default class MedicamentForm extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      inputs: props.inputs,
      bdpm: [],
      composition_array: [],
      composition_precautions: [],
      deleted_precautions: []
    }

    for (let input in props.inputs) {
      this.state[input] = props.inputs[input].defaultValue
    }

    if (Array.isArray(this.state.commentaires)) {
      this.state.commentaires = this._getCommentairesObject(this.state.commentaires)
    }

    if (this.props.medicament) {
      if (this.props.medicament.bdpm && this.props.medicament.bdpm[0] !== undefined) {
        this.state.bdpm = this.props.medicament.bdpm
      }
      if (this.props.medicament.compositions) {
        this.state.composition_array = this.props.medicament.compositions.map((composition) => {
          return {
            value: composition.id,
            label: composition.denomination
          }
        })
        this.state.inputs = this._getSubstancesActivesObject(this.state.composition_array, this.state.inputs)
      }
    }
  }

  _handleSearchSelect = (selected) => {
    this.setState({
      bdpm: selected.sort((a, b) => {
        if (a.denomination < b.denomination) return -1
        if (a.denomination > b.denomination) return 1
        return 0
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

  _getSubstancesActivesObject = (composition_array, inputs_options) => {
    let substances_object = {}
    if (composition_array) {
      composition_array.forEach((composition) => Object.assign(substances_object, {
        ["S-" + composition.value]: composition.label
      }))
    }
    substances_object = { 0: 'Ce médicament', ...substances_object }
    inputs_options.commentaires.inputs.cible_id.options = substances_object
    return inputs_options
  }

  _getCommentairesObject = (old_commentaires, new_commentaires = [], filter = false) => {
    console.log('getCommentairesObject', old_commentaires, new_commentaires)
    if (filter) {
      old_commentaires = old_commentaires.filter((commentaire) => {
        if (!commentaire.cible_type) return true
        return !commentaire.cible_type.includes('Composition')
      })
    }
    return old_commentaires
      .concat(new_commentaires)
      .flat()
      .map((commentaire) => {
        let new_commentaire = commentaire
        if (!commentaire) {
          return this.props.inputs.commentaires.defaultValue
        } else if (
          new_commentaire.cible_id === 0
          || (
            typeof new_commentaire.cible_id === "string"
            && (
              new_commentaire.cible_id.split('-')[0] === "M"
              || new_commentaire.cible_id.split('-')[0] === "S"
            )
          )
        ) {
          return commentaire
        } else {
          new_commentaire.cible_id = new_commentaire.cible_type === "App\\Models\\Composition"
            ? 'S-' + new_commentaire.cible_id
            : 'M-' + new_commentaire.cible_id
          return new_commentaire
        }
      })
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
              <Search
                disabled={false}
                multiple={true}
                selected={this.state.bdpm}
                defaultValue={this.state.inputs.custom_denomination.defaultValue}
                modal={this.state.bdpm.length > 0}
                onSave={(values) => this._handleSearchSelect(values)}
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

              <form action={window.php.routes.action} method="POST">

                {
                  this.props.method === "EDIT" ? <input type="hidden" name="_method" value="PUT" /> : null
                }

                {
                  this.props.method === "IMPORT" ? <input type="hidden" name="old_medicament" value={this.state.inputs.old_medicament.defaultValue} /> : null
                }

                <input type="hidden" name="_token" value={document.head.querySelector('meta[name="csrf-token"]').getAttribute('content')} />

                {
                  this.state.bdpm.map((medicament, index) =>
                    <input key={index} type="hidden" name="bdpm[]" value={ medicament.code_cis } />
                  )
                }

                {
                  this.state.deleted_precautions.map((commentaire, index) =>
                    <input key={index} type="hidden" name="delete_precautions[]" value={commentaire.id} />
                  )
                }

                {
                    this.state.composition_array.map((composition, index) =>
                    <input key={index} type="hidden" name="composition[]" value={composition.value} />
                  )
                }

                <p className="m-0">DCI : </p>
                  <SearchComposition
                    defaultOptions={this.state.composition_array}
                    onCompositionChange={(composition_array) => this.setState({
                      composition_array: composition_array,
                      inputs: this._getSubstancesActivesObject(composition_array, this.state.inputs)
                    })}
                    onPrecautionChange={(precaution_array) => this.setState({
                      commentaires: this._getCommentairesObject(this.state.commentaires, precaution_array, true)
                    })}
                    setState={(state) => this.setState(state)}
                  />

                {
                  Object.keys(this.state.inputs).map(inputName =>
                    <MedicamentInput
                      key={inputName}
                      inputName={inputName}
                      inputValues={this.state[inputName]}
                      inputProperties={this.state.inputs[inputName]}
                      setState={newState => this.setState({ [inputName]: newState })}
                      voiesAdministration={this.state.voies_administration}
                      deleteCallback={(prec) => this.setState({
                        deleted_precautions: this.state.deleted_precautions.concat(prec)
                      })}
                    />
                  )
                }

                <button type="submit" className="btn btn-primary" disabled={!(this.state.composition_array.length > 0)} >{ submitButton }</button>

              </form>
            </> : null
          }
        </div>

      </div>
    )
  }

}
