import React from 'react';
import { connect } from 'react-redux';
import { Form, FormCheck } from 'react-bootstrap';
import PPInput from './PPInput';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPInputMultiple extends React.Component {
  render() {
    let { input, needChoice, item, lineId, currentCustomData } = this.props
    let customItemData = item.id && currentCustomData && currentCustomData[item.id] ? currentCustomData[item.id] : null
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
                  onChange={(event) => this.props.updateLine(
                    lineId,
                    {
                      type: input.multiple ? 'check' : 'choose',
                      value: input.multiple ? event.target.checked : item[input.choose]
                    },
                    {
                      parent: input.id,
                      id: item.id,
                      multiple: input.multiple
                    },
                    {
                      type: input.multiple ? 'check' : 'choose',
                      value: input.multiple ? event.target.checked : item[input.choose]
                    }
                  )}
                />
                <FormCheck.Label className="d-flex">
                  <PPInput
                    isShowed={this.props.isShowed}
                    lineId={lineId}
                    currentCustomData={customItemData}
                    data={item}
                    input={input}
                    needChoice={needChoice}
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

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (lineId, action, input) => dispatch(PP_ACTIONS.updateLine(lineId, action, input))
  }
}

export default connect(null, mapDispatchToProps)(PPInputMultiple)
