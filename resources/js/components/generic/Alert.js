import React from 'react';

export default class Alert extends React.Component {

  render () {
    return (
      <div className={"alert alert-" + this.props.type}>
          <button type="button" className="close" data-dismiss="alert">x</button>
          {
            this.props.message
          }
      </div>
    )
  }

}
