import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Input } from 'reactstrap';
import { setValue } from 'store/plan-prise';

const mapDispatch = { setValue };

const connector = connect(null, mapDispatch);

type InputItemProps = Props.InputItem & ConnectedProps<typeof connector>;

const InputItem = (props: InputItemProps) => {
  const { name, value } = props;

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    setValue({
      id: event.currentTarget.name,
      value: event.currentTarget.value,
    });
  };

  return (
    <Input type="text" name={name} value={value} onChange={handleInputChange} />
  );
};

export default connector(InputItem);
