import classNames from 'classnames';
import React from 'react';

const Search: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('h-5 w-5', className)}
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  );
};

export default Search;
