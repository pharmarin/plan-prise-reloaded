import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CardBody, Card, Container } from 'reactstrap';
import { Sanctum } from 'react-sanctum';
import { store, persistor } from 'store/store';
import Navigation from 'components/Navigation';
import Switch from 'components/Navigation/Switch';
import SplashScreen from './SplashScreen';
import axios from 'helpers/axios-clients';
import getConfig, { storeConfig } from 'helpers/get-config';
import CatchableError from 'helpers/catchable-error';

const sanctumConfig = {
  api_url: '',
  axios_instance: axios, // Contains base url + api path
  csrf_cookie_route: 'csrf-cookie',
  signin_route: 'login',
  signout_route: 'logout',
  user_object_route: 'user',
};

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  const config = getConfig();

  if (!isLoading && !hasLoaded) {
    if (!config) setIsLoading(true);
    axios
      .get('/preload')
      .then((response) => {
        if ((config && config.version !== response.data.version) || !config) {
          if (config) setNeedUpdate(true);
          storeConfig(response.data);
        }

        setIsLoading(false);
        setHasLoaded(true);
      })
      .catch((error) => {
        throw new CatchableError(
          "Quelque chose s'est mal déroulé.",
          error.data
        );
      });
  }

  if (isLoading) return <SplashScreen type="loading" />;
  if (needUpdate) return <SplashScreen type="update" />;

  return (
    <Provider store={store}>
      <PersistGate
        loading={<SplashScreen type="loading" />}
        persistor={persistor}
      >
        <Sanctum config={sanctumConfig}>
          <Router basename="/">
            <Navigation />
            <Container>
              <Card className="mb-4">
                <CardBody>
                  <Switch />
                </CardBody>
              </Card>
            </Container>
          </Router>
        </Sanctum>
      </PersistGate>
    </Provider>
  );
};