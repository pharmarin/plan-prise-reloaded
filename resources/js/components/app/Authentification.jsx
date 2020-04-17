import React from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import {
  Alert,
  Form,
  Button,
  Spinner
} from 'react-bootstrap';
import _ from 'lodash';

import Skeleton from '../generic/Skeleton';

import {
  login as performLogin
} from '../../redux/user/services.api';
import {
  login,
  logout
} from '../../redux/user/actions';
import userSelector from '../../redux/user/selector';

class Authentification extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isInvalid: false,
      isLoading: false
    }

    if (this.props.role === "signout") {
      this.props.logout()
    }

    if (this.props.role === "signin" && _.get(props, 'location.state.message')) {
      // Si problème de connexion (expiré ou pas connecté), 
      // on deconnecte d'abord pour être sûr de ne pas avoir
      // de doublons / mauvais token pas supprimé
      this.props.logout()
    }
  }

  _handleChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value,
      isInvalid: false
    })
  }

  _handleSignin = (e) => {
    e.preventDefault()

    this.setState({ isLoading: true })
    const { signinEmail, signinPassword } = this.state
    if (signinEmail && signinPassword) {
      performLogin(signinEmail, signinPassword).then((credentials) => {
        if (credentials) {
          this.props.login(credentials)
        } else {
          this.setState({
            isInvalid: true,
            isLoading: false
          })
        }
      })
    }
  }

  _getTitle = (role) => {
    switch (role) {
      case 'signin':
        return "Connexion"
      case 'register': 
        return "Inscription"
      default:
        return ""
    }
  }

  render() {
    let roles = ['signin', 'register']
    if (!roles.includes(this.props.role) || this.props.user.isValid) return <Redirect to={_.get(this.props, 'location.state.redirectTo', "/")}/>
    return (
      <Skeleton header={this._getTitle(this.props.role)} size={{ md: 6 }}>
        <Message status={_.get(this.props, 'location.state.message')}/>
        {
          this.props.role === 'signin' &&
            <Form onSubmit={this._handleSignin} validated={this.state.isValidated}>
              <Input
                autoComplete="username"
                help="Ne sera jamais utilisée ou diffusée."
                isInvalid={this.state.isInvalid}
                isLoading={this.state.isLoading}
                label="Adresse mail"
                name="signinEmail"
                onChange={this._handleChange}
                required
                type="email"
                value={_.get(this.state, 'signinEmail', "")}
              />
              <Input
                autoComplete="current-password"
                invalidLabel="Connexion impossible, vérifiez les informations saisies"
                isInvalid={this.state.isInvalid}
                isLoading={this.state.isLoading}
                label="Mot de passe"
                name="signinPassword"
                onChange={this._handleChange}
                required
                type="password"
                value={_.get(this.state, 'signinPassword', "")}
              />
              <Submit
                label="Se connecter"
                workingLabel="Connexion en cours"
              />
            </Form>
        }
        {
          this.props.role === 'register' && 
            <Form>
              <Form.Group controlId="registerName">
                <Form.Label>Nom</Form.Label>
                <Form.Control type="text" placeholder="Nom"/>
              </Form.Group>
              <Form.Group controlId="registerEmail">
                <Form.Label>Adresse mail</Form.Label>
                <Form.Control type="email" placeholder="Adresse mail" />
                <Form.Text className="text-muted">
                  Ne sera jamais utilisée ou diffusée.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="registerPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Button variant="primary" type="submit">
                S'inscrire
              </Button>
            </Form>
        }
      </Skeleton>
    )
  }
}

class Message extends React.Component {
  render() {
    let message
    switch (this.props.status) {
      case 'unauthorized':
        message = "Vous devez vous connecter avant d'accéder à cette page. "
        break;
      case 'expired':
        message = "Vous avez été deconnecté. "
        break;
      default:
        return null
    }
    return <Alert variant="danger">{message}</Alert>
  }
}

class Input extends React.Component {
  render() {
    let { help, invalidLabel, isLoading, ...parentProps } = this.props
    let { label } = this.props
    return (
      <Form.Group controlId={this.props.name}>
        <Form.Label>{this.props.label}</Form.Label>
        <Form.Control
          disabled={isLoading}
          placeholder={label}
          {...parentProps}
        />
        {help && <Form.Text className="text-muted">
          {help}
        </Form.Text>}
        {invalidLabel && <Form.Control.Feedback type="invalid">{invalidLabel}</Form.Control.Feedback>}
      </Form.Group>
    )
  }
}

class Submit extends React.Component {
  render() {
    let { isLoading, label, workingLabel } = this.props
    return (
      <Button variant="primary" type="submit" disabled={isLoading} block>
        {isLoading ? <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
          />
          <span className="ml-1">{workingLabel}</span>
        </> : label}
      </Button>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.userReducer.status,
    user: userSelector(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Authentification))