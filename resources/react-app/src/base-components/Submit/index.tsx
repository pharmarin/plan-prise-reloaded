import Button from 'base-components/Button';
import Spinner from 'base-components/Spinner';
import { useFormikContext } from 'formik';
import React from 'react';

const Submit: React.FC<{
  block?: boolean;
  className?: string;
  color?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  withLoading?: boolean;
  withSpinner?: boolean;
}> = ({
  children,
  className,
  color,
  disabled,
  withLoading,
  withSpinner,
  ...props
}) => {
  const formikContext = useFormikContext(),
    isSubmitting = formikContext.isSubmitting;

  return (
    <Button
      className={className}
      color={color || 'gray'}
      disabled={disabled ? disabled : withLoading ? isSubmitting : false}
      type="submit"
      {...props}
    >
      {withSpinner && isSubmitting && <Spinner className="mr-3" />}
      {children}
    </Button>
  );
};

export default Submit;
