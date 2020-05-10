import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, Spinner } from 'react-bootstrap';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';
import keys from 'lodash/keys';
import includes from 'lodash/includes';

import PPInputGroup from './PPInputGroup';
import {
  doAddCustomItem,
  doRemoveLine,
} from '../../redux/plan-prise/actions';

class PPCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
    };
  }

  render() {
    const {
      details,
      denomination,
      isLoaded,
      lineId,
      needChoice,
      removeLine,
      repository,
    } = this.props;
    const { isOpened } = this.state;
    const data = get(details, 'data', null);
    const id = lineId;
    const { inputs } = repository;

    return (
      <Card className="mb-3">
        <Card.Header
          className="d-flex"
          onClick={(event) =>
            !event.target.classList.contains('prevent-toggle') &&
            data &&
            this.setState({ isOpened: !isOpened })
          }
        >
          <div
            className="d-flex flex-column flex-grow-1"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <div className="d-flex">
              <div className="text-truncate">
                {data &&
                find(data.denomination, {
                  style: 'custom_denomination',
                })
                  ? find(data.denomination, {
                      style: 'custom_denomination',
                    }).value
                  : `Chargement de ${denomination} en cours... `}
              </div>
            </div>
            {data &&
              find(data.denomination, {
                style: 'compositions',
              }) && (
                <div className="text-muted text-truncate">
                  <small>
                    {
                      find(data.denomination, {
                        style: 'compositions',
                      }).value
                    }
                  </small>
                </div>
              )}
          </div>
          <div className="d-flex flex-shrink-0 flex-column">
            {!isLoaded ? (
              <Button
                className="ml-auto"
                disabled
                size="sm"
                tabIndex="-1"
                variant="link"
              >
                <small className="mr-1">Chargement en cours</small>
                <Spinner />
              </Button>
            ) : (
              <React.Fragment>
                <Button
                  className="rounded-pill text-danger ml-auto py-0 prevent-toggle"
                  size="sm"
                  tabIndex="-1"
                  variant="light"
                  onClick={() => removeLine(id)}
                >
                  <small className="mr-1 prevent-toggle">
                    Supprimer la ligne
                  </small>
                  <i className="fa fa-trash prevent-toggle" />
                </Button>
                <Button
                  className="rounded-pill text-muted ml-auto py-0 mt-1"
                  size="sm"
                  tabIndex="-1"
                  variant="light"
                >
                  {isOpened ? (
                    <React.Fragment>
                      <small className="mr-1">
                        Masquer les détails
                      </small>
                      <i className="far fa-caret-square-up" />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <small className="mr-1">
                        Afficher les détails
                      </small>
                      <i className="far fa-caret-square-down" />
                    </React.Fragment>
                  )}
                </Button>
              </React.Fragment>
            )}
          </div>
        </Card.Header>
        {isLoaded && (
          <Card.Body className="row">
            {map(keys(inputs), (sectionKey) => {
              const section = inputs[sectionKey];
              if (!section.collapse || isOpened) {
                return (
                  <div
                    key={sectionKey}
                    className={
                      !isOpened && !section.collapse
                        ? 'col-md-12 d-flex justify-content-around'
                        : section.class
                    }
                  >
                    {map(section.inputs, (input) => (
                      <PPInputGroup
                        key={input}
                        input={input}
                        lineId={id}
                        values={details.data}
                      />
                    ))}
                  </div>
                );
              }
              const needChoiceInputs = find(section.inputs, (i) =>
                includes(needChoice, i.id),
              );
              return (
                needChoiceInputs && (
                  <div
                    key={sectionKey}
                    className="col-md-12 justify-content-around"
                  >
                    <PPInputGroup
                      input={needChoiceInputs}
                      lineId={id}
                      values={details.data}
                    />
                  </div>
                )
              );
            })}
          </Card.Body>
        )}
      </Card>
    );
  }
}

PPCard.propTypes = {
  denomination: PropTypes.string,
  details: PropTypes.shape({
    data: PropTypes.any,
  }),
  isLoaded: PropTypes.bool,
  lineId: PropTypes.number,
  needChoice: PropTypes.shape({
    includes: PropTypes.func,
  }),
  removeLine: PropTypes.func,
  repository: PropTypes.shape({
    inputs: PropTypes.any,
  }),
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCustomItem: (lineId, input) =>
      dispatch(doAddCustomItem(lineId, input)),
    removeLine: (id) => dispatch(doRemoveLine(id)),
  };
};

export default connect(null, mapDispatchToProps)(PPCard);
