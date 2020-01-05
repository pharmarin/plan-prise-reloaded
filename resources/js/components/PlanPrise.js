import React from 'react';
import { Button, Container, Form, Modal, Row, Col, Card } from 'react-bootstrap';
import { createBrowserHistory } from 'history';
import set from 'lodash/set';
import get from 'lodash/get';

import alertManager from './generic/Alert';
import Search from './generic/Search';
import PPSelect from './plan-prise/PPSelect';
import PPCard from './plan-prise/PPCard';

import MESSAGES from './messages.js';
import { SPINNER } from './params';
import { managePP } from './generic/functions';

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
      currentSettings: {}
    }
    if (window.php.current_pp) {
      let currentpp = window.php.current_pp
      defaultState.currentID = currentpp.pp_id
      defaultState.currentContent =  currentpp.medic_data_detail.map((medicament) => {
        medicament.custom_data.bdpm = [medicament.data]
        return {
          codeCIS: medicament.data.code_cis,
          denomination: medicament.data.denomination,
          data: medicament.custom_data, //custom_data est une propriété de l'objet medic_data
          customData: currentpp.custom_data && currentpp.custom_data[medicament.data.code_cis] ? currentpp.custom_data[medicament.data.code_cis] : {}
        }
      })
      defaultState.currentSettings = currentpp.custom_settings
    }
    return defaultState
  }

  // #region PPCard methods
  addToPP = (values) => {
    let medicament = {
          ...values[0],
          data: null,
          customData: {}
        },
        content = this.state.currentContent
    content.push(medicament)
    this.setState({ currentContent: content }, this.loadDetails(medicament.codeCIS, medicament.denomination))
  }

  loadDetails = (cis, denomination = null) => {
    let alert = this.props.alert.addAlert({
      body: MESSAGES.planPrise.addToPP(denomination)
    })
    managePP(
      this.state.currentID,
      {
        action: 'store',
        value: cis
      },
      (response) => {
        let newState = this.state.currentContent.map((medic) => {
          if (Number(medic.codeCIS) !== Number(cis)) return medic
          medic.data = response.data
          return medic
        })
        this.setState({ currentContent: newState })
        if (this.state.currentID === -1) this.setState({ currentID: response.pp_id })
        this.props.alert.removeAlert(alert)
      },
      (response) => {
        this.props.alert.removeAlert(alert)
        console.log('Error saving pp', response)
      }
    )
  }

  deleteLine = (cis, denomination = null) => {
    let alert = this.props.alert.addAlert({
      body: MESSAGES.planPrise.removeFromPP(denomination)
    })
    this.setState((state) => {
      return {
        currentContent: state.currentContent.filter(medicament => medicament.codeCIS != cis)
      }
    })
    managePP(
      this.state.currentID,
      {
        action: 'delete',
        value: cis
      },
      (response) => {
        this.props.alert.removeAlert(alert)
      },
      (response) => {
        this.props.alert.removeAlert(alert)
        this.props.alert.addAlert({
          header: 'Error deleting line'
        })
        console.log('Error deleting line', response)
      }
    )
  }

  saveModification = (action, modifications, message) => {
    this.apiCall ? clearTimeout(this.apiCall) : null
    this.apiCall = setTimeout(() => {
      let alert = this.props.alert.addAlert({
        body: message
      })
      managePP(
        this.state.currentID,
        {
          action: action,
          value: modifications
        },
        (response) => {
          this.props.alert.removeAlert(alert)
        },
        (response) => {
          this.props.alert.removeAlert(alert)
          console.log('Error saving pp', response)
        }
      )
    }, 1000)
  }

  handleCustomDataChange = (input, value, codeCIS) => {
    this.setState((state) => {
      let currentContent = state.currentContent.map((medicament) => {
        if (medicament.codeCIS === codeCIS) {
          let parent = input.parent
          let child = input.child
          let id = input.id
          if (input.multiple === true) {
            let currentState = medicament.customData[parent] || {}
            if (value.action === "value") {
              currentState[id] = {
                ...currentState[id],
                [child]: value.value
              }
            } else if (value.action === "check") {
              currentState[id] = {
                ...currentState[id],
                checked: value.value
              }
            } else if (value.action === "create") {
              currentState = Object.assign(
                currentState,
                {
                  [id]: {
                    [child]: value.value
                  }
                }
              )
            }
            medicament.customData[parent] = currentState
          } else {
            medicament.customData[parent] = value.value
          }
          return medicament
        } else {
          return medicament
        }
      })

      let modifications = this.state.currentContent.reduce((request, medic) => {
        let customData = medic.customData
        if (Object.keys(customData).length > 0) {
          return Object.assign(request, { [medic.codeCIS]: customData })
        } else {
          return request
        }
      }, {})
      this.saveModification('edit', modifications, MESSAGES.planPrise.editPP)

      return {
        currentContent: currentContent
      }
    })
  }
  //#endregion

  // #region PP methods
  deletePP = (event) => {
    event.preventDefault()
    this.setState({ isLoading: this.state.isLoading.startLoading("Suppression du plan de prise en cours... ") })
    managePP(
      this.state.currentID,
      {
        action: 'destroy',
      },
      (response) => {
        this.resetPP()
      },
      (response) => {
        this.setState({
          isLoading: this.state.isLoading.stopLoading()
        })
        this.props.alert.addAlert({
          header: "Erreur",
          body: "Impossible de supprimer le plan de prise, veuillez réessayer. ",
          delay: 10000
        })
        console.log('Error destroying pp', response)
      }
    )
  }

  resetPP = () => {
    this.setState({
      isLoading: this.state.isLoading.stopLoading(),
      currentID: null,
      currentContent: []
    }, () => this.history.push('/'))
  }

  handleSettingsChange = (input, value) => {
    let parent = input.parent
    let id = input.id
    this.setState((state) => {
      if (value.action === "check") {
        set(state.currentSettings, `${parent}.${id}.checked`, value.value)
      }
      this.saveModification('settings', state.currentSettings, 'Sauvegarde des préférences en cours')
      return state
    })
  }
  // #endregion

  showOptions = (event) => {
    event.preventDefault()
    this.setState({ isShowingOptions: true })
  }

  render () {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xl={8}>
            <Card>

              <Card.Header className="d-flex">
                <div className="flex-fill">
                  {
                    this.state.currentID === -1 ? "Nouveau Plan de Prise" : this.state.currentID === null ? "Que voulez-vous faire ? " : "Plan de prise n°" + this.state.currentID
                  }
                </div>
                {
                  this.state.currentID > 0 && !this.state.isLoading.state ?
                    <div className="d-flex">
                      <div>
                        <Button variant="link" className="text-secondary py-0" onClick={this.showOptions}>
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
                              Object.keys(window.php.default_settings.inputs).map((key) => {
                                let input = window.php.default_settings.inputs[key]
                                return (
                                  <Col key={key} sm={6}>
                                    <Form.Group className="mb-0" controlId={key}>
                                      <Form.Check type="checkbox" label={input.label} checked={get(this.state, `currentSettings.inputs.${key}.checked`, (input.default || false))} onChange={(event) => this.handleSettingsChange({ parent: 'inputs', id: key }, {action: 'check', value: event.target.checked })} />
                                    </Form.Group>
                                  </Col>
                                )
                              })
                            }
                          </Row>

                        </Modal.Body>
                      </Modal>
                      <Button variant="link" className="text-danger py-0" onClick={this.deletePP}>
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
                    <div>
                      {
                          this.state.currentContent ? this.state.currentContent.map(
                            medicament =>
                            <PPCard
                              key={medicament.codeCIS}
                              medicament={medicament}
                              customSettings={this.state.customSettings}
                              setCustomData={this.handleCustomDataChange}deleteLine={this.deleteLine}
                            />
                          ) : null
                      }
                      <Search
                        alert={this.props.alert}
                        modal={false}
                        multiple={false}
                        onSave={this.addToPP}
                        type="cis"
                          url={window.php.routes.api.bdpm.search}
                        />
                    </div>
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
