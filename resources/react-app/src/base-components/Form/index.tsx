import React from 'react';
import classNames from 'classnames';

const FormText: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={classNames('mt-1 text-xs text-gray-500', className)}>
    {children}
  </div>
);

const Form: React.FC<{
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}> & {
  Text: typeof FormText;
} = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

Form.Text = FormText;

export default Form;
