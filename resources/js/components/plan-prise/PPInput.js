import React from 'react';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import autosize from 'autosize';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPInput extends React.Component {

  componentDidMount() {
    autosize(this.textarea)
  }

  render() {
    let { input, needChoice, data, customData, lineId } = this.props
    let display = input.display ? input.display : input.id
    let value
    let isSpan = input.readOnly && needChoice

    if (data || customData) {
      if (input.multiple && customData && customData[display]) {
        // Permet de récupérer les customData des commentaires (car needChoice mais on veut quand même les customData)
        value = customData[display]
      } else if (needChoice) {
        // Si needChoice -> Pas de customData
        value = data[display] || ""
      } else {
        value = customData || data || ""
        if (typeof value === 'object' && value !== null) value = value[display]
      }
    } else {
      value = ""
    }

    if (isSpan) return <span>{ value }</span>

    return (
      <Form.Control
        as="textarea" rows={1}
        className="flex-fill"
        disabled={input.readOnly}
        value={value}
        ref={(input) => this.textarea = input}
        onChange={(event) =>
          this.props.updateLine(lineId, { type: 'value', value: event.target.value }, { parent: input.id, child: display, id: (data ? data.id : null), readOnly: input.readOnly, multiple: input.multiple })
        }
      />
    )
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (lineId, action, input) => dispatch(PP_ACTIONS.updateLine(lineId, action, input))
  }
}

export default connect(null, mapDispatchToProps)(PPInput)
