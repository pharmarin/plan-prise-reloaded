import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CardBody, Card, Container } from 'reactstrap';
import { Sanctum } from 'react-sanctum';
import LRU from 'lru-cache';
import { store, persistor } from 'store/store';
import NavigationBar from 'components/App/Navigation/NavigationBar';
import Switch from 'components/App/Navigation/Switch';
import SplashScreen from './SplashScreen';
import axios from 'helpers/axios-clients';
import useConfig, { storeConfig } from 'helpers/hooks/use-config';
import NotificationStack from './NotificationStack';
import { configure } from 'axios-hooks';

const sanctumConfig = {
  api_url: '',
  axios_instance: axios, // Contains base url + api path
  csrf_cookie_route: 'csrf-cookie',
  signin_route: 'login',
  signout_route: 'logout',
  user_object_route: 'user',
};

const cache = new LRU();

configure({ axios, cache });

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [needUpdate, setNeedUpdate] = useState(false);

  const config = useConfig();

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
        console.log(error.data);
        throw new Error(
          "Une erreur est survenue lors du chargement de l'application. "
        );
      });
  }

  if (isLoading)
    return <SplashScreen type="load" message="Chargement en cours..." />;
  if (needUpdate)
    return (
      <SplashScreen
        type="info"
        message="Une mise à jour est disponible"
        button={{ label: 'Recharger', path: '/' }}
      />
    );

  return (
    <Provider store={store}>
      <PersistGate
        loading={<SplashScreen type="load" message="Chargement en cours..." />}
        persistor={persistor}
      >
        <NotificationStack />
        <Sanctum config={sanctumConfig}>
          <Router basename="/">
            <NavigationBar />
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
