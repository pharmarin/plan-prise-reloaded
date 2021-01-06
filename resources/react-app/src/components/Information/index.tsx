import Spinner from 'components/Spinner';
import React from 'react';

const Information = ({
  message,
  title,
  type,
}: {
  message?: string;
  title: string;
  type: 'loading';
}) => {
  return (
    <div className="flex flex-row space-x-4 justify-center items-center w-full h-view-80">
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
      <div className="flex flex-col space-y-4 text-gray-700">
        <div className="text-xl">{title}</div>
        {message && <div>{message}</div>}
      </div>
    </div>
  );
};

export default Information;
