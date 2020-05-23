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
import { Formik } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import includes from 'lodash/includes';

import { login, logout, update } from 'store/app';
import authenticator, {
  AuthProps,
} from 'components/Authentification/Authenticator';
import { RootState } from 'store/store';

const cancelRedirect = ['/deconnexion'];

const SigninSchema = Yup.object().shape({
  signinEmail: Yup.string()
    .email("L'adresse mail entrée ne semble pas valide")
    .required("L'adresse mail est requise"),
  signinPassword: Yup.string().required('Le mot de passe est requis'),
});

export enum Role {
  signin,
  register,
  signout,
}

const mapState = (state: RootState) => ({
  isError: state.app.auth.isError,
  isLoading: state.app.auth.isLoading,
});

const mapDispatch = {
  login: (values: { username: string; password: string }) => login(values),
  logout,
  update,
};

const connector = connect(mapState, mapDispatch);

type AuthentificationProps = ConnectedProps<typeof connector> &
  AuthProps & {
    role: Role;
  };

const Authentification = (props: AuthentificationProps) => {
  const { auth, isLoading, logout, update, role } = props;
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const message = get(location, 'state.message', null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    update({
      title: getTitle(role),
    });
  }, [role, update]);

  useEffect(() => {
    if (role === Role.signout) logout();
    if (role === Role.signin && get(location, 'state.message')) {
      // Si problème de connexion (expiré ou pas connecté),
      // on deconnecte d'abord pour être sûr de ne pas avoir
      // de doublons / mauvais token pas supprimé
      logout();
    }
  });

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

  if (auth.isValid) {
    let redirectTo = get(location, 'state.redirectTo', '/');
    if (includes(cancelRedirect, redirectTo)) redirectTo = '/';
    return <Redirect to={redirectTo} />;
  }

  return (
    <Col className="mx-auto" sm={6}>
      {message && <Alert variant="danger">{getMessage(message)}</Alert>}
      {role === Role.signin && (
        <Formik
          initialValues={{ signinEmail: '', signinPassword: '' }}
          validationSchema={SigninSchema}
          onSubmit={(
            values: { signinEmail: string; signinPassword: string },
            { setSubmitting }
          ) => {
            setSubmitting(true);
            const { signinEmail, signinPassword } = values;
            const { login } = props;
            if (signinEmail && signinPassword) {
              login({
                password: signinPassword,
                username: signinEmail,
              });
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
          }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="signinEmail">Adresse mail</Label>
                <Input
                  autoComplete="username"
                  id="signinEmail"
                  invalid={!!errors.signinEmail}
                  name="signinEmail"
                  placeholder="Adresse mail"
                  type="email"
                  value={values.signinEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.signinEmail && touched.signinEmail ? (
                  <FormFeedback valid={false}>
                    {errors.signinEmail}
                  </FormFeedback>
                ) : (
                  <FormText color="muted">
                    Ne sera jamais utilisée ou diffusée.
                  </FormText>
                )}
              </FormGroup>
              <FormGroup>
                <Label for="signinPassword">Mot de passe</Label>
                <Input
                  autoComplete="current-password"
                  id="signinPassword"
                  invalid={!!errors.signinPassword}
                  name="signinPassword"
                  placeholder="Adresse mail"
                  type="password"
                  value={values.signinPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                <FormFeedback type="invalid">
                  {errors.signinPassword}
                </FormFeedback>
              </FormGroup>
              <Button block disabled={isLoading} type="submit">
                {isLoading && <Spinner size="sm" style={{ marginRight: 10 }} />}
                {isLoading ? 'Connexion en cours' : 'Se connecter'}
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

export default connector(authenticator(Authentification));
