import React from 'react';
import { Button, Spinner } from 'reactstrap';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';

import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const SplashScreen = ({
  button,
  message,
  type,
}: Props.Frontend.App.SplashScreen) => {
  return (
    <div
      className={`${styles.splashscreen} d-flex`}
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      <div className="m-auto d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex flex-row align-items-center m-0 ml-4">
          {type === 'load' && <Spinner />}
          {type === 'danger' && (
            <BsFillExclamationOctagonFill
              className="text-danger"
              style={{ fontSize: '10em' }}
            />
          )}
          <span className="display-1 ml-4">{message}</span>
        </div>
        {button && (
          <div className="mt-5">
            {button.path === 'refresh' ? (
              <Button
                color="light"
                onClick={() => window.location.reload(false)}
              >
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
