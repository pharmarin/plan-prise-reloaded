import Button from 'components/Button';
import Spinner from 'components/Spinner';
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
      {withSpinner && isSubmitting && <Spinner />}
      <div>{children}</div>
    </Button>
  );
};

export default Submit;
