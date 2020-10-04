import React from 'react';
import { Spinner } from 'reactstrap';
import { BsFillExclamationOctagonFill } from 'react-icons/bs';

import styles from './index.module.scss';
import { Link } from 'react-router-dom';

export default ({ button, message, type }: IProps.SplashScreen) => {
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
            <Link className="btn btn-light" to={button.path}>
              {button.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
