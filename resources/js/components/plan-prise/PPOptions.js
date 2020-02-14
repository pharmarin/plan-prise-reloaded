import React from 'react';
import { connect } from 'react-redux';
import {
  Col,
  Form,
  Modal,
  Row
} from 'react-bootstrap';

const PPOptions = (props) => {
  return (
    <Modal show={props.showOptions} onHide={props.setShowOptions(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Colonnes à afficher</h5>
        <Row>
          {
            Object.keys(window.php.default.inputs.posologies.inputs).map((key) => {
              let input = window.php.default.inputs.posologies.inputs[key]
              return (
                <Col key={input.id} sm={6}>
                  <Form.Group className="mb-0" controlId={key}>
                    <Form.Check
                      type="checkbox"
                      label={input.label}
                      checked={_.get(props, `settings.inputs.${input.id}.checked`, (input.default || false))}
                      onChange={(event) => props.updateSettings(
                        { parent: 'inputs', id: input.id },
                        { action: 'check', value: event.target.checked }
                      )}
                    />
                  </Form.Group>
                </Col>
              )
            }
            )
          }
        </Row>
      </Modal.Body>
    </Modal>
  )
}

const mapStateToProps = (state) => {
  return {
    settings: state.planPriseReducer.settings
  }
}

export default connect(mapStateToProps)(PPOptions)
