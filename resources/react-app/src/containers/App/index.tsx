import useAxios, { configure } from 'axios-hooks';
import Container from 'components/Container';
import SplashScreen from 'components/SplashScreen';
import NavigationBar from 'containers/App/Navigation/NavigationBar';
import NotificationStack from 'containers/App/NotificationStack';
import Backend from 'containers/Backend';
import Frontend from 'containers/Frontend';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import ProtectedRoute from 'containers/Utility/ProtectedRoute';
import axios from 'helpers/axios-clients';
import getConfig, { storeConfig } from 'helpers/get-config';
import LRU from 'lru-cache';
import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Sanctum } from 'react-sanctum';
import ContextProvider from './ContextProvider';

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

const App = () => {
  const [needUpdate, setNeedUpdate] = useState(false);

  const version = getConfig('version');

  const [{ loading, error, data }] = useAxios('/preload');

  useEffect(() => {
    if (!data) {
      return;
    }

    if (!version || version !== data.version) {
      if (version) {
        setNeedUpdate(true);
      }
      storeConfig(data);
    }
  }, [version, data]);

  if (error) {
    throw new Error(
      "Une erreur est survenue lors du chargement de l'application. "
    );
  }

  if (!version && loading)
    return <SplashScreen type="load" message="Chargement en cours..." />;

  return (
    <ContextProvider>
      <NotificationStack />
      <Sanctum config={sanctumConfig}>
        <Router basename="/">
          {needUpdate && (
            <SplashScreen
              type="info"
              message="Une mise à jour est disponible"
              button={{ label: 'Recharger', path: 'refresh' }}
            />
          )}
          <NavigationBar />
          <Container>
            <Switch>
              <Route path="/admin">
                <ProtectedRoute admin>
                  <ErrorBoundary returnTo="/">
                    <Suspense
                      fallback={
                        <SplashScreen
                          type="load"
                          message="Chargement du module"
                        />
                      }
                    >
                      <Backend />
                    </Suspense>
                  </ErrorBoundary>
                </ProtectedRoute>
              </Route>
              <Route path="/">
                <ErrorBoundary returnTo="/">
                  <Frontend />
                </ErrorBoundary>
              </Route>
            </Switch>
          </Container>
        </Router>
      </Sanctum>
    </ContextProvider>
  );
};

export default App;
