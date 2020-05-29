import React from 'react';
import { Spinner, Button } from 'reactstrap';
import { BsArrowRepeat } from 'react-icons/bs';

import styles from './index.module.scss';

type SplashScreenProps = {
  type: 'loading' | 'update';
};

export default (props: SplashScreenProps) => {
  return (
    <div
      className={`${styles.splashscreen} d-flex`}
      style={{
        height: '100vh',
        width: '100vw',
      }}
    >
      {(() => {
        switch (props.type) {
          case 'loading':
            return (
              <div className="m-auto d-flex align-items-center">
                <Spinner />
                <p className="display-1 m-0 ml-4">Chargement en cours</p>
              </div>
            );
          case 'update':
            return (
              <div className="m-auto d-flex flex-column justify-content-center">
                <p className="display-1 m-0 ml-4">
                  Une mise à jour est disponible
                </p>
                <Button
                  color="link"
                  onClick={() => window.location.reload(true)}
                >
                  <BsArrowRepeat />
                  Recharger
                </Button>
              </div>
            );
          default:
            break;
        }
      })()}
    </div>
  );
};
