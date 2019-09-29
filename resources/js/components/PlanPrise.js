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
          customData: null
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

  /**
   * Switch title for Plan Prise
   * @param  {int|null} id ID in the state
   * @return {string} Title for the card
   */
  getTitle (id) {
    switch (id) {
      case -1:
        return "Nouveau Plan de Prise"
        break;
      case null:
        return "Que voulez-vous faire ? "
        break;
      default:
        return "Plan de prise n°" + id
    }
  }

  /**
   * Switch content for Plan de prise
   * @param  {int|null} id ID in the state
   * @return {Component} Component to display (Search +- Table)
   */
  getContent (id) {
    switch (id) {
      case null:
        return <PPSelect onSelect={(selectedID) => this.setState({ currentID: selectedID })} />
        break;
      default:
        return (
          <div>
            {
              this.state.currentContent ? <PPTable data={this.state.currentContent} alert={this.alert.current.addAlert} /> : null
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
        )
    }
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
                  { this.getTitle(this.state.currentID) }
                </Card.Header>

                <Card.Body>
                  { this.getContent(this.state.currentID) }
                </Card.Body>

              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}
