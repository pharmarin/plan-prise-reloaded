import React from 'react';
import classNames from 'classnames';

const Card: React.FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div
      className={classNames(
        'w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;
