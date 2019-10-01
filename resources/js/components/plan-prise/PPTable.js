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
        customData = medicament.customData && medicament.customData[input.id] ? medicament.customData[input.id] : null,
        needChoice = input.multiple || (!customData && Array.isArray(data)),
        codeCIS = medicament.codeCIS
    if (input.multiple || (needChoice && data.length > 1)) {
      return (
        <div className="p-1">
          {
            data.map((item, index) => {
              let customItemData = item.id && customData && customData[item.id] ? customData[item.id] : null,
              customItemChecked = customItemData && customItemData.checked !== undefined ? customItemData.checked : item.population === null
              return <div key={index}>
                {
                  (input.help && item[input.help]) ? <p className="text-muted font-italic ml-4 mb-0" style={{fontSize: ".8em"}}>{item[input.help]}</p> : null
                }
                <Form>
                  <Form.Check type={input.multiple ? 'checkbox' : 'radio'} className="flex-fill mb-2" label={this.renderContentEditable(
                      { input: input, needChoice: needChoice },
                      { customData: customItemData, data: item, codeCIS: codeCIS }
                    )} checked={customItemChecked} onChange={(event) => this.props.setCustomData({ parent: input.id, child: input.display, id: item.id }, { action: 'check', value: event.target.checked }, codeCIS)} />
                </Form>
              </div>
            })
          }
        </div>
      )
    } else {
      return this.renderContentEditable(
          { input: input, needChoice: needChoice },
          { customData: customData, data: (needChoice ? data[0] : data), codeCIS: codeCIS }
        )
    }
  }

  renderContentEditable = (inputProperties, dataObject) => {
    let input = inputProperties.input,
        needChoice = inputProperties.needChoice,
        data = dataObject.data,
        customData = dataObject.customData,
        codeCIS = dataObject.codeCIS,
        display = input.display ? input.display : input.id,
        html
    if (data || customData) {
      if (input.multiple && customData && customData[display]) {
        // Permet de récupérer les customData des commentaires (car needChoice mais on veut quand même les customData)
        html = customData[display]
      } else if (needChoice) {
        // Si needChoice -> Pas de customData
        html = data[display] || ""
      } else {
        html = customData || data || ""
      }
    } else {
      html = ""
    }
    if (input.readOnly === true) {
      return <span>{ html }</span>
    }
    return (
      <ContentEditable className="flex-fill" html={html} onChange={(event) => this.props.setCustomData({ parent: input.id, child: display, id: (data ? data.id : null), readOnly: input.readOnly }, { action: 'value', value: event.target.value }, codeCIS)} />
    )
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
                        section.inputs.map(
                          (input) => {
                            console.log(medicament.data[input.id])
                            return !(input.readOnly && (!medicament.data[input.id] || medicament.data[input.id].length === 0)) ? (
                                <div key={input.id} className="flex-fill">
                                  <p className="text-muted mb-0 ml-1" style={{fontSize: ".8em"}}>{input.label}</p>
                                  <div className="flex-fill border border-light rounded mb-2 py-1 px-2">
                                    { this.renderInput(medicament, input) }
                                  </div>
                                </div>
                              ) : null
                          }
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
