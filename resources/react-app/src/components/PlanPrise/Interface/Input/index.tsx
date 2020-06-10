import React from 'react';
import { Label, Input, FormGroup } from 'reactstrap';

export default (props: Props.Input) => {
  const { input } = props;

  return (
    <FormGroup>
      <Label>{input.label}</Label>
      <Input type="text" name={input.id} />
    </FormGroup>
  );
};
