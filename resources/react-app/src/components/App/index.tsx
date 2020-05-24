import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CardBody, Card, Container, Spinner } from 'reactstrap';
import { store, persistor } from 'store/store';
import Navigation from 'components/Navigation';
import Switch from 'components/Navigation/Switch';
import axios from 'helpers/axios-clients';

export default () => {
  const [isLoading, setIsLoading] = useState(false);

  let config;
  try {
    config = JSON.parse(localStorage.getItem('pharmarin.config') || '');
  } catch (error) {
    console.log('Could not get localStorage config');
  }

  if (!config && !isLoading) {
    setIsLoading(true);
    axios.get('/preload').then((response) => {
      localStorage.setItem('pharmarin.config', JSON.stringify(response.data));
      setIsLoading(false);
    });
  }

  if (isLoading)
    return (
      <div className="d-flex" style={{ height: '100vh', width: '100vw' }}>
        <div className="m-auto d-flex align-items-center">
          <Spinner />
          <p className="display-1 m-0 ml-4">Chargement en cours</p>
        </div>
      </div>
    );

  return (
    <Provider store={store}>
      <PersistGate loading="Chargement en cours" persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};
