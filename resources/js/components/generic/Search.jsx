import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormControl, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import axios from 'axios';
import classNames from 'classnames';
import ArrowKeysReact from 'arrow-keys-react';

import { SPINNER } from '../params.js';

export default class Search extends React.Component {

  static defaultProps = {
    modal: true,
    multiple: false,
    selected: [],
  }

  static propTypes = {
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    onSave: PropTypes.func,
    modal: PropTypes.bool,
    multiple: PropTypes.bool,
    selected: PropTypes.array,
    url: PropTypes.string
  }

  get initialState () {
    return {
      hover: 0,
      isSearching: false,
      query: '',
      results: [],
      selected: [],
      showModal: false
    }
  }

  constructor (props) {
    super(props)
    this.state = this.initialState

    ArrowKeysReact.config({
      up: () => {
        this.setState({
          hover: Math.max(this.state.hover - 1, 0)
        })
      },
      down: () => {
          this.setState({
            hover: Math.min(this.state.hover + 1, this.state.results.length - 1)
          })
      }
    })
  }

  componentDidMount () {
    if (!this.props.modal && this.props.defaultValue) {
      let defaultValue = this.props.defaultValue.match(/(^\D+)(\d+.*)/m)
      defaultValue = defaultValue ? defaultValue.splice(1).map(item => item.trim()).join('*') : this.props.defaultValue
      this.setState({
        query: defaultValue
      }, () => this.getInfo())
    }
  }

  wakeUp = () => {
    this.setState(this.initialState)
    if (this.props.selected.length > 0) {
      this.setState({
        selected: this.props.selected.map((medic) => {
          return {
            code_cis: medic.code_cis,
            denomination: medic.denomination
          }
        })
      })
    }
    setTimeout(() => this.searchInput.focus(), 500)
  }

  getInfo = () => {
    this.axiosSource && this.axiosSource.cancel('Cancel previous request')
    this.axiosSource = axios.CancelToken.source()
    this.setState({ isSearching: true })
    let url = `${this.props.url}?query=${this.state.query}&display=code_cis,denomination&per_page=50`
    axios.get(url, {
      cancelToken: this.axiosSource.token
    })
    .then((response) => {
      this.setState({
        isSearching: false,
        results: response.data.data
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

  handleSearchSelect = (event, index) => {
    event.preventDefault()
    let result = this.state.results[index],
        selected = this.state.selected.map(selected => Number(selected.code_cis)).includes(Number(result.code_cis)),
        newSelected = this.state.selected
    if (!selected) {
      newSelected.push(result)
    } else {
      newSelected = newSelected.filter((selected) => Number(selected.code_cis) != Number(result.code_cis))
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
    if (!this.props.multiple) this.wakeUp()
    if (this.props.modal) this.setState({ showModal: false })
  }

  deselectValues = (deselect) => {
    let selected = this.state.selected
    if (deselect && deselect.length > 0) {
      let newSelected = selected.filter(
        (medicament) => !deselect.map((code) => Number(code)).includes(Number(medicament.code_cis))
      )
      this.setState({
        selected: newSelected
      })
    }
    return true
  }

  renderSaveButton = () => {
    if (this.props.multiple) {
      return (
        <InputGroup.Append>
          <Button
            type="button"
            variant="primary"
            onClick={() => this.saveValues()}
            disabled={this.props.disabled}
            >
            Importer
          </Button>
        </InputGroup.Append>
      )
    } else {
      return null
    }
  }

  renderModal = () => {
    const showModal = (value) => this.setState({ showModal: value })
    return (
      <>
      <Button type="button" variant="link" className="px-0" onClick={() => showModal(true)}>
        <i className="fa fa-plus-circle p-1"></i> Importer des médicaments
        </Button>
        <Modal show={this.state.showModal} onHide={() => showModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Importer un médicament</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            { this.renderForm() }
          </Modal.Body>
        </Modal>
        </>
    )
  }

  renderForm = () => {
    let noBottomRadiusLeft = this.state.results.length > 0 && !this.props.multiple ? { borderBottomLeftRadius: 0 } : {},
    noBottomRadiusRight = this.state.results.length > 0 && !this.props.multiple ? { borderBottomRightRadius: 0 } : {}
    return (
      <Form onSubmit={(e) => this.handleSearchSelect(e, this.state.hover)}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text style={noBottomRadiusLeft}>
              { this.state.isSearching ? SPINNER : <i className="fa fa-search"></i> }
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            disabled={this.props.disabled}
            type="text"
            onChange={this.handleSearchChange}
            placeholder="Rechercher un médicament dans la base de données publique"
            ref={(input) => this.searchInput = input}
            style={noBottomRadiusRight}
            value={this.state.query}
            {...ArrowKeysReact.events}
          />
          {
            this.renderSaveButton()
          }
        </InputGroup>
        {
          this.state.results.length > 0 ?
          <div>
            {
              this.props.multiple ? <a href="#" className="text-muted text-italic mb-0" onClick={() => this.setState({ selected: this.state.results })}><small>Tout sélectionner ({ this.state.results.length })</small></a> : null
            }
            <ListGroup>
              { !this.props.multiple ? <ListGroup.Item className="d-none"></ListGroup.Item> : null }
              {
                this.state.results.map((result, index) => {
                  let selected = this.state.selected.map(selected => Number(selected.code_cis)).includes(Number(result.code_cis)),
                      checkboxIcon = this.props.multiple ? selected ? <i className="fas fa-circle mr-2"></i> : <i className="far fa-circle mr-2"></i> : null
                  return (
                    <a key={index}
                      href="#"
                      className={classNames({
                        "list-group-item list-group-item-action py-2": true,
                        "border-top-0": index === 0 && !this.props.multiple,
                        "focus": index === this.state.hover
                       })}
                      onClick={(e) => this.handleSearchSelect(e, index)}
                      onMouseEnter={() => this.setState({ hover: index })}
                      >
                      {
                        this.props.multiple ? <input type="checkbox" checked={selected} className="d-none mt-1" onChange={(e) => this.handleSearchSelect(e, result, selected)} id={result.code_cis}/> : null
                      }
                      <label className={"d-flex m-0" + (selected ? " font-weight-bold" : "")} htmlFor={result.code_cis}>
                        <div>{checkboxIcon}</div>
                        <div className="text-truncate flex-grow-1">{result.denomination}</div>
                        <div className="ml-2">({result.code_cis})</div>
                      </label>
                    </a>
                  )
                })
              }
            </ListGroup>
          </div> : null
        }
      </Form>
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
