import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Form,
  Modal,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { createBrowserHistory } from 'history';
import _ from 'lodash';

import * as PP_ACTIONS from '../redux/plan-prise/actions';
import * as DATA_ACTIONS from '../redux/data/actions';

import PPLogic from './plan-prise/PPLogic';
import PPSelect from './plan-prise/PPSelect';
import { SPINNER } from './params';

class PlanPrise extends React.Component {

  constructor (props) {
    super(props)
    this.state = this.initStateWithProps(props)
    this.history = createBrowserHistory({
      basename: window.php.PP_base_url
    })
  }

  initStateWithProps = (props) => {
    let defaultState = {
      isLoading: {
        state: false,
        message: "",
        startLoading: function (message = "") { this.state = true; this.message = message; return this; },
        stopLoading: function () { this.state = false; this.message = ""; return this; }
      },
      isShowingOptions: false
    }
    if (window.php.current_pp) {
      let currentpp = window.php.current_pp
      props.setDefaults({
        currentID: currentpp.pp_id,
        currentContent: currentpp.medicaments.map((medicament) => ({
          id: medicament.value.id,
          denomination: medicament.value.denomination,
          type: medicament.type
        })),
        currentCustomData: currentpp.custom_data || {},
        currentSettings: currentpp.custom_settings
      })
      props.cacheDetails(currentpp.medicaments)
    }
    return defaultState
  }

  // #region PP methods
  _deletePP = async (event) => {
    event.preventDefault()
    this.setState({ isLoading: this.state.isLoading.startLoading("Suppression du plan de prise en cours... ") })
    return await axios.delete(`${window.php.routes.api.planprise.destroy}/${this.props.currentID}`, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
    .then(() => {
      this.props.reset()
    })
    .catch((error) => {
      this.setState({
        isLoading: this.state.isLoading.stopLoading()
      })
      this.props.alert.addAlert({
        header: "Erreur",
        body: "Impossible de supprimer le plan de prise, veuillez réessayer. ",
        delay: 10000
      })
      console.log('Error destroying pp', error.response)
    })
  }
  // #endregion

  _showOptions = (event) => {
    event.preventDefault()
    this.setState({ isShowingOptions: true })
  }

  render() {
    let { isLoading, isShowingOptions } = this.state
    return (
      <Container>
      <Row className="justify-content-center">
      <Col xl={8}>
      <Card>

      <Card.Header className="d-flex">
      <div className="flex-fill">
      {
        this.props.currentID === -1 ? "Nouveau Plan de Prise" : this.props.currentID === null ? "Que voulez-vous faire ? " : "Plan de prise n°" + this.props.currentID
      }
      </div>
      {
        this.props.currentID > 0 && !isLoading.state ?
        <div className="d-flex">
        <div>
        <Button variant="link" className="text-secondary py-0" onClick={this._showOptions}>
        <i className="fa fa-cog"></i>
        </Button>
        </div>
        <Modal show={isShowingOptions} onHide={() => this.setState({ isShowingOptions: false })}>
        <Modal.Header closeButton>
        <Modal.Title>Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <h5>Colonnes à afficher</h5>
        <Row>
        {
          Object.keys(window.php.default.inputs.posologies.inputs).map((key) => {
            let input = window.php.default.inputs.posologies.inputs[key]
            return (
              <Col key={input.id} sm={6}>
              <Form.Group className="mb-0" controlId={key}>
              <Form.Check type="checkbox" label={input.label} checked={_.get(this.props, `currentSettings.inputs.${input.id}.checked`, (input.default || false))} onChange={(event) => this.props.updateSettings({ parent: 'inputs', id: input.id }, {action: 'check', value: event.target.checked })} />
              </Form.Group>
              </Col>
              )
            }
            )
          }
          </Row>
          </Modal.Body>
          </Modal>
          <Button variant="link" className="text-danger py-0" onClick={this._deletePP}>
          <i className="fa fa-trash"></i>
          </Button>
          </div> : null
        }
        </Card.Header>

        <Card.Body>
        {
          isLoading.state ?
          <div>{SPINNER}<span className="ml-3">{isLoading.message}</span></div> :
          this.props.currentID === null ?
          <PPSelect/> :
          <PPLogic/>
        }
        </Card.Body>

        </Card>
        </Col>
        </Row>
        </Container>
        )
      }
    }

    const mapStateToProps = (state) => {
      return {
        currentID: state.planPriseReducer.currentID,
        currentSettings: state.planPriseReducer.currentSettings
      }
    }

    const mapDispatchToProps = (dispatch) => {
      return {
        reset: () => dispatch(PP_ACTIONS.reset()),
        setDefaults: (values) => dispatch(PP_ACTIONS.setDefaults(values)),
        cacheDetails: (details) => dispatch(DATA_ACTIONS.cacheDetails(details)),
        updateSettings: (input, value) => dispatch(PP_ACTIONS.updateSettings(input, value))
      }
    }

    export default connect(mapStateToProps, mapDispatchToProps)(PlanPrise)
