import Button from 'components/Button';
import Spinner from 'components/Spinner';
import { useFormikContext } from 'formik';
import React from 'react';

const Submit: React.FC<
  {
    block?: boolean;
    color?: Colors;
    size?: 'sm' | 'lg';
    withLoading?: boolean;
    withSpinner?: boolean;
  } & React.ComponentPropsWithoutRef<'button'>
> = ({
  children,
  color = 'gray',
  disabled,
  size,
  withLoading,
  withSpinner,
  ...props
}) => {
  const formikContext = useFormikContext();

  const isSubmitting = formikContext ? formikContext.isSubmitting : false;

  return (
    <Button
      color={color}
      disabled={disabled ? disabled : withLoading ? isSubmitting : false}
      size={size}
      type="submit"
      {...props}
    >
      {withSpinner && isSubmitting && <Spinner />}
      <div>{children}</div>
    </Button>
  );
};

export default Submit;
