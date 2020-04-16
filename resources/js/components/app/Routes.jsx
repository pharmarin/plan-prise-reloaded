import React from "react";
import { connect } from "react-redux";
import { Redirect, Route as RouterRoute } from "react-router-dom";

import * as LOCAL_SERVICES from '../../redux/user/services.local';

export class PublicRoute extends React.Component {
  render() {
    return (
      <RouterRoute {...this.props}/>
    )
  }
}

class ProtectedRoute extends React.Component {

  render() {
    if (!this.props.token) {
      console.info('Cannot access route: No token provided')
      return <Redirect to={{
        pathname: "/connexion",
        state: {
          message: "unauthorized",
          redirectTo: this.props.path
        }
      }} />
    }
    if (!LOCAL_SERVICES.isValid(this.props.token)) {
      console.info('Cannot access route: Token expired')
      return <Redirect to={{
        pathname: "/connexion",
        state: {
          message: "expired",
          redirectTo: this.props.path
        }
      }} />
    }
    return (
      <RouterRoute {...this.props}/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.userReducer.token
  }
}

export const Route = connect(mapStateToProps)(ProtectedRoute)