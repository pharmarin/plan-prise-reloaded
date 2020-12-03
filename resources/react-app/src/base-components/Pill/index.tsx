import classNames from 'classnames';
import React from 'react';

const Pill: React.FC<
  { color: Colors } & React.ComponentPropsWithoutRef<'div'>
> = ({ children, color, ...props }) => {
  return (
    <div
      className={classNames(
        'rounded-full flex align-middle justify-center p-1 bg-opacity-90 text-white text-xs',
        {
          'bg-green-400': color === 'green',
          'bg-red-400': color === 'red',
        }
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Pill;
