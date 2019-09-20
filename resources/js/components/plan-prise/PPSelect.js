import React from 'react';

export default class PPIntro extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataPP: []
    }
  }

  handleSelect = (event, id) => {
    event.preventDefault()
    this.props.onSelect(id)
  }

  render () {
    return (
      <div>
        <div className="row text-center">
          <div className="col-md-6 offset-md-3">
            <div className="list-group">
              {
                this.state.dataPP.map((result, index) =>
                  <a
                    className="list-group-item list-group-item-action"
                    data-id={result.id}
                    href="#"
                    onClick={(event => this.handleSelect(event, -1))}
                    >
                    Plan de prise n°{result.id}
                  </a>
                )
              }
              <a
                className="list-group-item list-group-item-action list-group-item-success"
                data-id="-1"
                href="#"
                onClick={(event => this.handleSelect(event, -1))}
                >
                Créer un plan de prise
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
