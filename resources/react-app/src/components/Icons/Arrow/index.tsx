import Icon from 'components/Icons';
import React from 'react';

/*const ArrowRegularSmall = ({strokeWidth, ...props}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    
  )
}*/

const ArrowRegularDownSmall = ({
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const ArrowRegularLeftSmall = ({
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const ArrowRegularRightSmall = ({
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const ArrowRegularUpSmall = ({
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const ArrowRegularDownMedium = ({
  strokeWidth,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M19 14l-7 7m0 0l-7-7m7 7V3"
      />
    </Icon>
  );
};

const ArrowRegularLeftMedium = ({
  strokeWidth,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </Icon>
  );
};

const ArrowRegularRightMedium = ({
  strokeWidth,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </Icon>
  );
};

const ArrowRegularUpMedium = ({
  strokeWidth,
  ...props
}: React.ComponentPropsWithoutRef<'svg'>) => {
  return (
    <Icon
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M5 10l7-7m0 0l7 7m-7-7v18"
      />
    </Icon>
  );
};

const Arrow = {
  Regular: {
    Down: { Medium: ArrowRegularDownMedium, Small: ArrowRegularDownSmall },
    Left: { Medium: ArrowRegularLeftMedium, Small: ArrowRegularLeftSmall },
    Right: { Medium: ArrowRegularRightMedium, Small: ArrowRegularRightSmall },
    Up: { Medium: ArrowRegularUpMedium, Small: ArrowRegularUpSmall },
  },
};

export default Arrow;
