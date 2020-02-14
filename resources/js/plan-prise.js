import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import store from './redux/store'
import PlanPrise from './components/PlanPrise';

if (document.getElementById('react-plan-prise')) {
  let app = document.getElementById('react-plan-prise');
  ReactDOM.render(
    <Provider store={store}>
      <PlanPrise {...(app.dataset)} />
    </Provider>
    , app
  );
}
