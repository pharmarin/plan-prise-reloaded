import React from 'react';
import { Form } from 'react-bootstrap';
import autosize from 'autosize';

export default class PPInput extends React.Component {

  componentDidMount() {
    autosize(this.textarea)
  }

  render() {
    let { input, needChoice, data, customData, codeCIS } = this.props,
        display = input.display ? input.display : input.id,
        value
    if (data || customData) {
      if (input.multiple && customData && customData[display]) {
        // Permet de récupérer les customData des commentaires (car needChoice mais on veut quand même les customData)
        value = customData[display]
      } else if (needChoice) {
        // Si needChoice -> Pas de customData
        value = data[display] || ""
      } else {
        value = customData || data || ""
      }
    } else {
      value = ""
    }
    if (input.readOnly === true) {
      return <span>{value}</span>
    }
    return (
      <Form.Control as="textarea" rows={1} className="flex-fill border-light" value={value} ref={(input) => this.textarea = input} onChange={(event) => this.props.setCustomData({ parent: input.id, child: display, id: (data ? data.id : null), readOnly: input.readOnly, multiple: input.multiple }, { action: 'value', value: event.target.value }, codeCIS)} />
    )
  }

}
