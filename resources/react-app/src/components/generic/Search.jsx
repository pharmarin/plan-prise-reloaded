/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
} from 'react-bootstrap';
import axios from 'axios';
import classNames from 'classnames';
import ArrowKeysReact from 'arrow-keys-react';

import { SPINNER } from '../params';

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState;
    const { hover, results } = this.state;

    ArrowKeysReact.config({
      up: () => {
        this.setState({
          hover: Math.max(hover - 1, 0),
        });
      },
      down: () => {
        this.setState({
          hover: Math.min(hover + 1, results.length - 1),
        });
      },
    });
  }

  componentDidMount() {
    const { defaultValue, modal } = this.props;
    if (!modal && defaultValue) {
      let value = defaultValue.match(/(^\D+)(\d+.*)/m);
      value = value
        ? value
            .splice(1)
            .map((item) => item.trim())
            .join('*')
        : defaultValue;
      this.setState(
        {
          query: value,
        },
        () => this.getInfo(),
      );
    }
  }

  static get initialState() {
    return {
      hover: 0,
      isSearching: false,
      query: '',
      results: [],
      selected: [],
      showModal: false,
    };
  }

  wakeUp = () => {
    const { selected } = this.props;
    this.setState(this.initialState);
    if (selected.length > 0) {
      this.setState({
        selected: selected.map((medic) => {
          return {
            code_cis: medic.code_cis,
            denomination: medic.denomination,
          };
        }),
      });
    }
    setTimeout(() => this.searchInput.focus(), 500);
  };

  getInfo = () => {
    const { url, query } = this.state;
    if (this.axiosSource) {
      this.axiosSource.cancel('Cancel previous request');
    }
    this.axiosSource = axios.CancelToken.source();
    this.setState({ isSearching: true });
    const fullUrl = `${url}?query=${query}&display=code_cis,denomination&per_page=50`;
    axios
      .get(fullUrl, {
        cancelToken: this.axiosSource.token,
      })
      .then((response) => {
        this.setState({
          isSearching: false,
          results: response.data.data,
        });
      })
      .catch((thrown) => {
        if (axios.isCancel(thrown)) {
          console.log('Request canceled', thrown.message);
        } else {
          console.log(thrown);
        }
      });
  };

  handleSearchChange = () => {
    const { query } = this.state;
    this.setState(
      {
        query: this.searchInput.value,
      },
      () => {
        if (query && query.length > 3) {
          this.getInfo();
        }
      },
    );
  };

  handleSearchSelect = (event, index) => {
    event.preventDefault();
    const { results, multiple, selected } = this.state;
    const result = results[index];
    const selection = selected
      .map((s) => Number(s.code_cis))
      .includes(Number(result.code_cis));
    let newSelected = selected;
    if (!selection) {
      newSelected.push(result);
    } else {
      newSelected = newSelected.filter(
        (s) => Number(s.code_cis) !== Number(result.code_cis),
      );
    }
    this.setState(
      {
        selected: newSelected,
      },
      () => (!multiple ? this.saveValues() : null),
    );
  };

  saveValues = () => {
    const { modal, multiple, onSave } = this.props;
    const { selected } = this.state;
    Promise.resolve(onSave([...new Set(selected)])).then(
      (resolve) => {
        if (resolve && resolve.action === 'deselect') {
          this.deselectValues(resolve.values);
        }
      },
    );
    if (!multiple) this.wakeUp();
    if (modal) this.setState({ showModal: false });
  };

  deselectValues = (deselect) => {
    const { selected } = this.state;
    if (deselect && deselect.length > 0) {
      const newSelected = selected.filter(
        (medicament) =>
          !deselect
            .map((code) => Number(code))
            .includes(Number(medicament.code_cis)),
      );
      this.setState({
        selected: newSelected,
      });
    }
    return true;
  };

  renderSaveButton = () => {
    const { disabled, multiple } = this.props;
    if (multiple) {
      return (
        <InputGroup.Append>
          <Button
            type="button"
            variant="primary"
            onClick={() => this.saveValues()}
            disabled={disabled}
          >
            Importer
          </Button>
        </InputGroup.Append>
      );
    }
    return null;
  };

  renderModal = () => {
    const { showModal } = this.state;
    const setShowModal = (value) =>
      this.setState({ showModal: value });
    return (
      <>
        <Button
          type="button"
          variant="link"
          className="px-0"
          onClick={() => setShowModal(true)}
        >
          <i className="fa fa-plus-circle p-1" />
          Importer des médicaments
        </Button>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Importer un médicament</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.renderForm()}</Modal.Body>
        </Modal>
      </>
    );
  };

  renderForm = () => {
    const {
      hover,
      isSearching,
      query,
      results,
      selected,
    } = this.state;
    const { disabled, multiple } = this.props;
    const noBottomRadiusLeft =
      results.length > 0 && !multiple
        ? { borderBottomLeftRadius: 0 }
        : {};
    const noBottomRadiusRight =
      results.length > 0 && !multiple
        ? { borderBottomRightRadius: 0 }
        : {};
    return (
      <Form onSubmit={(e) => this.handleSearchSelect(e, hover)}>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text style={noBottomRadiusLeft}>
              {isSearching ? SPINNER : <i className="fa fa-search" />}
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            disabled={disabled}
            type="text"
            onChange={this.handleSearchChange}
            placeholder="Rechercher un médicament dans la base de données publique"
            ref={(input) => {
              this.searchInput = input;
            }}
            style={noBottomRadiusRight}
            value={query}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...ArrowKeysReact.events}
          />
          {this.renderSaveButton()}
        </InputGroup>
        {results.length > 0 ? (
          <div>
            {multiple ? (
              <Button
                type="link"
                className="text-muted text-italic mb-0"
                onClick={() =>
                  this.setState({
                    selected: results,
                  })
                }
              >
                <small>Tout sélectionner ({results.length})</small>
              </Button>
            ) : null}
            <ListGroup>
              {!multiple ? (
                <ListGroup.Item className="d-none" />
              ) : null}
              {results.map((result, index) => {
                const selection = selected
                  .map((s) => Number(s.code_cis))
                  .includes(Number(result.code_cis));
                const checkboxIcon = multiple ? (
                  selection ? (
                    <i className="fas fa-circle mr-2" />
                  ) : (
                    <i className="far fa-circle mr-2" />
                  )
                ) : null;
                return (
                  <Button
                    type="link"
                    key={result.code_cis}
                    className={classNames({
                      'list-group-item list-group-item-action py-2': true,
                      'border-top-0': index === 0 && !multiple,
                      focus: index === hover,
                    })}
                    onClick={(e) => this.handleSearchSelect(e, index)}
                    onMouseEnter={() =>
                      this.setState({ hover: index })
                    }
                  >
                    {multiple ? (
                      <input
                        type="checkbox"
                        checked={selected}
                        className="d-none mt-1"
                        onChange={(e) =>
                          this.handleSearchSelect(e, result, selected)
                        }
                        id={result.code_cis}
                      />
                    ) : null}
                    <label
                      className={`d-flex m-0${
                        selected ? ' font-weight-bold' : ''
                      }`}
                      htmlFor={result.code_cis}
                    >
                      <div>{checkboxIcon}</div>
                      <div className="text-truncate flex-grow-1">
                        {result.denomination}
                      </div>
                      <div className="ml-2">({result.code_cis})</div>
                    </label>
                  </Button>
                );
              })}
            </ListGroup>
          </div>
        ) : null}
      </Form>
    );
  };

  render() {
    const { modal } = this.props;
    if (modal) {
      return this.renderModal();
    }
    return this.renderForm();
  }
}

Search.propTypes = {
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  onSave: PropTypes.func,
  modal: PropTypes.bool,
  multiple: PropTypes.bool,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      code_cis: PropTypes.number,
      denomination: PropTypes.string,
    }),
  ),
  url: PropTypes.string,
};

Search.defaultProps = {
  modal: true,
  multiple: false,
  selected: [],
};
