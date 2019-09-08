import React from 'react';
import ReactDOM from 'react-dom';

import PlanPrise from './PlanPrise';

export default class App extends React.Component {
  render () {
    switch (this.props.view) {
      case "PlanPrise":
        return (
          <PlanPrise {...this.props} />
        )
        break;
      default:
        return null
    }
  }
}



if (document.getElementById('react-app')) {
  let app = document.getElementById('react-app');
  ReactDOM.render(<App {...(app.dataset)} />, app);
}
