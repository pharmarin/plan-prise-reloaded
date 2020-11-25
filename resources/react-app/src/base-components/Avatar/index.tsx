import React from 'react';

const Avatar: React.FC<{ firstName: string; lastName: string }> = ({
  firstName,
  lastName,
}) => {
  return (
    <img
      className="h-8 w-8 rounded-full"
      src={`https://eu.ui-avatars.com/api/?name=${firstName}+${lastName}&color=059669&background=ECFDF5`}
      alt=""
    />
  );
};

export default Avatar;
