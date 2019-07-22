import React from 'react';

export default class PPIntro extends React.Component {
  render () {
    return (
      <div>
        <div className="row text-center">
          <div className="col-sm-6">
            <button
              className="btn btn-sm btn-success"
              onClick={this.props.onCreate}
              >
              Créer un plan de prise
            </button>
          </div>
          <div className="col-sm-6">
            Modifier le plan de prise n°
            <select>
              <option>1</option>
              <option>2</option>
            </select>
          </div>
        </div>
      </div>
    )
  }
}
