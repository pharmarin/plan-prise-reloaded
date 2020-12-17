import classNames from 'classnames';
import React from 'react';
import joinClassNames from 'utility/class-names';

const FormText: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={classNames('mt-1 text-xs text-gray-500', className)}>
    {children}
  </div>
);

const Form: React.FC<React.ComponentPropsWithoutRef<'form'>> & {
  Text: typeof FormText;
} = ({ children, className, ...props }) => {
  return (
    <form className={joinClassNames('space-y-4', className)} {...props}>
      {children}
    </form>
  );
};

Form.Text = FormText;

export default Form;
