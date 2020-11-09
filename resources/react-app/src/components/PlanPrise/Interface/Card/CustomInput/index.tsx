import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const CustomInput = ({ onChange, readOnly, value }: Props.CustomInput) => {
  return (
    <TextareaAutosize
      className={`form-control${readOnly ? '-plaintext' : ''}`}
      disabled={readOnly}
      value={value || ''}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default CustomInput;
