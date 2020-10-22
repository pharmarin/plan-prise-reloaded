import React from 'react';

export default ({
  children,
  condition: conditionIsTrue,
  wrapper: ComponentWrapper,
}: {
  children: React.ReactNode;
  condition: boolean;
  wrapper: React.ComponentType;
}) => {
  if (conditionIsTrue) {
    return <ComponentWrapper>{children}</ComponentWrapper>;
  }
  return <React.Fragment>{children}</React.Fragment>;
};
