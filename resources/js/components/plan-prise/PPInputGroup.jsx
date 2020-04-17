import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, FormCheck } from 'react-bootstrap';
import autosize from 'autosize';
import _ from 'lodash';

import { updateLine } from '../../redux/plan-prise/actions';

class PPInput extends React.Component {

  componentDidMount() {
    autosize(this.textarea)
  }

  render() {
    let { input, lineId } = this.props
    let value = _.isObject(this.props.value) ? this.props.value.value : this.props.value
    let help = _.get(this.props.value, 'help', null)

    return (
      <>
        <Form.Text className="text-muted font-italic" style={{ fontSize: ".8em" }}>{ help }</Form.Text>
        <Form.Control
          as="textarea" rows={1}
          className="flex-fill"
          disabled={input.readOnly}
          value={value || ""}
          ref={(input) => this.textarea = input}
          onChange={(event) =>
            this.props.updateLine(
              lineId,
              {
                type: 'value',
                value: event.target.value
              }, {
                parent: _.get(this.props.value, 'addedData', false) ? 'custom_' + input.id : input.id,
                child: _.get(this.props.value, 'addedData', false) ? 'custom_' + input.id : input.display,
                id: _.get(this.props, 'value.id', null),
                readOnly: input.readOnly,
                multiple: input.multiple
              }
            )
          }
        />
      </>
    )
  }
}

class PPInputBase extends React.Component {
  render() {
    return (
      <div>
        <p className="text-muted mb-0 ml-1" style={{ fontSize: ".8em" }}>
          {this.props.input.label}
        </p>
        {this.props.children}
      </div>
    )
  }
}

class PPInputGroup extends React.Component {

  render() {
    let { values, ...otherProps } = this.props
    let { input, lineId } = otherProps
    let inputValue = values[this.props.input.id]

    if (_.isArray(inputValue)) {
      return <PPInputBase input={input}>
        {[
          ...inputValue.map((inputVal, index) =>
            <Form.Group key={index}>
              <Form.Check className="flex-fill mb-2">
                <FormCheck.Input
                  type={input.multiple ? 'checkbox' : 'radio'}
                  checked={inputVal.checked}
                  style={inputVal.help ? { marginTop: '1.8em' } : null}
                  onChange={(event) => this.props.updateLine(
                    lineId,
                    {
                      type: input.multiple ? 'check' : 'choose',
                      value: input.multiple ? event.target.checked : inputVal.choose
                    },
                    {
                      parent: inputVal.addedData ? 'custom_' + input.id : input.id,
                      id: inputVal.id,
                      multiple: input.multiple
                    }
                  )}
                />
                <FormCheck.Label key={index} className="d-flex flex-column">
                  <PPInput value={inputVal} {...otherProps} />
                </FormCheck.Label>
              </Form.Check>
            </Form.Group>
          ),
          input.multiple && <Button key={-1} variant="link" onClick={() => this.props.addCustomItem(id, input.id)}>Nouvelle ligne</Button>
        ]}
      </PPInputBase>
    } else {
      return <PPInputBase input={input}>
        <Form.Group>
          <PPInput value={inputValue} {...otherProps} />
        </Form.Group>
      </PPInputBase>
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (lineId, action, input) => dispatch(updateLine(lineId, action, input))
  }
}

export default connect(null, mapDispatchToProps)(PPInputGroup)
