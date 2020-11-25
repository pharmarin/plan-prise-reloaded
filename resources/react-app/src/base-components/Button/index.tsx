import React from 'react';
import classNames from 'classnames';

const Button: React.FC<{
  block?: boolean;
  color: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}> = ({ block, children, color, disabled, onClick }) => {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center',
        'px-4 py-2',
        'border border-transparent rounded-md',
        'font-semibold text-xs text-white uppercase tracking-widest',
        'focus:outline-none focus:shadow-outline-gray disabled:opacity-25 transition ease-in-out duration-150',
        {
          'block w-full': block,
          'bg-gray-300 hover:bg-gray-200 active:bg-gray-400  focus:border-gray-400':
            color === 'light',
          'bg-gray-800 hover:bg-gray-700 active:bg-gray-900  focus:border-gray-900':
            color === 'gray',
          'bg-green-500 hover:bg-green-400 active:bg-green-600  focus:border-green-600':
            color === 'green',
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
