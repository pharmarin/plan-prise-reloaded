import React from 'react';
import Icon from '..';

const Search: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      className={className}
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
    </Icon>
  );
};

export default Search;
