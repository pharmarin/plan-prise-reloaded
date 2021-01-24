import React from 'react';
import joinClassNames from 'utility/class-names';

const Button: React.FC<
  {
    block?: boolean;
    color: Colors;
    shadow?: boolean;
    size?: 'sm' | 'lg';
    unstyled?: boolean;
  } & React.ComponentPropsWithoutRef<'button'>
> = ({
  block,
  children,
  className,
  color,
  shadow,
  size,
  unstyled,
  ...props
}) => {
  return (
    <button
      className={
        unstyled
          ? className
          : joinClassNames(
              'flex flex-row items-center justify-center space-x-4',
              'border border-transparent rounded-md',
              'font-semibold text-xs text-white uppercase tracking-widest',
              'focus:outline-none focus:shadow-outline-gray disabled:opacity-25 transition ease-in-out duration-150',
              {
                'w-full': block,
                'shadow-md': shadow,
                'px-4 py-2': size !== 'sm' && size !== 'lg',
                'px-2 py-1': size === 'sm',
                'px-6 py-3': size === 'lg',
                'bg-gray-300 hover:bg-gray-200 active:bg-gray-400  focus:border-gray-400':
                  color === 'light',
                'bg-transparent text-green-600': color === 'link',
                'bg-gray-800 hover:bg-gray-700 active:bg-gray-900  focus:border-gray-900':
                  color === 'gray',
                'bg-green-500 hover:bg-green-400 active:bg-green-600  focus:border-green-600':
                  color === 'green',
                'bg-red-500 hover:bg-red-400 active:bg-red-600  focus:border-red-600':
                  color === 'red',
                'border-gray-300 bg-white hover:bg-gray-100 active:bg-gray-200  focus:border-gray-200 text-gray-600':
                  color === 'white',
              },
              className
            )
      }
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
