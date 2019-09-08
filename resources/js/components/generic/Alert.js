import React from 'react';

export default class Alert extends React.Component {

  render () {
    if (!this.props.alert) return null
    return this.props.alert.map((alert) => {
      if (alert.message === "") return null
      return (
        <div key={Math.random()} className={"alert alert-" + alert.type}>
            <button type="button" className="close" data-dismiss="alert">x</button>
            {
              alert.message
            }
        </div>
      )
    })
  }

}
