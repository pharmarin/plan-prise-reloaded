import React from 'react';
import { Button, Card } from 'react-bootstrap';

import PPInput from './PPInput';
import { inputs } from './inputs';
import { SPINNER } from '../params';

export default class PPCard extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }

  isLoading = () => {
    return this.props.medicament.data === null
  }

  render () {
    let medicament = this.props.medicament
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex">
          <Button variant="link" className="pl-0" onClick={() => this.setState({ isOpened: !this.state.isOpened })}>
            {
              this.state.isOpened ? <i className="far fa-caret-square-up"></i> : <i className="far fa-caret-square-down"></i>
            }
          </Button>
          <div>
            <div className="d-flex">
              <div className="text-truncate flex-fill">
                { medicament.denomination }
              </div>
              <div className="ml-1">
                { this.isLoading() ? SPINNER : null }
              </div>
            </div>
            {
              !this.isLoading(medicament) && medicament.data.bdpm && medicament.data.bdpm[0] ? <div className="text-muted"><small>{ medicament.data.bdpm[0].compositions_string }</small></div> : null
            }
          </div>
        </Card.Header>
        {
          this.isLoading(medicament) ? null :
          <Card.Body className="row">
            {
              inputs.map(
                (section) => {
                  if (!section.collapse || this.state.isOpened) {
                    return (
                      <div key={section.id} className={!this.state.isOpened && !section.collapse ? "col-md-12 d-flex justify-content-around" : section.class}>
                        {
                          section.inputs.map((input) => <PPInput key={input.id} input={input} medicament={medicament} setCustomData={this.props.setCustomData} isShowed={section.collapse ? this.state.isOpened : true} />)
                        }
                      </div>
                    )
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
