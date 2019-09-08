import React from 'react';
import ReactDOM from 'react-dom';
import MedicamentUpdate from './components/MedicamentUpdate';

if (document.getElementById('react-medicament-update')) {
  let app = document.getElementById('react-medicament-update');
  ReactDOM.render(<MedicamentUpdate {...(app.dataset)} />, app);
}
