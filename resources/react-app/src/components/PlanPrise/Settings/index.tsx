import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Col,
  Modal,
  Row,
  ModalHeader,
  ModalBody,
  FormGroup,
  CustomInput,
} from 'reactstrap';
import { ceil, chunk, keys, map, get } from 'lodash';

import { setSettings } from 'store/plan-prise';
import useConfig from 'helpers/hooks/use-config';

const mapState = (state: IReduxState) => ({
  settings: get(state, 'planPrise.content.custom_settings', {}),
});

const mapDispatch = {
  setSettings,
};

const connector = connect(mapState, mapDispatch);

type SettingsProps = ConnectedProps<typeof connector> & {
  show: boolean;
  toggle?: (e: React.MouseEvent) => void;
};

const Settings = (props: SettingsProps) => {
  const { setSettings, show, toggle } = props;
  const posologies = useConfig('default.posologies');
  return (
    <Modal centered={true} isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Options</ModalHeader>
      <ModalBody>
        <h5>Colonnes à afficher</h5>
        <Row>
          {map(
            chunk(keys(posologies), ceil(posologies.length / 2)),
            (c, ckey) => (
              <Col key={ckey} sm={6}>
                {map(c, (key) => {
                  const input = posologies[key];
                  return (
                    <FormGroup key={key} className="mb-0" check>
                      <CustomInput
                        id={input.id}
                        checked={get(
                          props,
                          `settings.inputs.${input.id}.checked`,
                          input.default || false
                        )}
                        label={input.label}
                        type="switch"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setSettings({
                            id: `inputs.${input.id}.checked`,
                            value: event.currentTarget.checked,
                          });
                        }}
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
