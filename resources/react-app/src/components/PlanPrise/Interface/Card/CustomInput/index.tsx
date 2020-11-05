import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const CustomInput = ({ onChange, readOnly, value }: Props.CustomInput) => {
  return (
    <TextareaAutosize
      disabled={readOnly}
      className="form-control"
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default CustomInput;
