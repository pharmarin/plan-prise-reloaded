import React from 'react';
import axios from 'axios';
import { isEqual, removeDuplicates } from './functions';

import Alert from './Alert';

export default class Search extends React.Component {

  static defaultProps = {
    modal: true
  }

  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isSearching: false,
      alert: [],
      query: '',
      results: [],
      selected: [],
      retrieved: []
    }
  }

  componentDidMount () {
    if (!this.props.modal && this.props.defaultValue) {
      this.setState({
        query: this.props.defaultValue
      }, () => this.getInfo())
    }
  }

  wakeUp = () => {
    if (this.props.selected.length > 0) {
      this.setState({
        isLoading: false,
        query: '',
        results: [],
        selected: this.props.selected.map((medic) => medic.codeCIS),
        retrieved: this.props.selected
      })
    }
    setTimeout(() => this.searchInput.focus(), 500)
  }

  getInfo = () => {
    this.setState({ isSearching: true })
    axios.get(`${this.props.url}?query=${this.state.query}&limit=50`)
    .then((response) => {
      this.setState({
        isSearching: false,
        results: response.data
      })
    })
  }

  getDetailFromCIS = (needCall) => {
    this.setState({
      isLoading: true
    }, () => {
      try {
        axios.post(this.props.api, {
          data: needCall
        })
        .then((response) => {
          if (response.data.status === 'success') {
            let jsonResponse = JSON.parse(response.data.data)
            this.setState({
              retrieved: jsonResponse
            }, () => this.saveValues())
          } else {
            this.setState({
              alert: [...this.state.alert, {
                type: 'warning',
                message: response.data.data
              }]
            }, () => {
              //setTimeout(() => this.setState({ alert: [] }), 3000)
            })
          }
          // Dans tous les cas
          let selected = this.state.selected
          if (response.data.deselect && response.data.deselect.length > 0) {
            selected = selected.filter((cis) =>
              !response.data.deselect.map((code) => Number(code))
                .includes(Number(cis))
            )
            this.setState({
              selected: selected
            })
          }
          this.setState({ isLoading: false })
        })
      } catch (error) {
        this.setState({
          isLoading: false
        })
        console.log(error)
      }

    })
  }

  handleSearchChange = () => {
    this.setState({
      query: this.searchInput.value
    }, () => {
      if (this.state.query && this.state.query.length > 3) {
        this.getInfo()
      }
    })
  }

  handleSearchSelect = (event) => {
    var newSelected = this.state.selected
    if (event.target.checked) {
      newSelected.push(Number(event.target.id))
    } else {
      newSelected = newSelected.filter((cis) => cis != event.target.id)
    }
    this.setState({
      selected: newSelected
    })
  }

  retrieveFromCIS = () => {
    this.getDetailFromCIS(this.state.selected)
  }

  isReadyToSave = () => {
    let readyToSave = true,
        retrieved = this.state.retrieved.map((medic) => Number(medic.codeCIS)),
        selected = this.state.selected.map((cis) => Number(cis)),
        defaultSelected = this.props.selected.map((medic) => Number(medic.codeCIS))

    if (isEqual(selected, retrieved)) {
      readyToSave = true
    }

    // Si la valeur de this.state.selected n'a pas changé depuis le réveil, on retourne false juste pour que ce soit joli
    if (isEqual(selected, defaultSelected)) {
      readyToSave = false
    }

    return readyToSave
  }

  isEqual = () => {
    let retrieved = this.state.retrieved.map((medic) => Number(medic.codeCIS)),
        selected = this.state.selected.map((cis) => Number(cis))

    return isEqual(retrieved, selected)
  }

  saveValues = () => {
    this.props.onSave(
      removeDuplicates(this.state.retrieved, 'codeCIS')
      .filter((medic) =>
        this.state.selected.includes(Number(medic.codeCIS))
      )
      .sort((a, b) => {
        if ( a.denomination < b.denomination ){
          return -1;
        }
        if ( a.denomination > b.denomination ){
          return 1;
        }
        return 0
      })
    )
  }

  isSuppressed = (codeCIS) => {
    if (this.state.retrieved.length > 0) {
      for (var key in this.state.retrieved) {
        if (this.state.retrieved.hasOwnProperty(key) && this.state.retrieved[key].codeCIS == codeCIS) {
          return !this.state.retrieved[key].etatCommercialisation
        }
      }
    } else {
      return false
    }
  }

  renderSaveButton = () => {
    let retrieved = this.state.retrieved.map((medic) => Number(medic.codeCIS)),
        selected = this.state.selected.map((cis) => Number(cis))
    if (!isEqual(retrieved, selected)) {
      return (
        <button type="button" className="btn btn-sm btn-primary ml-1" onClick={() => this.retrieveFromCIS()} aria-label="Import" disabled={this.isEqual() || this.state.isLoading}>
          {
            this.state.isLoading ? <i className="fa fa-circle-notch fa-spin"></i> : "Importer"
          }
        </button>
      )
    } else {
      return (
        <button type="button" className="btn btn-sm btn-primary ml-1" onClick={() => this.saveValues()} data-dismiss="modal" aria-label="Save" disabled={!this.isReadyToSave()}>
          Ajouter
        </button>
      )
    }
  }

  renderModal = () => {
    return (
      <>
      <button type="button" onClick={() => this.wakeUp()} className="btn btn-link px-0" data-toggle="modal" data-target="#searchModal">
        <i className="fa fa-plus-circle p-1"></i> Importer des médicaments
        </button>
        <div className="modal fade" id="searchModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title flex-fill">Importer un médicament</h5>
                { this.renderSaveButton() }
                <button type="button" className="btn btn-sm btn-secondary ml-1" data-dismiss="modal" aria-label="Close">
                  Annuler
                </button>
              </div>
              <div className="modal-body">
                { this.renderForm() }
              </div>
            </div>
          </div>
        </div>
        </>
    )
  }

  renderForm = () => {
    return (
      <form>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              {
                this.state.isSearching ?
                  <i className="fa fa-circle-notch fa-spin"></i>
                : <i className="fa fa-search"></i>
              }
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            onChange={this.handleSearchChange}
            placeholder="Rechercher un médicament dans la base de données publique"
            ref={(input) => this.searchInput = input}
            value={this.state.query}
            />
          {
            this.props.modal ? null : this.renderSaveButton()
          }
        </div>
        <Alert alert={this.state.alert} dismiss={() => this.setState({ alert: []})} />
        {
          this.state.results.length > 0 ?
          <div className="p-1">
            <a href="#" className="text-muted text-italic mb-0" onClick={() => this.setState({ selected: this.state.results.map((result) => Number(result.codeCIS))})}><small>Suggestions ({ this.state.results.length })</small></a>
            <ul className="list-unstyled">
              {
                this.state.results.map((result) =>
                <li key={result.codeCIS}>
                  <div className="form-check">
                    <input type="checkbox" checked={this.state.selected.includes(Number(result.codeCIS))} className="form-check-input" onChange={(e) => this.handleSearchSelect(e)} id={result.codeCIS}/>
                    <label className={"form-check-label" + (this.state.selected.includes(Number(result.codeCIS)) ? " font-weight-bold" : "")} htmlFor={result.codeCIS}>{result.denomination} (<a href={`https://open-medicaments.fr/api/v1/medicaments/${result.codeCIS}` } target="_blank">{result.codeCIS}</a>) {this.isSuppressed(result.codeCIS) ? "Supprimé" : ""}</label>
                  </div>
                </li>
              )
            }
          </ul>
        </div>
        : null
      }
    </form>
  )
}

render () {
  if (this.props.modal) {
    return this.renderModal()
  } else {
    return this.renderForm()
  }
}
}
