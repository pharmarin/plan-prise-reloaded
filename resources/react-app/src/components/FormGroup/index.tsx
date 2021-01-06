import React from 'react';

const FormGroup: React.FC<React.ComponentPropsWithoutRef<'div'>> = ({
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>;
};

export default FormGroup;
