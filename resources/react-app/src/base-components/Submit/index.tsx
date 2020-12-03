import Button from 'base-components/Button';
import Spinner from 'base-components/Spinner';
import { useFormikContext } from 'formik';
import React from 'react';

const Submit: React.FC<{
  block?: boolean;
  className?: string;
  color?: Colors;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  withLoading?: boolean;
  withSpinner?: boolean;
}> = ({
  children,
  className,
  color = 'gray',
  disabled,
  withLoading,
  withSpinner,
  ...props
}) => {
  const formikContext = useFormikContext();

  const isSubmitting = formikContext ? formikContext.isSubmitting : false;

  return (
    <Button
      className={className}
      color={color}
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
