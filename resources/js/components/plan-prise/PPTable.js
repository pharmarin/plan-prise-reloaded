import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import isJSON from 'is-json';

import { inputs } from './inputs';
import { SPINNER } from '../params';
import PPInput from './PPInput';

export default class PPTable extends React.Component
{

  isLoading = (medicament) => {
    return medicament.data === null
  }

  render () {
    return (
      this.props.data.map((medicament) => {
        return (
          <Card key={medicament.codeCIS} className="mb-3">
            <Card.Header>
              <div className="d-flex">
                <div className="text-truncate flex-fill">
                  { medicament.denomination }
                </div>
                <div className="ml-1">
                  { this.isLoading(medicament) ? SPINNER : null }
                </div>
              </div>
              {
                !this.isLoading(medicament) && medicament.data.bdpm && medicament.data.bdpm[0] ? <div className="text-muted"><small>{ medicament.data.bdpm[0].compositions_string }</small></div> : null
              }
            </Card.Header>
            {
              this.isLoading(medicament) ? null :
              <Card.Body className="row">
                {
                  inputs.map(
                    (section) =>
                    <div key={section.id} className={section.class}>
                      {
                        section.inputs.map((input) => <PPInput key={input.id} input={input} medicament={medicament} setCustomData={this.props.setCustomData} />)
                      }
                    </div>
                  )
                }
              </Card.Body>
            }
          </Card>
        )
      })
    )
  }

}
