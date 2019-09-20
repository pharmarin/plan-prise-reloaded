import React from 'react';
import ReactDOM from 'react-dom';

import PlanPrise from './components/PlanPrise';

if (document.getElementById('react-plan-prise')) {
  let app = document.getElementById('react-plan-prise');
  ReactDOM.render(<PlanPrise {...(app.dataset)} />, app);
}
