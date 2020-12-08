import React from 'react';
import Icon from '..';

const Arrow = ({
  chevron,
  className,
  down,
  left,
  right,
  strokeWidth = 3,
  up,
}: {
  chevron?: boolean;
  className?: string;
  down?: boolean;
  left?: boolean;
  right?: boolean;
  strokeWidth?: number;
  up?: boolean;
}) => {
  const path = () => {
    if (chevron) {
      if (down) return 'M19 9l-7 7-7-7';
      if (left) return 'M15 19l-7-7 7-7';
      if (right) return 'M9 5l7 7-7 7';
      if (up) return 'M5 15l7-7 7 7';
    }
    if (down) return 'M19 14l-7 7m0 0l-7-7m7 7V3';
    if (left) return 'M10 19l-7-7m0 0l7-7m-7 7h18';
    if (right) return 'M14 5l7 7m0 0l-7 7m7-7H3';
    if (up) return 'M5 10l7-7m0 0l7 7m-7-7v18';
    return '';
  };

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
        d={path()}
      />
    </Icon>
  );
};

export default Arrow;
