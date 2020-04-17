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
      console.info('Cannot access route: No token provided', this.props.path)
      let redirectTo = this.props.path
      return <Redirect to={{
        pathname: "/connexion",
        state: {
          message: "unauthorized",
          redirectTo
        }
      }} />
    }
    if (!this.props.user.isValid) {
      console.info('Cannot access route: Token expired', this.props.path)
      let redirectTo = this.props.path
      return <Redirect to={{
        pathname: "/connexion",
        state: {
          message: "expired",
          redirectTo
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