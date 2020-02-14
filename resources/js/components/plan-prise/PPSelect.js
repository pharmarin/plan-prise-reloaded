import React from 'react';
import { connect } from 'react-redux';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dataPP: []
    }
  }

  _handleSelect = (event, id) => {
    event.preventDefault()
    this.props.init(id)
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
                    onClick={(event => this._handleSelect(event, -1))}
                    >
                    Plan de prise n°{result.id}
                  </a>
                )
              }
              <a
                className="list-group-item list-group-item-action list-group-item-success"
                data-id="-1"
                href="#"
                onClick={(event => this._handleSelect(event, -1))}
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

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(PP_ACTIONS.init(id))
  }
}

export default connect(null, mapDispatchToProps)(PPSelect)
