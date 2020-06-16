import React from 'react';
import { Label, Input, FormGroup } from 'reactstrap';
import get from 'lodash/get';
import { connect, ConnectedProps } from 'react-redux';
import useConfig from 'helpers/hooks/use-config';
import { setValue } from 'store/plan-prise';

const mapState = (state: ReduxState) => ({
  customData: get(state.planPrise, 'content.custom_data'),
});

const mapDispatch = { setValue };

const connector = connect(mapState, mapDispatch);

type InputProps = Props.Input & ConnectedProps<typeof connector>;

const InputItem = (props: InputProps) => {
  const { input, customData, medicament, setValue } = props;
  const inputDefault = get(useConfig('default.pp_inputs'), '', '');
  const inputID = `${medicament.type}-${medicament.id}.${input.id}`;
  const inputValue = get(customData, inputID, inputDefault);

  console.log(
    `${medicament.type}-${medicament.id}.${input.id}`,
    inputDefault,
    inputValue
  );

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue({
      id: inputID,
      value: event.currentTarget.value,
    });
  };

  if (customData)
    return (
      <FormGroup>
        <Label>{input.label}</Label>
        <Input
          type="text"
          name={input.id}
          value={inputValue}
          onChange={handleInputChange}
        />
      </FormGroup>
    );

  return null;
};

export default connector(InputItem);
