import Button from 'components/Button';
import Danger from 'components/Icons/Danger';
import Spinner from 'components/Spinner';
import React from 'react';
import { Link } from 'react-router-dom';

const SplashScreen = ({
  button,
  message,
  type,
}: Props.Frontend.App.SplashScreen) => {
  return (
    <div className="flex w-screen h-screen fixed top-0 bottom-0 left-0 right-0 bg-gray-100">
      <div className="m-auto flex flex-col content-center items-center max-w-5xl">
        <div className="m-0 ml-4 space-x-6 flex flex-row items-center text-gray-600 text-7xl">
          {type === 'load' && (
            <Spinner className="h-20 w-20 flex-shrink-0" strokeWidth={2} />
          )}
          {type === 'danger' && (
            <Danger className="h-20 w-20 flex-shrink-0 text-red-600" fill />
          )}
          <span className="font-light">{message}</span>
        </div>
        {button && (
          <div className="mt-10">
            {button.path === 'refresh' ? (
              <Button color="light" onClick={() => window.location.reload()}>
                {button.label}
              </Button>
            ) : (
              <Link className="btn btn-light" to={button.path}>
                {button.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
