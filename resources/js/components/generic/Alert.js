import React from 'react';

import { Toast } from 'react-bootstrap';

export default class Alert extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      alerts: [],
      currentTime: (new Date()).getTime()
    }
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick = () => {
    this.setState({ currentTime: (new Date()).getTime() })
  }

  addAlert = (alert) => {
    let id = Math.floor(Math.random() * 100000)
    alert.id = id
    alert.time = (new Date()).getTime()
    alert.show = false
    this.setState({
      alerts: [...this.state.alerts, alert]
    }, () => {
      this.setState((state) => {
        return {
          alerts: state.alerts.map((alert) => {
            if (alert.id === id) alert.show = true
            return alert
          })
        }
      })
    })
    return alert.id
  }

  removeAlert = (id) => {
    this.setState((state) => {
      return {
        alerts: state.alerts.map((alert) => {
          if (alert.id === id) alert.show = false
          return alert
        })
      }
    })
    setTimeout(() => this.setState((state) => {
      return {
        alerts: state.alerts.filter((alert) => alert.id !== id)
      }
    }), 500)
  }

  getTime = (diff) => {
    let hours = Math.floor(diff/(60*60*1000)),
        mins = Math.floor((diff-(hours*60*60*1000))/(60*1000)),
        secs = Math.floor((diff-(hours*60*60*1000)-(mins*60*1000))/1000)
    if (diff < 0) return null
    if (hours > 0) {
      return 'Il y a ' + hours + ' heure' + (hours > 1 ? 's' : '')
    } else if (mins > 0) {
      return 'Il y a ' + mins + ' minute' + (mins > 1 ? 's' : '')
    } else if (secs > 0) {
      return 'Il y a ' + secs + ' seconde' + (secs > 1 ? 's' : '')
    }
  }

  render () {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'fixed',
          top: 5,
          right: 5,
          width: '100%',
          zIndex: 1000
        }}
      >
        {
          this.state.alerts.map(
            (alert) =>
            <Toast key={alert.id} className="ml-auto" show={alert.show} onClose={() => this.removeAlert(alert.id)} autohide={!(alert.delay === undefined)} delay={alert.delay}>
              {
                alert.header ? <Toast.Header>
                  <strong className="mr-auto">{ alert.header }</strong>
                  <small>{ this.getTime(this.state.currentTime - alert.time) }</small>
                </Toast.Header> : null
              }
              {
                alert.body ? <Toast.Body>{ alert.body }</Toast.Body> : null
              }
            </Toast>
          )
        }
      </div>
    )
  }

}
