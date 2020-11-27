import React from 'react';
import classNames from 'classnames';

const Button: React.FC<{
  block?: boolean;
  className?: string;
  color: string;
  disabled?: boolean;
  size?: 'sm' | 'lg';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: 'button' | 'submit' | 'reset';
}> = ({ block, children, className, color, disabled, onClick, size, type }) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center',
        'border border-transparent rounded-md',
        'font-semibold text-xs text-white uppercase tracking-widest',
        'focus:outline-none focus:shadow-outline-gray disabled:opacity-25 transition ease-in-out duration-150',
        {
          'block w-full': block,
          'px-6 py-3': size !== 'sm' && size !== 'lg',
          'px-4 py-2': size === 'sm',
          'px-8 py-3': size === 'lg',
          'bg-gray-300 hover:bg-gray-200 active:bg-gray-400  focus:border-gray-400':
            color === 'light',
          'bg-gray-800 hover:bg-gray-700 active:bg-gray-900  focus:border-gray-900':
            color === 'gray',
          'bg-green-500 hover:bg-green-400 active:bg-green-600  focus:border-green-600':
            color === 'green',
          'bg-red-500 hover:bg-red-400 active:bg-red-600  focus:border-red-600':
            color === 'red',
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
