import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Alert, Form, Button, Spinner } from 'react-bootstrap';
import get from 'lodash/get';
import includes from 'lodash/includes';

import Skeleton from '../generic/Skeleton';

import {
  performLogin,
  performLogout,
} from '../../redux/user/services.api';
import { doLogin, doReset } from '../../redux/user/actions';
import userSelector from '../../redux/user/selector';

const approvedRoles = ['signin', 'signout', 'register'];
const cancelRedirect = ['/deconnexion'];

class Authentification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInvalid: false,
      isLoading: false,
    };

    if (props.to === 'signout') {
      this.state.isLoading = true;
      this.handleSignout(props);
    }

    if (
      props.to === 'signin' &&
      get(props, 'location.state.message')
    ) {
      // Si problème de connexion (expiré ou pas connecté),
      // on deconnecte d'abord pour être sûr de ne pas avoir
      // de doublons / mauvais token pas supprimé
      props.reset();
    }
  }

  redirect = () => {
    let redirect;
    const { to, user } = this.props;
    const { isLoading } = this.state;
    if (!includes(approvedRoles, to)) redirect = true;
    if (to === 'signout' && isLoading) redirect = false;
    if (user.isValid) redirect = true;

    if (redirect) {
      let redirectTo = get(
        this.props,
        'location.state.redirectTo',
        '/',
      );
      if (includes(cancelRedirect, redirectTo)) redirectTo = '/';
      return <Redirect to={redirectTo} />;
    }

    return null;
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      isInvalid: false,
    });
  };

  handleSignin = (e) => {
    e.preventDefault();

    this.setState({ isLoading: true });
    const { signinEmail, signinPassword } = this.state;
    const { login } = this.props;
    if (signinEmail && signinPassword) {
      performLogin(signinEmail, signinPassword).then(
        (credentials) => {
          if (credentials) {
            login(credentials);
          } else {
            this.setState({
              isInvalid: true,
              isLoading: false,
            });
          }
        },
      );
    }
  };

  handleSignout = (props) => {
    performLogout().then(() => {
      props.reset();
    });
  };

  getTitle = (role) => {
    switch (role) {
      case 'signin':
        return 'Connexion';
      case 'register':
        return 'Inscription';
      case 'signout':
        return 'Déconnexion';
      default:
        return '';
    }
  };

  getMessage = (status) => {
    switch (status) {
      case 'unauthorized':
        return "Vous devez vous connecter avant d'accéder à cette page. ";
      case 'expired':
        return 'Vous avez été deconnecté. ';
      default:
        return null;
    }
  };

  render() {
    const { to } = this.props;
    const { isInvalid, isLoading, isValidated } = this.state;
    const message = get(this.props, 'location.state.message', null);
    if (this.redirect()) return this.redirect();
    return (
      <Skeleton header={this.getTitle(to)} size={{ md: 6 }}>
        {(() =>
          message ? (
            <Alert variant="danger">{this.getMessage(message)}</Alert>
          ) : null)()}
        {to === 'signin' && (
          <Form onSubmit={this.handleSignin} validated={isValidated}>
            <Input
              autoComplete="username"
              help="Ne sera jamais utilisée ou diffusée."
              isInvalid={isInvalid}
              isLoading={isLoading}
              label="Adresse mail"
              name="signinEmail"
              onChange={this.handleChange}
              required
              type="email"
              value={get(this.state, 'signinEmail', '')}
            />
            <Input
              autoComplete="current-password"
              invalidLabel="Connexion impossible, vérifiez les informations saisies"
              isInvalid={isInvalid}
              isLoading={isLoading}
              label="Mot de passe"
              name="signinPassword"
              onChange={this.handleChange}
              required
              type="password"
              value={get(this.state, 'signinPassword', '')}
            />
            <Submit
              label="Se connecter"
              workingLabel="Connexion en cours"
            />
          </Form>
        )}
        {to === 'register' && (
          <Form>
            <Form.Group controlId="registerName">
              <Form.Label>Nom</Form.Label>
              <Form.Control type="text" placeholder="Nom" />
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
              <Form.Control
                type="password"
                placeholder="Mot de passe"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              S'inscrire
            </Button>
          </Form>
        )}
        {to === 'signout' && (
          <>
            <Spinner
              as="span"
              animation="border"
              className="mr-2"
              size="sm"
            />
            Déconnexion en cours
          </>
        )}
      </Skeleton>
    );
  }
}

Authentification.propTypes = {
  login: PropTypes.func,
  to: PropTypes.string,
  reset: PropTypes.func,
  user: PropTypes.shape({
    isValid: PropTypes.bool,
  }),
};

const Input = (props) => {
  const { help, invalidLabel, isLoading, label, name } = props;
  return (
    <Form.Group controlId={name}>
      <Form.Label>{label}</Form.Label>
      <Form.Control disabled={isLoading} placeholder={label} />
      {help && <Form.Text className="text-muted">{help}</Form.Text>}
      {invalidLabel && (
        <Form.Control.Feedback type="invalid">
          {invalidLabel}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

Input.propTypes = {
  help: PropTypes.string,
  invalidLabel: PropTypes.string,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

const Submit = (props) => {
  const { isLoading, label, workingLabel } = props;
  return (
    <Button
      variant="primary"
      type="submit"
      disabled={isLoading}
      block
    >
      {isLoading ? (
        <>
          <Spinner as="span" animation="border" size="sm" />
          <span className="ml-1">{workingLabel}</span>
        </>
      ) : (
        label
      )}
    </Button>
  );
};

Submit.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  workingLabel: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    status: state.userReducer.status,
    user: userSelector(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => dispatch(doLogin(credentials)),
    reset: () => dispatch(doReset()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Authentification),
);
