import React from 'react';
import ReactDOM from 'react-dom';

import Medicament from './components/Medicament';

if (document.getElementById('react-medicament')) {
  let app = document.getElementById('react-medicament');
  ReactDOM.render(<Medicament {...(app.dataset)} />, app);
}
