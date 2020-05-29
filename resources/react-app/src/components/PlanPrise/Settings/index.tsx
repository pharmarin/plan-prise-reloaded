import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Col,
  Modal,
  Row,
  ModalHeader,
  ModalBody,
  FormGroup,
  Input,
} from 'reactstrap';
import ceil from 'lodash/ceil';
import chunk from 'lodash/chunk';
import keys from 'lodash/keys';
import map from 'lodash/map';
import get from 'lodash/get';

import { updateSettings } from 'store/plan-prise/actions';
import getConfig from 'helpers/get-config';

const mapState = (state: ReduxState) => ({
  settings: state.planPrise.settings,
});

const mapDispatch = {
  updateSettings,
};

const connector = connect(mapState, mapDispatch);

type SettingsProps = ConnectedProps<typeof connector> & {
  show: boolean;
  toggle: () => boolean;
};

const Settings = (props: SettingsProps) => {
  const { show, toggle, updateSettings } = props;
  const { pp_inputs: inputs } = getConfig('default');
  return (
    <Modal show={show} onHide={toggle}>
      <ModalHeader toggle={toggle}>Options</ModalHeader>
      <ModalBody>
        <h5>Colonnes à afficher</h5>
        <Row>
          {map(
            chunk(
              keys(inputs.posologies.inputs),
              ceil(inputs.posologies.inputs.length / 2)
            ),
            (c, ckey) => (
              <Col key={ckey} sm={6}>
                {map(c, (key) => {
                  const input = inputs.posologies.inputs[key];
                  return (
                    <FormGroup key={key} className="mb-0" controlId={key} check>
                      <Input
                        checked={get(
                          props,
                          `settings.inputs.${input.id}.checked`,
                          input.default || false
                        )}
                        label={input.label}
                        type="checkbox"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          updateSettings(
                            {
                              parent: 'inputs',
                              id: input.id,
                            },
                            {
                              action: 'check',
                              value: event.target.checked,
                            }
                          )
                        }
                      />
                    </FormGroup>
                  );
                })}
              </Col>
            )
          )}
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default connector(Settings);
