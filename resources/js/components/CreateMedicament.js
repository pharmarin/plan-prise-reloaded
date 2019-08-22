import React from 'react';
import ReactDOM from 'react-dom';

import { inputs } from './medicament/inputs';
import MedicamentForm from './medicament/MedicamentForm';

export default class CreateMedicament extends React.Component {
  render () {
      return <MedicamentForm inputs={inputs} {...this.props} />
  }
}

if (document.getElementById('react-create-medicament')) {
  let app = document.getElementById('react-create-medicament');
  ReactDOM.render(<CreateMedicament {...(app.dataset)} />, app);
}
