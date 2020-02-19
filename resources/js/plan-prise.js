import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import App from './components/App';

if (document.getElementById('react-plan-prise')) {
  let app = document.getElementById('react-plan-prise');
  ReactDOM.render(
    <App/>
    , app
  );
}
