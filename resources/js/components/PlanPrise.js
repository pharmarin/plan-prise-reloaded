import React, { Component } from 'react';

import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

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
  }

  addToPP = (event) => {
    console.log(event.params.data)
    let medicament = {
          codeCIS: event.params.data.id,
          denomination: event.params.data.text,
          data: null
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
      }
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
              this.state.currentContent ? <PPTable data={this.state.currentContent} /> : null
            }
            <Search
              modal={false}
              multiple={false}
              onSave={(values) => {
                console.log(values)
              }}
              type="cis"
              url={API_URL}
              />
          </div>
        )
    }
  }

  render() {
    return (
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
    );
  }
}
