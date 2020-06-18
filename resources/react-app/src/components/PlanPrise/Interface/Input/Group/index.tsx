import React from 'react';
import get from 'lodash/get';
import { connect, ConnectedProps } from 'react-redux';
import { FormGroup, Label } from 'reactstrap';
import Item from '../Item';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import CatchableError from 'helpers/catchable-error';
import { castArray } from 'lodash';

const mapState = (state: ReduxState) => ({
  customData: get(state.planPrise, 'content.custom_data'),
});

const connector = connect(mapState);

type InputGroupProps = Props.InputGroup & ConnectedProps<typeof connector>;

const InputGroup = (props: InputGroupProps) => {
  const { input, customData, medicament } = props;
  const inputDefault = get(medicament, `${input.id}`, '');
  const inputName = `${medicament.type}-${medicament.id}.${input.id}`;
  let inputValue = get(customData, inputName, inputDefault);

  if (input.multiple) {
    console.log(input, inputDefault, inputValue);

    inputValue = map(inputDefault, (precaution) => {
      if (input.display === undefined)
        throw new CatchableError('Il manque une propriété pour continuer. ');
      return get(
        inputValue[input.display],
        precaution.id,
        precaution[input.display]
      );
    });
  } else {
    if (isArray(inputValue)) {
      inputValue = map(inputValue, input.display).join(input.join);
    }
    inputValue = castArray(inputValue);
  }

  return (
    <FormGroup>
      <Label>{input.label}</Label>
      {map(inputValue, (value) => (
        <Item name={inputName} multiple={input.multiple} value={value} />
      ))}
    </FormGroup>
  );
};

export default connector(InputGroup);
