import React from 'react';
import joinClassNames from 'tools/class-names';

const FormGroup: React.FC<
  React.ComponentPropsWithoutRef<'div'> & { check?: boolean }
> = ({ check, children, className, ...props }) => {
  return (
    <div
      className={joinClassNames('flex flex-col mb-2', {
        'flex-row': check,
      })}
      {...props}
    >
      {children}
    </div>
  );
};

export default FormGroup;
