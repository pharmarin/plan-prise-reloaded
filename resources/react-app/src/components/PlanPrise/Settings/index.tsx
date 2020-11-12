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
import { ceil, chunk, get } from 'lodash-es';

import { setSettings } from 'store/plan-prise';
import useConfig from 'helpers/hooks/use-config';

const mapState = (state: Redux.State) => ({
  settings: state.planPrise.content.data?.custom_settings || {},
});

const mapDispatch = {
  setSettings,
};

const connector = connect(mapState, mapDispatch);

type SettingsProps = ConnectedProps<typeof connector> & {
  show: boolean;
  toggle?: (e: React.MouseEvent) => void;
};

const Settings = ({ settings, setSettings, show, toggle }: SettingsProps) => {
  const posologies = useConfig('default.posologies');

  return (
    <Modal centered={true} isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle}>Options</ModalHeader>
      <ModalBody>
        <h5>Colonnes à afficher</h5>
        <Row>
          {chunk(Object.keys(posologies), ceil(posologies.length / 2)).map(
            (c, ckey) => (
              <Col key={ckey} sm={6}>
                {c.map((key) => {
                  const input = posologies[key];
                  return (
                    <FormGroup key={key} className="mb-0" check>
                      <CustomInput
                        id={input.id}
                        checked={get(
                          settings,
                          `inputs.${input.id}.checked`,
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
