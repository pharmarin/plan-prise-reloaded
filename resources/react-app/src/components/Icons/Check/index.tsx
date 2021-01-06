import Icon from 'components/Icons';
import React from 'react';

const Check: React.FC<React.ComponentPropsWithoutRef<'svg'>> = ({
  className,
  strokeWidth = 2,
}) => {
  return (
    <Icon
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 13l4 4L19 7"
      />
    </Icon>
  );
};

export default Check;
