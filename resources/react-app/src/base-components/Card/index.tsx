import React from 'react';

const Card: React.FC = ({ children }) => {
  return (
    <div className="p-5 bg-white border border-gray-300 rounded-lg shadow">
      {children}
    </div>
  );
};

export default Card;
