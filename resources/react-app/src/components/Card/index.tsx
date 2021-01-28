import React from 'react';
import joinClassNames from 'tools/class-names';

const Card: React.FC<
  { className?: string } & React.ComponentPropsWithRef<'div'>
> = ({ children, className, ...props }) => {
  return (
    <div
      className={joinClassNames(
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
