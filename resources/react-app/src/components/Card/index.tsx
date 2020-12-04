import classNames from 'classnames';
import React from 'react';

const Card: React.FC<
  { className?: string } & React.ComponentPropsWithRef<'div'>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'w-full px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
