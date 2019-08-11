import React, { Component } from 'react';

import axios from 'axios';

import Recherche from './Recherche';
import PPIntro from './plan-prise/PPIntro';
import PPTable from './plan-prise/PPTable';

export default class PlanPrise extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      currentID: null,
      currentContent: null
    }
    this.handleSelect = this.handleSelect.bind(this)
    this.createPlanPrise = this.createPlanPrise.bind(this)
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
        return <PPIntro onCreate={this.createPlanPrise} />
        break;
      default:
        return (
          <div>
            <Recherche onChange={this.handleSelect} />
            {
              this.state.currentContent ? <PPTable /> : null
            }
          </div>
        )
    }
  }

  /**
   * Handle selection of an option in the search select
   * @param  {string} selectedOption Selected option by the client
   * @param  {string} action Action dispatched by React-Select
   * @return {null} Update state to display the change
   */
  handleSelect (selectedOption, action) {
    if (action.action === "select-option") {
      this.setState({
        loading: true
      }, () => {
        axios.post('plan-prise', {
          id: this.state.currentID,
          data: selectedOption
        })
        .then((response) => {
          console.log(response)
        })
      })
    }
  }

  /**
   * Create a new Plan de prise localy
   * @return {state} Set the currentID state to -1 when creating a new Plan de prise -> the server will return the new ID after the first adding
   */
  createPlanPrise () {
    this.setState({
      currentID: -1
    })
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">

              <div className="card-header">
                { this.getTitle(this.state.currentID) }
              </div>

              <div className="card-body">
                { this.getContent(this.state.currentID) }
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}
