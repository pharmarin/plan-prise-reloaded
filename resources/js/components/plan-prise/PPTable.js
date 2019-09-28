import React, { Component } from 'react';
import { Card, Form, Input } from 'react-bootstrap';
import ContentEditable from 'react-contenteditable';
import isJSON from 'is-json';

import { inputs } from './inputs';
import { SPINNER } from '../params';

export default class PPTable extends React.Component
{

  isLoading = (medicament) => {
    return medicament.data === null
  }

  renderInput = (medicament, input) => {
    let data = medicament.data[input.id],
        customData = medicament.customData ? medicament.customData[input.id] ? medicament.customData[input.id] : null : null,
        needChoice = input.multiple || (!customData && Array.isArray(data))
    if (needChoice) {
      if (data.length > 1) {
        return (
          <Form className="p-1">
            {
              data.map((item, index) => {
                return <div key={index}>
                  {
                    (input.help && item[input.help]) ? <p className="text-muted font-italic ml-4 mb-0" style={{fontSize: ".8em"}}>{item[input.help]}</p> : null
                  }
                  <Form.Check type={input.type || 'radio'} className="flex-fill" label={this.renderContentEditable(input, customData, item, needChoice)} checked={item.population === null} />
                </div>
              })
            }
          </Form>
        )
      } else {
        return this.renderContentEditable(input, customData, data[0], needChoice)
      }
    } else {
      return this.renderContentEditable(input, customData, data, needChoice)
    }
  }

  renderContentEditable = (input, customData, data, needChoice) => {
    let display = input.display ? input.display : input.id,
        html
    return (
      <div className="px-1 mb-2">
        <ContentEditable className="flex-fill" html={needChoice ? (data[display] || "") : (customData || data || "")} />
      </div>
    )
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
              <Card.Body className="row">
                {
                  inputs.map(
                    (section) =>
                    <div key={section.id} className={section.class}>
                      {
                        section.inputs.map(
                          (input) =>
                          <div key={input.id} className="flex-fill">
                            <p className="text-muted mb-0 ml-1" style={{fontSize: ".8em"}}>{input.label}</p>
                            <div className="flex-fill border border-light rounded mb-2 py-1 px-2">
                              { this.renderInput(medicament, input) }
                            </div>
                          </div>
                        )
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
