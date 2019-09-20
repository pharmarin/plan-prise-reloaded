import React from 'react';
import axios from 'axios';

import { ListGroup } from 'react-bootstrap';

import { getAPIFromCIS } from './functions';
import { isEqual, removeDuplicates } from './utils';
import { SPINNER } from '../params.js';

import Alert from './Alert';

export default class Search extends React.Component {

  static defaultProps = {
    modal: true,
    multiple: false,
    selected: [],
    type: 'detail'
  }

  constructor (props) {
    super(props)
    this.state = {
      isMounted: false,
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
    this.setState({isMounted: true})
    if (!this.props.modal && this.props.defaultValue) {
      this.setState({
        query: this.props.defaultValue
      }, () => this.getInfo())
    }
  }

  componentWillUnmount () {
    this.state.isMounted = false
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
      if (this.state.isMounted) {
        this.setState({
          isSearching: false,
          results: response.data
        })
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

  handleSearchSelect = (event, id, selected) => {
    event.preventDefault()
    var newSelected = this.state.selected
    if (!selected) {
      newSelected.push(Number(id))
      // On sauve directement si ce n'est pas un multiple
      if (this.props.type === 'cis' && !this.props.multiple) {
        this.setState({ selected: [] })
        return this.props.onSave(newSelected)
      }
    } else {
      newSelected = newSelected.filter((cis) => cis != id)
    }
    this.setState({
      selected: newSelected
    })
  }

  retrieveFromCIS = () => {
    this.setState(
      { isLoading: true },
      () => (new Promise((resolve) =>
      getAPIFromCIS(
        this.state.selected,
        (response, deselect) => {
          if (this.state.isMounted) {
            this.setState({
              retrieved: response
            }, () => {
              this.props.modal ? null : this.saveValues()
            })
            this.deselectValues(deselect)
            resolve()
          }
        },
        (response, deselect) => {
          if (this.state.isMounted) {
            this.setState({
              alert: [...this.state.alert, {
                type: 'warning',
                message: response
              }]
            })
            this.deselectValues(deselect)
            resolve()
          }
        }
      )
    ))
    .then(() => {
      this.state.isMounted ? this.setState({ isLoading: false }) : null
    })
  )
}

deselectValues = (deselect) => {
  let selected = this.state.selected
  if (deselect && deselect.length > 0) {
    selected = selected.filter((cis) =>
    !deselect.map((code) => Number(code))
    .includes(Number(cis))
  )
  if (this.state.isMounted) {
    this.setState({
      selected: selected
    })
  }
}
return true
}

isReadyToSave = () => {
  let readyToSave = true,
  retrieved = this.state.retrieved.map((medic) => Number(medic.codeCIS)),
  selected = this.state.selected.map((cis) => Number(cis)),
  defaultSelected = this.props.selected.map((medic) => Number(medic.codeCIS))

  if (isEqual(selected, retrieved)) {
    readyToSave = true
  }

  // Si la valeur de this.state.selected n'a pas changé depuis le réveil, on retourne false juste pour plus de cohérence
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
  console.log(this.state.retrieved, this.state.selected)
  this.props.onSave(
    removeDuplicates(this.state.retrieved, 'code_cis')
    .filter((medic) =>
    this.state.selected.includes(Number(medic.code_cis))
  )
  .sort((a, b) => {
    if ( a.denomination < b.denomination ) {
      return -1;
    }
    if ( a.denomination > b.denomination ) {
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

renderSaveButton = (style) => {
  let retrieved = this.state.retrieved.map((medic) => Number(medic.codeCIS)),
  selected = this.state.selected.map((cis) => Number(cis))
  if (!isEqual(retrieved, selected)) {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={() => this.retrieveFromCIS()} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ...style  }} disabled={this.isEqual() || this.state.isLoading}>
        {
          this.state.isLoading ? SPINNER : "Importer"
        }
      </button>
    )
  } else {
    return (
      <button type="button" className="btn btn-sm btn-primary" onClick={() => this.saveValues()} style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ...style }} data-dismiss="modal" disabled={!this.isReadyToSave()}>
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
  let noBottomRadiusLeft = this.state.results.length > 0 && !this.props.multiple ? { borderBottomLeftRadius: 0 } : {},
  noBottomRadiusRight = this.state.results.length > 0 && !this.props.multiple ? { borderBottomRightRadius: 0 } : {}
  return (
    <form className="mb-3">
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" style={noBottomRadiusLeft}>
            {
              this.state.isSearching ?
              SPINNER
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
        this.props.modal ? null : this.renderSaveButton(noBottomRadiusRight)
      }
    </div>
    <Alert alert={this.state.alert} dismiss={() => this.setState({ alert: []})} />
    {
      this.state.results.length > 0 ?
      <div>
        {
          this.props.multiple ? <a href="#" className="text-muted text-italic mb-0" onClick={() => this.setState({ selected: this.state.results.map((result) => Number(result.codeCIS))})}><small>Suggestions ({ this.state.results.length })</small></a> : null
        }
        <ListGroup>
          { !this.props.multiple ? <ListGroup.Item className="d-none"></ListGroup.Item> : null }
          {
            this.state.results.map((result, index) => {
              let selected = this.state.selected.includes(Number(result.codeCIS)),
              noBorderClass = index === 0 && !this.props.multiple ? " border-top-0" : "",
              checkboxIcon = this.props.multiple ? selected ? <i className="fas fa-circle mr-2"></i> : <i className="far fa-circle mr-2"></i> : null
              return (
                <a key={index} href="#" className={"list-group-item list-group-item-action py-2" + noBorderClass} onClick={(e) => this.handleSearchSelect(e, result.codeCIS, selected)} >
                  {
                    this.props.multiple ? <input type="checkbox" checked={selected} className="d-none mt-1" onChange={(e) => this.handleSearchSelect(e, result.codeCIS, selected)} id={result.codeCIS}/> : null
                  }
                  <label className={"d-flex m-0" + (this.state.selected.includes(Number(result.codeCIS)) ? " font-weight-bold" : "")} htmlFor={result.codeCIS}>
                    <div>{checkboxIcon}</div>
                    <div className="text-truncate flex-grow-1">{result.denomination}</div>
                    <div className="ml-2">({result.codeCIS})</div>
                      {this.isSuppressed(result.codeCIS) ? "Supprimé" : ""}
                    </label>
                  </a>
                )
              })
            }
          </ListGroup>
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
