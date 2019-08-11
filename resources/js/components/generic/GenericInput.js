import React from 'react';

export default class GenericInput extends React.Component {
  render () {
    var props = this.props
    if (this.props.type === 'select') {
      return (
        <select {...this.props} className={this.props.className + " form-control flex-fill mr-1"} >
          {
            Object.keys(this.props.options).map((value, i) => (
              <option key={i} value={value}>{this.props.options[value]}</option>
            ))
          }
        </select>
      )
    } else if (this.props.type === 'textarea') {
      return <textarea {...this.props} className={this.props.className + " form-control flex-fill mr-1"} ></textarea>
    } else {
      return (
        <input {...this.props} className={this.props.className + " form-control flex-fill mr-1"} />
      )
    }
  }
}
