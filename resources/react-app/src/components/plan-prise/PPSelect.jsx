import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import map from "lodash/map";

import { doInit } from "store/plan-prise/actions";

class PPSelect extends React.Component {
  _handleSelect = (event, id) => {
    event.preventDefault();
    const { init } = this.props;
    init(id);
  };

  render() {
    const { list } = this.props;
    return (
      <div>
        <div className="row text-center">
          <div className="col-md-6">
            <div className="list-group">
              <Link
                className="list-group-item list-group-item-action list-group-item-success"
                to="/plan-prise/nouveau"
              >
                Créer un plan de prise
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            {list ? (
              <div className="list-group">
                <div
                  style={{
                    maxHeight: `${this.lineMax * this.lineHeight}rem`,
                    overflow: "scroll",
                  }}
                >
                  {map(list, (item) => (
                    <Link
                      key={item.pp_id}
                      className="list-group-item list-group-item-action"
                      to={`/plan-prise/${item.pp_id}`}
                    >
                      Plan de prise n°
                      {item.pp_id}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
                <span className="ml-2">
                  Chargement de vos plans de prise...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

PPSelect.propTypes = {
  init: PropTypes.func,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      pp_id: PropTypes.number,
    })
  ),
};

const mapStateToProps = (state) => {
  return {
    list: state.planPrise.list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    init: (id) => dispatch(doInit(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PPSelect);
