import React, { Component } from 'react';

import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

import Alert from './generic/Alert';
import Search from './generic/Search';
import PPSelect from './plan-prise/PPSelect';
import PPTable from './plan-prise/PPTable';

import { API_URL } from './params';
import { getMedicamentFromCIS } from './generic/functions';

export default class PlanPrise extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      currentID: null,
      currentContent: []
    }
    this.alert = React.createRef()
  }

  addToPP = (values) => {
    let medicament = {
          ...values[0],
          data: null,
          customData: {}
        },
        content = this.state.currentContent
    content.push(medicament)
    this.setState({ currentContent: content }, this.loadDetails(medicament.codeCIS))
  }

  loadDetails = (cis) => {
    getMedicamentFromCIS(
      cis,
      (response) => {
        let newState = this.state.currentContent.map((medic) => {
          if (Number(medic.codeCIS) !== Number(cis)) return medic
          medic.data = response[0]
          return medic
        })
        this.setState({ currentContent: newState })
      },
      (response) => console.log('Error retrieving medic', response)
    )
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
      console.log(state)
      return state
    })
  }

  render() {
    return (
      <>
        <Alert ref={this.alert} />
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
                        this.state.currentContent ? <PPTable data={this.state.currentContent} setCustomData={this.handleCustomDataChange} alert={this.alert.current.addAlert} /> : null
                      }
                      <Search
                        alert={this.alert.current.addAlert}
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
      </>
    )
  }
}
