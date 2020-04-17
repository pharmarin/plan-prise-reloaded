import React from "react";
import { connect } from "react-redux";
import { Redirect, Route as RouterRoute } from "react-router-dom";

import userSelector from "../../redux/user/selector";

export class PublicRoute extends React.Component {
  render() {
    return (
      <RouterRoute {...this.props}/>
    )
  }
}

class ProtectedRoute extends React.Component {

  render() {
    if (!this.props.user.isAuth) {
      console.info('Cannot access route: No token provided')
      return <Redirect to={{
        pathname: "/connexion",
        state: {
          message: "unauthorized",
          redirectTo: this.props.path
        }
      }} />
    }
    if (!this.props.user.isValid) {
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
    user: userSelector(state)
  }
}

export const Route = connect(mapStateToProps)(ProtectedRoute)