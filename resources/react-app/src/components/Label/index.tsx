import React from 'react';
import joinClassNames from 'tools/class-names';

const Label: React.FC<{
  check?: boolean;
  className?: string;
  for?: string;
}> = ({ check, children, className, for: htmlFor }) => {
  return (
    <label
      className={joinClassNames(
        'block font-medium text-sm text-gray-700',
        {
          'ml-3': check,
        },
        className
      )}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
