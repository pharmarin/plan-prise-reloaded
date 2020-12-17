import Icon from 'components/Icons';
import React from 'react';

const SingleChevronDownMedium = ({
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
        d="M19 9l-7 7-7-7"
      />
    </Icon>
  );
};

const SingleChevronLeftMedium = ({
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
        d="M15 19l-7-7 7-7"
      />
    </Icon>
  );
};

const SingleChevronRightMedium = ({
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
        d="M9 5l7 7-7 7"
      />
    </Icon>
  );
};

const SingleChevronUpMedium = ({
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
        d="M5 15l7-7 7 7"
      />
    </Icon>
  );
};

const SingleChevronDownSmall = ({
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
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const SingleChevronLeftSmall = ({
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
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const SingleChevronRightSmall = ({
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
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const SingleChevronUpSmall = ({
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
        d="M5 15l7-7 7 7"
      />
    </Icon>
  );
};

const DoubleChevronDownMedium = ({
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
        d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
      />
    </Icon>
  );
};

const DoubleChevronLeftMedium = ({
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
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </Icon>
  );
};

const DoubleChevronRightMedium = ({
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
        d="M13 5l7 7-7 7M5 5l7 7-7 7"
      />
    </Icon>
  );
};

const DoubleChevronUpMedium = ({
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
        d="M5 11l7-7 7 7M5 19l7-7 7 7"
      />
    </Icon>
  );
};

const DoubleChevronDownSmall = ({
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
        d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const DoubleChevronLeftSmall = ({
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
        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const DoubleChevronRightSmall = ({
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
        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const DoubleChevronUpSmall = ({
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
        d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </Icon>
  );
};

const Chevron = {
  Single: {
    Down: { Medium: SingleChevronDownMedium, Small: SingleChevronDownSmall },
    Left: { Medium: SingleChevronLeftMedium, Small: SingleChevronLeftSmall },
    Right: { Medium: SingleChevronRightMedium, Small: SingleChevronRightSmall },
    Up: { Medium: SingleChevronUpMedium, Small: SingleChevronUpSmall },
  },
  Double: {
    Down: { Medium: DoubleChevronDownMedium, Small: DoubleChevronDownSmall },
    Left: { Medium: DoubleChevronLeftMedium, Small: DoubleChevronLeftSmall },
    Right: { Medium: DoubleChevronRightMedium, Small: DoubleChevronRightSmall },
    Up: { Medium: DoubleChevronUpMedium, Small: DoubleChevronUpSmall },
  },
};

export default Chevron;
