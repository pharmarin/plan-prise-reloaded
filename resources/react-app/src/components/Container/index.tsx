import React from 'react';

const Container: React.FC = ({ children }) => {
  return <div className="container mx-auto pt-6">{children}</div>;
};

export default Container;
