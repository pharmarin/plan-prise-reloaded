import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

import alertManager from './generic/Alert';
import Search from './generic/Search';
import PPSelect from './plan-prise/PPSelect';
import PPTable from './plan-prise/PPTable';

import MESSAGES from './messages.js';
import { API_URL } from './params';
import { managePP } from './generic/functions';

class PlanPrise extends React.Component {

  constructor (props) {
    super(props)
    this.state = this.initStateWithProps(props)
  }

  initStateWithProps = (props) => {
    let defaultState = {
      loading: false,
      currentID: null,
      currentContent: []
    }
    if (props.currentpp) {
      let currentpp = JSON.parse(props.currentpp)
      defaultState.currentID = currentpp.pp_id
      defaultState.currentContent =  currentpp.medic_data_detail.map((medicament) => {
        medicament.custom_data.bdpm = [medicament.data]
        return {
          codeCIS: medicament.data.code_cis,
          denomination: medicament.data.denomination,
          data: medicament.custom_data,
          customData: currentpp.custom_data[medicament.data.code_cis] || {}
        }
      })
    }
    return defaultState
  }

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

  saveModification = () => {
    this.apiCall ? clearTimeout(this.apiCall) : null
    let modifications = this.state.currentContent.reduce((request, medic) => {
      let customData = medic.customData
      if (Object.keys(customData).length > 0) {
        return Object.assign(request, { [medic.codeCIS]: customData })
      } else {
        return request
      }
    }, {})
    this.apiCall = setTimeout(() => {
      let alert = this.props.alert.addAlert({
        body: MESSAGES.planPrise.editPP
      })
      managePP(
        this.state.currentID,
        {
          action: 'edit',
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
      state.currentContent.map((medicament) => {
        if (medicament.codeCIS === codeCIS) {
          let parent = input.parent,
              child = input.child,
              id = input.id
          if (parent === "precautions") {
            let commentaires = medicament.customData[parent] || {}
            if (value.action === "value") {
              commentaires[id] = {
                ...commentaires[id],
                commentaire: value.value
              }
            } else if (value.action === "check") {
              commentaires[id] = {
                ...commentaires[id],
                checked: value.value
              }
            }
            medicament.customData[parent] = commentaires
          } else {
            medicament.customData[parent] = value.value
          }
          return medicament
        } else {
          return medicament
        }
      })
      this.saveModification()
      return state
    })
  }

  render () {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col xl={8}>
            <Card>

              <Card.Header>
                {
                  this.state.currentID === -1 ? "Nouveau Plan de Prise" : this.state.currentID === null ? "Que voulez-vous faire ? " : "Plan de prise n°" + this.state.currentID
                }
              </Card.Header>

              <Card.Body>
                {
                  this.state.currentID === null ?
                  <PPSelect onSelect={(selectedID) => this.setState({ currentID: selectedID })} /> :
                  <div>
                    {
                      this.state.currentContent ? <PPTable data={this.state.currentContent} setCustomData={this.handleCustomDataChange} /> : null
                    }
                    <Search
                      alert={this.props.alert}
                      modal={false}
                      multiple={false}
                      onSave={this.addToPP}
                      type="cis"
                      url={API_URL}
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
