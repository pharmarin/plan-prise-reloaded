import React, { useState, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import {
  Alert,
  Form,
  Button,
  Spinner,
  FormGroup,
  Label,
  Input,
  FormFeedback,
  FormText,
  Col,
} from 'reactstrap';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import { Formik } from 'formik';
import Validator from 'validatorjs';
import get from 'lodash/get';
import includes from 'lodash/includes';

import { updateAppNav } from 'store/app';
import { RootState } from 'store/store';

Validator.useLang('fr');
const cancelRedirect = ['/deconnexion'];

export enum Role {
  signin,
  register,
  signout,
}

const mapState = (state: RootState) => ({});

const mapDispatch = {
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type AuthentificationProps = WithSanctumProps<Models.User> &
  ConnectedProps<typeof connector> & {
    role: Role;
  };

const Authentification = (props: AuthentificationProps) => {
  const { authenticated, signIn, signOut, updateAppNav, role } = props;
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const message = get(location, 'state.message', null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    updateAppNav({
      title: getTitle(role),
    });
  }, [role, updateAppNav]);

  useEffect(() => {
    if (role === Role.signout) signOut();
    if (role === Role.signin && get(location, 'state.message')) {
      // Si problème de connexion (expiré ou pas connecté),
      // on deconnecte d'abord pour être sûr de ne pas avoir
      // de doublons / mauvais token pas supprimé
      signOut();
    }
  }, []);

  const getTitle = (role: Role) => {
    switch (role) {
      case Role.signin:
        return 'Connexion';
      case Role.register:
        return 'Inscription';
      case Role.signout:
        return 'Déconnexion';
      default:
        return '';
    }
  };

  const getMessage = (status: string | null) => {
    switch (status) {
      case 'unauthorized':
        return "Vous devez vous connecter avant d'accéder à cette page. ";
      case 'expired':
        return 'Vous avez été deconnecté. ';
      default:
        return null;
    }
  };

  if (authenticated) {
    let redirectTo = get(location, 'state.redirectTo', '/');
    if (includes(cancelRedirect, redirectTo)) redirectTo = '/';
    return <Redirect to={redirectTo} />;
  }

  return (
    <Col className="mx-auto" sm={6}>
      {message && <Alert variant="danger">{getMessage(message)}</Alert>}
      {role === Role.signin && (
        <Formik
          initialValues={{ email: '', password: '' }}
          validate={(values) => {
            const validationConfig = get(
              JSON.parse(localStorage.getItem('pharmarin.config') || ''),
              'validation',
              {}
            );
            if (validationConfig.email && validationConfig.password) {
              const rules = {
                email: validationConfig.email,
                password: validationConfig.password,
              };
              const validator = new Validator(values, rules);
              if (validator.fails()) return validator.errors.all();
              return;
            }
            throw new Error('Could not get validation rules. ');
          }}
          onSubmit={async ({ email, password }, { setSubmitting }) => {
            setSubmitting(true);
            if (email && password) {
              await signIn(email, password);
              if (isMounted) setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Adresse mail</Label>
                <Input
                  autoComplete="username"
                  id="email"
                  invalid={!!errors.email}
                  name="email"
                  placeholder="Adresse mail"
                  type="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.email && touched.email ? (
                  <FormFeedback valid={false}>{errors.email}</FormFeedback>
                ) : (
                  <FormText color="muted">
                    Ne sera jamais utilisée ou diffusée.
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="password">Mot de passe</Label>
                <Input
                  autoComplete="current-password"
                  id="password"
                  invalid={!!errors.password}
                  name="password"
                  placeholder="Adresse mail"
                  type="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FormFeedback type="invalid">{errors.password}</FormFeedback>
              </FormGroup>
              <Button block disabled={isSubmitting} type="submit">
                {isSubmitting && (
                  <Spinner size="sm" style={{ marginRight: 10 }} />
                )}
                {isSubmitting ? 'Connexion en cours' : 'Se connecter'}
              </Button>
            </Form>
          )}
        </Formik>
      )}
      {role === Role.register && <p>À mettre en place... </p>}
      {role === Role.signout && (
        <React.Fragment>
          <Spinner animation="border" as="span" className="mr-2" size="sm" />
          Déconnexion en cours
        </React.Fragment>
      )}
    </Col>
  );
};

export default connector(withSanctum(Authentification));
