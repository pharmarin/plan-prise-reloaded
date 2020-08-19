import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Input, FormGroup, Label } from 'reactstrap';
import { setValue } from 'store/plan-prise';
import TextareaAutosize from 'react-textarea-autosize';

const mapDispatch = { setValue };

const connector = connect(null, mapDispatch);

type InputItemProps = Props.InputItem & ConnectedProps<typeof connector>;

const InputItem = (props: InputItemProps) => {
  const { display, help, multiple, name, readOnly, setValue, value } = props;

  const handleInputChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setValue({
      id: event.currentTarget.name,
      value: event.currentTarget.value,
    });
  };

  const handleCheckboxChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue({
      id: event.currentTarget.name,
      value: event.currentTarget.checked,
    });
  };

  return (
    <FormGroup className="mb-1">
      {help && <Label className="mb-0">{help}</Label>}
      <div>
        {multiple && (
          <Input
            name={`${name}.checked`}
            type="checkbox"
            checked={props.checked}
            onChange={handleCheckboxChange}
          />
        )}
        <TextareaAutosize
          disabled={readOnly}
          name={display ? `${name}.${display}` : name}
          className="form-control"
          value={value}
          onChange={handleInputChange}
        />
      </div>
    </FormGroup>
  );
};

export default connector(InputItem);
