import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { CardBody, Card, Container } from 'reactstrap';
import { store, persistor } from 'store/store';
import Navigation from 'components/Navigation';
import Switch from 'components/Navigation/Switch';

class App extends React.Component {
  render() {
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
  }
}

export default App;
