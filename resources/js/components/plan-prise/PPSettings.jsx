import React from 'react';
import { connect } from 'react-redux';
import {
  Col,
  Form,
  Modal,
  Row
} from 'react-bootstrap';

import * as PP_ACTIONS from '../../redux/plan-prise/actions';

class PPSettings extends React.Component {
  render() {
    return (
      <Modal show={this.props.showSettings} onHide={() => this.props.setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Colonnes à afficher</h5>
          <Row>
            {
              _.chunk(
                Object.keys(window.php.default.inputs.posologies.inputs),
                _.ceil(window.php.default.inputs.posologies.inputs.length / 2)
              )
                .map((chunk, index) =>
                  <Col key={index} sm={6}>
                    {
                      chunk.map((key) => {
                        let input = window.php.default.inputs.posologies.inputs[key]
                        return (
                          <Form.Group key={key} className="mb-0" controlId={key}>
                            <Form.Check
                              type="checkbox"
                              label={input.label}
                              checked={_.get(this.props, `settings.inputs.${input.id}.checked`, (input.default || false))}
                              onChange={(event) => this.props.updateSettings(
                                { parent: 'inputs', id: input.id },
                                { action: 'check', value: event.target.checked }
                              )}
                            />
                          </Form.Group>
                        )
                      })
                    }
                  </Col>
                )
            }
          </Row>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    settings: state.planPriseReducer.settings
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSettings: (input, value) => dispatch(PP_ACTIONS.updateSettings(input, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PPSettings)
