import classNames from 'classnames';
import { Form as FormikForm } from 'formik';
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

const Form: React.FC<
  React.ComponentPropsWithoutRef<'form'> & {
    withFormik?: boolean;
  }
> & {
  Text: typeof FormText;
} = ({ children, className, withFormik, ...props }) => {
  if (withFormik) {
    return (
      <FormikForm className={joinClassNames('space-y-4', className)} {...props}>
        {children}
      </FormikForm>
    );
  }
  return (
    <form className={joinClassNames('space-y-4', className)} {...props}>
      {children}
    </form>
  );
};

Form.Text = FormText;

export default Form;
