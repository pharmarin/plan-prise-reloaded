import React from 'react';
import { connect } from 'react-redux';
import { Button, Card } from 'react-bootstrap';
import _ from 'lodash';

import {
  addCustomItem, 
  removeLine
} from '../../redux/plan-prise/actions';

import PPInputGroup from './PPInputGroup';
import { SPINNER } from '../params';

class PPCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  render() {
    let { details, denomination, needChoice, repository } = this.props
    let { isOpened } = this.state
    let data = _.get(details, 'data', null)
    let id = this.props.lineId
    let inputs = repository.inputs

    return (
      <Card className="mb-3">
        <Card.Header
          className="d-flex"
          onClick={(event) => !event.target.classList.contains('prevent-toggle') && data && this.setState({ isOpened: !isOpened})}
        >
          <div className="d-flex flex-column flex-grow-1" style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <div className="d-flex">
              <div className="text-truncate">
                {
                  data && _.find(data.denomination, { style: 'custom_denomination' }) ?
                    _.find(data.denomination, { style: 'custom_denomination' }).value :
                    `Chargement de ${denomination} en cours... `
                }
              </div>
            </div>
            {
              data && _.find(data.denomination, { style: 'compositions' }) && <div className="text-muted text-truncate">
                <small>
                  {_.find(data.denomination, { style: 'compositions' }).value}
                </small>
              </div>
            }
          </div>
          <div className="d-flex flex-shrink-0 flex-column">
            {
              !this.props.isLoaded ?
                <Button
                  variant="link"
                  size="sm"
                  disabled
                  className="ml-auto"
                  tabIndex="-1"
                >
                  <small className="mr-1">Chargement en cours</small>
                  {SPINNER}
                </Button> :
                <>
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-pill text-danger ml-auto py-0 prevent-toggle"
                    onClick={() => this.props.removeLine(id)} tabIndex="-1"
                  >
                    <small className="mr-1 prevent-toggle">Supprimer la ligne</small>
                    <i className="fa fa-trash prevent-toggle"></i>
                  </Button>
                  <Button variant="light" size="sm" className="rounded-pill text-muted ml-auto py-0 mt-1" tabIndex="-1">
                    {
                      isOpened ?
                        <>
                          <small className="mr-1">Masquer les détails</small>
                          <i className="far fa-caret-square-up"></i>
                        </> :
                        <>
                          <small className="mr-1">Afficher les détails</small>
                          <i className="far fa-caret-square-down"></i>
                        </>
                    }
                  </Button>
                </>
            }
          </div>
        </Card.Header>
        {
          this.props.isLoaded && <Card.Body className="row">
            {
              Object.keys(inputs).map(
                (sectionKey) => {
                  let section = inputs[sectionKey]
                  if (!section.collapse || isOpened) {
                    return (
                      <div key={sectionKey} className={!isOpened && !section.collapse ? "col-md-12 d-flex justify-content-around" : section.class}>
                        {
                          section.inputs.map((input, i) => <PPInputGroup
                            key={i}
                            input={input}
                            lineId={id}
                            values={details.data}
                          />)
                        }
                      </div>
                    )
                  } else {
                    let needChoiceInputs = _.find(section.inputs, (i) => needChoice.includes(i.id))
                    return needChoiceInputs &&
                      <div key={sectionKey} className="col-md-12 justify-content-around">
                        <PPInputGroup
                          input={needChoiceInputs}
                          lineId={id}
                          values={details.data}
                        />
                      </div>
                  }
                }
              )
            }
          </Card.Body>
        }
      </Card>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCustomItem: (lineId, input) => dispatch(addCustomItem(lineId, input)),
    removeLine: (id) => dispatch(removeLine(id))
  }
}

export default connect(null, mapDispatchToProps)(PPCard)
