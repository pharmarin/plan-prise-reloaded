import React from 'react';
import joinClassNames from 'tools/class-names';

const Title: React.FC<
  {
    color?: Colors;
    gradient?: boolean;
    level?: number;
  } & React.ComponentPropsWithoutRef<'h1'>
> = ({ children, className, color, gradient, level = 1, ...props }) => {
  return (
    <p
      className={joinClassNames(
        gradient
          ? {
              'inline-block text-gradient bg-gradient-to-r': true,
              'from-green-800  to-green-400': color === 'green',
              'from-red-800  to-red-400': color === 'red',
            }
          : {
              'text-gray-600': !color,
              'text-blue-600': color === 'blue',
              'text-green-600': color === 'green',
              'text-pink-600': color === 'pink',
              'text-purple-600': color === 'purple',
              'text-red-600': color === 'red',
              'text-yellow-600': color === 'yellow',
            },
        {
          'text-3xl mb-4': level === 1,
          'text-2xl mb-4': level === 2,
          'text-1xl mb-4': level === 3,
          'text-lg mb-4': level === 4,
          'text-sm mb-4': level === 5,
          'text-xs mb-4': level === 6,
        },
        'mb-4',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export default Title;
