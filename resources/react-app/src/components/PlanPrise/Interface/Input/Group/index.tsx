import React from 'react';
import get from 'lodash/get';
import { connect, ConnectedProps } from 'react-redux';
import { Button, FormGroup, Label } from 'reactstrap';
import { BsPlus } from 'react-icons/bs';
import castArray from 'lodash/castArray';
import has from 'lodash/has';
import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import map from 'lodash/map';
import uniqueId from 'lodash/uniqueId';
import CatchableError from 'helpers/catchable-error';
import Item from '../Item';
import { setValue } from 'store/plan-prise';

const mapState = (state: ReduxState) => ({
  customData: get(state.planPrise, 'content.custom_data'),
});

const mapDispatch = {
  setValue,
};

const connector = connect(mapState, mapDispatch);

type InputProperties = {
  id: string;
  checked?: boolean;
  display: string;
  help?: string;
  name: string;
  readOnly?: boolean;
  value: string;
}[];

type InputGroupProps = Props.InputGroup & ConnectedProps<typeof connector>;

const InputGroup = (props: InputGroupProps) => {
  const { input, customData, medicament, setValue } = props;
  const inputDefault = get(medicament, `${input.id}`, '');
  const inputName = `${medicament.type}-${medicament.id}.${input.id}`;
  const inputValue = get(customData, inputName, inputDefault);
  const addedCustomName = `${medicament.type}-${medicament.id}.custom_${input.id}`;
  const addedCustomValue = get(customData, addedCustomName, {});
  let inputsArray;

  if (input.multiple) {
    inputsArray = [
      ...map(inputDefault, (precaution) => {
        if (input.display === undefined)
          throw new CatchableError('Il manque une propriété pour continuer. ');
        return {
          id: precaution.id,
          checked: get(
            inputValue,
            `${precaution.id}.checked`,
            input.help ? precaution[input.help] === null : false
          ),
          display: input.display,
          help: input.help ? precaution[input.help] : undefined,
          name: `${inputName}.${precaution.id}`,
          readOnly: input.readOnly,
          value: get(
            inputValue,
            `${precaution.id}.${input.display}`,
            precaution[input.display]
          ),
        };
      }),
      /* Précautions ajoutées par l'utilisateur */
      ...map(keys(addedCustomValue), (addedCustomID) => {
        return {
          id: addedCustomID,
          checked: get(addedCustomValue, `${addedCustomID}.checked`, true),
          display: `custom_${input.id}`,
          name: `${addedCustomName}.${addedCustomID}`,
          value: get(
            addedCustomValue,
            `${addedCustomID}.custom_${input.id}`,
            ''
          ),
        };
      }),
    ] as InputProperties;
  } else {
    inputsArray = castArray({
      id: input.id,
      name: inputName,
      readOnly: input.readOnly,
      value: isArray(inputValue)
        ? map(inputValue, input.display).join(input.join)
        : inputValue,
    }) as InputProperties;
  }

  const addCustomPrecaution = () => {
    let newID;
    while (true) {
      newID = uniqueId(`custom_${input.id}_`);
      if (!has(addedCustomValue, newID)) {
        break;
      }
    }
    setValue({
      id: `${addedCustomName}.${newID}`,
      value: '',
    });
  };

  return (
    <FormGroup>
      <Label>{input.label}</Label>
      {map(inputsArray, (value) => {
        return (
          <Item
            key={value.id}
            checked={value.checked || false}
            display={value.display}
            help={value.help}
            multiple={input.multiple ? 'checkbox' : undefined}
            name={value.name}
            readOnly={value.readOnly}
            value={value.value}
          />
        );
      })}
      {input.multiple && !input.readOnly && (
        <Button color="link" onClick={() => addCustomPrecaution()}>
          <BsPlus /> Ajouter un commentaire
        </Button>
      )}
    </FormGroup>
  );
};

export default connector(InputGroup);
