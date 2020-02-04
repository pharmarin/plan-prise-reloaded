import React from 'react';
import { Form, FormCheck } from 'react-bootstrap';
import PPInput from './PPInput';

export default class PPInputMultiple extends React.Component {
  render() {
    let { input, needChoice, item, lineId, customData } = this.props
    let customItemData = item.id && customData && customData[item.id] ? customData[item.id] : null
    let customItemChecked = customItemData && customItemData.checked !== undefined ? customItemData.checked : item.population === null

    return (
      <div>
        {
          (input.help && item[input.help]) ? <p className="text-muted font-italic ml-4 mb-0" style={{ fontSize: ".8em" }}>{item[input.help]}</p> : null
        }
        <Form>
          <Form.Check
            type={input.multiple ? 'checkbox' : 'radio'}
            className="flex-fill mb-2"
            children={
              <>
                <FormCheck.Input
                  type={input.multiple ? 'checkbox' : 'radio'}
                  checked={customItemChecked}
                  onChange={(event) => this.props.setCustomData(
                    {
                      parent: input.id,
                      id: item.id,
                      multiple: input.multiple
                    },
                    {
                      action: input.multiple ? 'check' : 'choose',
                      value: input.multiple ? event.target.checked : item[input.choose]
                    },
                    lineId
                  )}
                />
                <FormCheck.Label className="d-flex">
                  <PPInput
                    isShowed={this.props.isShowed}
                    lineId={lineId}
                    customData={customItemData}
                    data={item}
                    input={input}
                    needChoice={needChoice}
                    setCustomData={this.props.setCustomData}
                  />
                </FormCheck.Label>
              </>
            }
          />
        </Form>
      </div>
    )
  }
}
