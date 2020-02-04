import React from 'react';
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

import alertManager from './generic/Alert';
import Search from './generic/Search';
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
      isShowingOptions: false,
      currentID: null,
      currentContent: [],
      customData: {},
      currentSettings: {}
    }
    if (window.php.current_pp) {
      let currentpp = window.php.current_pp
      defaultState.currentID = currentpp.pp_id
      defaultState.currentContent = currentpp.medicaments.map((medicament) => {
        return {
          id: medicament.value.id,
          denomination: medicament.value.denomination,
          data: medicament.data,
          type: medicament.type
        }
      })
      defaultState.customData = currentpp.custom_data || {}
      defaultState.currentSettings = currentpp.custom_settings
    }
    return defaultState
  }

  _saveModification = async (action, modifications, message) => {
    if (!this.apiCall) this.apiCall = {}
    this.apiCall.timeout && clearTimeout(this.apiCall.timeout)
    this.apiCall.alert = this.apiCall.alert || this.props.alert.addAlert({
      body: message
    })
    this.apiCall.timeout = setTimeout(async () => {
      return await axios.put(`${window.php.routes.api.planprise.update}/${this.state.currentID}`, {
        action: action,
        value: modifications
      }, {
        headers: {
          Authorization: `Bearer ${window.php.routes.token}`
        }
      })
        .then((response) => {
          this.apiCall.alert = this.props.alert.removeAlert(this.apiCall.alert)
          if (!response.status === 200) throw new Error(response.statusText)
          return true
        })
        .catch((error) => {
          this.apiCall.alert = this.props.alert.removeAlert(this.apiCall.alert)
          console.log(error)
        })
    }, 1000)
  }
  
  // #region PP methods
  _deletePP = async (event) => {
    event.preventDefault()
    this.setState({ isLoading: this.state.isLoading.startLoading("Suppression du plan de prise en cours... ") })
    return await axios.delete(`${window.php.routes.api.planprise.destroy}/${this.state.currentID}`, {
      headers: {
        Authorization: `Bearer ${window.php.routes.token}`
      }
    })
      .then((response) => {
        this._resetPP()
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
        console.log('Error destroying pp', response)
      })
    }
    
    _resetPP = () => {
      this.setState({
        isLoading: this.state.isLoading.stopLoading(),
        isShowingOptions: false,
        currentID: null,
        currentContent: [],
        customData: {},
        currentSettings: {}
      }, () => this.history.push(window.php.routes.path.planprise))
    }
    
    _handleSettingsChange = (input, value) => {
      let parent = input.parent
      let id = input.id
      console.log(input, value)
      this.setState((state) => {
        if (value.action === "check") {
          _.set(state.currentSettings, `${parent}.${id}.checked`, value.value)
        }
        return state
      }, () => this._saveModification('settings', this.state.currentSettings, 'Sauvegarde des préférences en cours'))
    }
    // #endregion
    
    _showOptions = (event) => {
      event.preventDefault()
      this.setState({ isShowingOptions: true })
    }
    
    _getInputs = () => {
      let inputs = _.cloneDeep(window.php.default.inputs)
      let posologies = inputs.posologies.inputs
      
      inputs.posologies.inputs = _.compact(Object.keys(posologies).map((key) => {
        let posologie = posologies[key]
        let isChecked = _.get(this.state.currentSettings, `inputs.${posologie.id}.checked`,  null)
        let isDefault = posologie.default
        let isDisplayed = isChecked || (isChecked === null && isDefault)
        return isDisplayed ? posologie : null
      }))
      
      return inputs
    }
    
    render() {
      let { isLoading, ...state } = this.state
      return (
        <Container>
        <Row className="justify-content-center">
        <Col xl={8}>
        <Card>
        
        <Card.Header className="d-flex">
        <div className="flex-fill">
        {
          state.currentID === -1 ? "Nouveau Plan de Prise" : state.currentID === null ? "Que voulez-vous faire ? " : "Plan de prise n°" + this.state.currentID
        }
        </div>
        {
          this.state.currentID > 0 && !this.state.isLoading.state ?
          <div className="d-flex">
          <div>
          <Button variant="link" className="text-secondary py-0" onClick={this._showOptions}>
          <i className="fa fa-cog"></i>
          </Button>
          </div>
          <Modal show={this.state.isShowingOptions} onHide={() => this.setState({ isShowingOptions: false })}>
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
                <Form.Check type="checkbox" label={input.label} checked={_.get(this.state, `currentSettings.inputs.${input.id}.checked`, (input.default || false))} onChange={(event) => this._handleSettingsChange({ parent: 'inputs', id: input.id }, {action: 'check', value: event.target.checked })} />
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
            this.state.isLoading.state ?
            <div>{SPINNER}<span className="ml-3">{this.state.isLoading.message}</span></div> :
            this.state.currentID === null ?
            <PPSelect onSelect={(selectedID) => this.setState({ currentID: selectedID })} /> :
            <PPLogic
                          inputs={this._getInputs()}
                          saveModification={(action, modifications, message) => this._saveModification(action, modifications, message)}
            setCurrentContent={(state) => this.setState({ currentContent: state })}
            setCustomData={(state) => this.setState({ customData: state })}
                          setCurrentID={(state) => this.setState({ currentID: state })}
            {...state}
            />
          }
          </Card.Body>
          
          </Card>
          </Col>
          </Row>
          </Container>
          )
        }
      }
      
      export default alertManager(PlanPrise)
