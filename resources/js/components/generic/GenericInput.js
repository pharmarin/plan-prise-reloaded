import React from 'react';

import TextareaAutosize from 'react-autosize-textarea';

export default class GenericInput extends React.Component {
  render () {
    let defaultDivClassName = " flex-fill px-0 pb-1"
    let defaultInputClassName = "form-control mr-1"
    if (this.props.type === 'select') {
      return (
        <div className={[this.props.className + defaultDivClassName]}>
          <select {...this.props} className={defaultInputClassName}>
            {
              Object.keys(this.props.options).map((value, i) => (
                <option key={i} value={value}>{this.props.options[value]}</option>
              ))
            }
          </select>
        </div>
      )
    } else if (this.props.type === 'textarea') {
      return (
        <div className={[this.props.className + defaultDivClassName]}>
          <TextareaAutosize {...this.props} className={defaultInputClassName}></TextareaAutosize>
            <button type="button" className="btn btn-link p-0" data-toggle="modal" data-target="#helpModal">
              <small className="form-text text-muted">
              Aide sur le fonctionnement du champ de texte
              </small>
            </button>
        </div>
      )
    } else {
      return (
        <div className={[this.props.className + defaultDivClassName]}>
          <input {...this.props} className={defaultInputClassName}/>
        </div>
      )
    }
  }
}
