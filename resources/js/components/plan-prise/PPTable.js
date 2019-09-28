import React, { Component } from 'react';

import { Card, Input } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';

import { inputs } from './inputs';
import { SPINNER } from '../params';

export default class PPTable extends React.Component
{

  isLoading = (medicament) => {
    return medicament.data === null
  }

  render () {
    return (
      this.props.data.map((medicament) => {
        return (
          <Card key={medicament.codeCIS} className="mt-1">
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
              <Card.Body className="p-1">
                <div className="d-flex">
                  {
                    inputs.map((input) =>
                      <div key={input.id} className="flex-fill border border-light rounded m-1">
                        <ContentEditable html={medicament.data[input.id]} />
                      </div>
                    )
                  }
                </div>
              </Card.Body>
            }
          </Card>
        )
      })
    )
  }

}
