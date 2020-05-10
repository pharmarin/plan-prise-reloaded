import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { Alert, Form, Button, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import includes from 'lodash/includes';

import Skeleton from '../generic/Skeleton';
import { doLogin, doLogout, doReset } from '../../redux/auth/actions';
import authenticate from '../auth/AuthGate';

const approvedRoles = ['signin', 'signout', 'register'];
const cancelRedirect = ['/deconnexion'];

const SigninSchema = Yup.object().shape({
  signinEmail: Yup.string()
    .email("L'adresse mail entrée ne semble pas valide")
    .required("L'adresse mail est requise"),
  signinPassword: Yup.string().required('Le mot de passe est requis'),
});

class Authentification extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.state = {
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

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  redirect = () => {
    let redirect;
    const { to, auth } = this.props;
    const { isLoading } = this.state;
    if (!includes(approvedRoles, to)) redirect = true;
    if (to === 'signout' && isLoading) redirect = false;
    if (auth.isValid) redirect = true;

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

  handleSignin = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const { signinEmail, signinPassword } = values;
    const { doLogin: login } = this.props;
    if (signinEmail && signinPassword) {
      login({
        password: signinPassword,
        username: signinEmail,
      });
      if (this.mounted) setSubmitting(false);
    }
  };

  handleSignout = (props) => {
    props.doLogout();
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
    const { isLoading, to } = this.props;
    const message = get(this.props, 'location.state.message', null);
    if (this.redirect()) return this.redirect();
    return (
      <Skeleton header={this.getTitle(to)} size={{ md: 6 }}>
        {(() =>
          message ? (
            <Alert variant="danger">{this.getMessage(message)}</Alert>
          ) : null)()}
        {to === 'signin' && (
          <Formik
            initialValues={{ signinEmail: '', signinPassword: '' }}
            validationSchema={SigninSchema}
            onSubmit={this.handleSignin}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="signinEmail">
                  <Form.Label>Adresse mail</Form.Label>
                  <Form.Control
                    autoComplete="username"
                    isInvalid={!!errors.signinEmail}
                    name="signinEmail"
                    placeholder="Adresse mail"
                    type="email"
                    value={values.signinEmail}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {errors.signinEmail && touched.signinEmail ? (
                    <Form.Control.Feedback type="invalid">
                      {errors.signinEmail}
                    </Form.Control.Feedback>
                  ) : (
                    <Form.Text className="text-muted">
                      Ne sera jamais utilisée ou diffusée.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group controlId="signinPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    autoComplete="current-password"
                    isInvalid={!!errors.signinPassword}
                    name="signinPassword"
                    placeholder="Adresse mail"
                    type="password"
                    value={values.signinPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.signinPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button block disabled={isLoading} type="submit">
                  {isLoading && (
                    <Spinner
                      animation="border"
                      size="sm"
                      styles={{ marginRight: 10 }}
                    />
                  )}
                  {isLoading ? 'Connexion en cours' : 'Se connecter'}
                </Button>
              </Form>
            )}
          </Formik>
        )}
        {to === 'register' && <p>À mettre en place... </p>}
        {to === 'signout' && (
          <React.Fragment>
            <Spinner
              animation="border"
              as="span"
              className="mr-2"
              size="sm"
            />
            Déconnexion en cours
          </React.Fragment>
        )}
      </Skeleton>
    );
  }
}

Authentification.propTypes = {
  auth: PropTypes.shape({
    isValid: PropTypes.bool,
  }),
  doLogin: PropTypes.func,
  isLoading: PropTypes.bool,
  reset: PropTypes.func,
  to: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    isLoading: state.auth.isLoading,
    tokens: state.auth.tokens,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    doLogin: (values) => dispatch(doLogin(values)),
    doLogout: () => dispatch(doLogout()),
    reset: () => dispatch(doReset()),
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(authenticate(Authentification)),
);
