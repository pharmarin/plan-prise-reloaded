import React from 'react';
import joinClassNames from 'utility/class-names';

const Icon: React.FC<React.ComponentPropsWithoutRef<'svg'>> = ({
  children,
  className,
  strokeWidth = 3,
  ...props
}) => {
  return (
    <svg
      className={joinClassNames('h-5 w-5 inline-block', className)}
      strokeWidth={strokeWidth}
      {...props}
    >
      {children}
    </svg>
  );
};

export default Icon;
