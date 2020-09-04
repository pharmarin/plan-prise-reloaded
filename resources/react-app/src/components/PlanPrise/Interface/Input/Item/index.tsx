import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

const InputItem = (props: Props.InputItem) => {
  const { onChange, readOnly, value } = props;

  return (
    <TextareaAutosize
      disabled={readOnly}
      className="form-control"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default InputItem;
