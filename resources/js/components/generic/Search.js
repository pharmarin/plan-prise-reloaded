import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';

import { getAPIFromCIS } from './functions';
import { isEqual, removeDuplicates } from './utils';
import { SPINNER } from '../params.js';

export default class Search extends React.Component {

  static defaultProps = {
    modal: true,
    multiple: false,
    selected: [],
  }

  constructor (props) {
    super(props)
    this.state = {
      isSearching: false,
      query: '',
      results: [],
      selected: []
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
        query: '',
        results: [],
        selected: this.props.selected.map((medic) => medic.code_cis)
      })
    }
    setTimeout(() => this.searchInput.focus(), 500)
  }

  getInfo = () => {
    this.axiosSource && this.axiosSource.cancel('Cancel previous request')
    this.axiosSource = axios.CancelToken.source()
    this.setState({ isSearching: true })
    let url = `${this.props.url}?query=${this.state.query}&limit=50`
    axios.get(url, {
      cancelToken: this.axiosSource.token
    })
    .then((response) => {
      this.setState({
        isSearching: false,
        results: response.data
      })
    })
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
      } else {
        console.log(thrown)
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
    } else {
      newSelected = newSelected.filter((cis) => cis != id)
    }
    this.setState({
      selected: newSelected
    }, () => !this.props.multiple ? this.saveValues() : null)
  }

  saveValues = () => {
    Promise.resolve(this.props.onSave([...new Set(this.state.selected)]))
    .then((resolve) => {
      if (resolve && resolve.action == 'deselect') {
        this.deselectValues(resolve.values)
      }
    })
  }

  deselectValues = (deselect) => {
    let selected = this.state.selected
    if (deselect && deselect.length > 0) {
      let newSelected = selected.filter((cis) =>
        !deselect.map((code) => Number(code))
          .includes(Number(cis))
      )
      this.setState({
        selected: newSelected
      })
    }
    return true
  }

  renderSaveButton = () => {
    let styleObject = !this.props.modal ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } : {}
    return (
      <button
        type="button"
        className="btn btn-sm btn-primary"
        onClick={() => this.saveValues()}
        style={styleObject}
        disabled={this.props.disabled}
        data-dismiss="modal"
        >
        Importer
      </button>
    )
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
            disabled={this.props.disabled}
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
                      </label>
                    </a>
                  )
                })
              }
            </ListGroup>
          </div> : null
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

Search.propTypes = {
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onSave: PropTypes.func,
  modal: PropTypes.bool,
  multiple: PropTypes.bool,
  selected: PropTypes.array,
  url: PropTypes.string
}
