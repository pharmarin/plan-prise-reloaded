import React from 'react';
import classNames from 'classnames';

const Label: React.FC<{ check?: boolean; for?: string }> = ({
  check,
  children,
  for: htmlFor,
}) => {
  return (
    <label
      className={classNames('block font-medium text-sm text-gray-700', {
        'ml-3': check,
      })}
      htmlFor={htmlFor}
    >
      {children}
    </label>
  );
};

export default Label;
