import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Col, Form, Modal, Row } from "react-bootstrap";
import ceil from "lodash/ceil";
import chunk from "lodash/chunk";
import keys from "lodash/keys";
import map from "lodash/map";
import get from "lodash/get";

import { doUpdateSettings } from "store/plan-prise/actions";

const PPSettings = (props) => {
  const { setShowSettings, showSettings, updateSettings } = props;
  return (
    <Modal show={showSettings} onHide={() => setShowSettings(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Options</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Colonnes à afficher</h5>
        <Row>
          {map(
            chunk(
              keys(window.php.default.inputs.posologies.inputs),
              ceil(window.php.default.inputs.posologies.inputs.length / 2)
            ),
            (c) => (
              <Col key={c.id} sm={6}>
                {map(c, (key) => {
                  const input =
                    window.php.default.inputs.posologies.inputs[key];
                  return (
                    <Form.Group key={key} className="mb-0" controlId={key}>
                      <Form.Check
                        checked={get(
                          props,
                          `settings.inputs.${input.id}.checked`,
                          input.default || false
                        )}
                        label={input.label}
                        type="checkbox"
                        onChange={(event) =>
                          updateSettings(
                            {
                              parent: "inputs",
                              id: input.id,
                            },
                            {
                              action: "check",
                              value: event.target.checked,
                            }
                          )
                        }
                      />
                    </Form.Group>
                  );
                })}
              </Col>
            )
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

PPSettings.propTypes = {
  setShowSettings: PropTypes.func,
  showSettings: PropTypes.bool,
  updateSettings: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    settings: state.planPrise.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateSettings: (input, value) => dispatch(doUpdateSettings(input, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PPSettings);
