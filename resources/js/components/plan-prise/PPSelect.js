import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { SPINNER } from '../params';
import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPSelect extends React.Component {
  _handleSelect = (event, id) => {
    event.preventDefault()
    this.props.init(id)
  }

  render() {
    let { list } = this.props
    return (
      <div>
        <div className="row text-center">
          <div className="col-md-6">
            <div className="list-group">
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
          <div className="col-md-6">
            {
              list ?
                <div className="list-group">
                  <div style={{
                      maxHeight: `${this.lineMax * this.lineHeight}rem`,
                      overflow: 'scroll'
                    }}>
                    {
                      list.map((item) =>
                        <Link
                          key={item.pp_id}
                          className="list-group-item list-group-item-action"
                          to={'plan-prise/' + item.pp_id}
                          //onClick={(event => this._handleSelect(event, item.pp_id))}
                        >
                          Plan de prise n°{item.pp_id}
                        </Link>
                      )
                    }
                  </div>
                </div> :
                <div>
                  {SPINNER}
                  <span className="ml-2">Chargement de vos plans de prise...</span>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.planPriseReducer.list
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(PP_ACTIONS.init(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PPSelect)
