import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import { Alert, Form, Button, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import get from "lodash/get";
import includes from "lodash/includes";

import Skeleton from "components/generic/Skeleton";
import { doLogin, doLogout, doReset } from "store/auth/actions";
import authenticator, { AuthProps } from "components/auth/AuthGate";

const cancelRedirect = ["/deconnexion"];

const SigninSchema = Yup.object().shape({
  signinEmail: Yup.string()
    .email("L'adresse mail entrée ne semble pas valide")
    .required("L'adresse mail est requise"),
  signinPassword: Yup.string().required("Le mot de passe est requis"),
});

export enum Role {
  signin,
  register,
  signout,
}

interface RootState {
  auth: {
    isError: boolean;
    isLoading: boolean;
    tokens: {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

const mapState = (state: RootState) => ({
  isError: state.auth.isError,
  isLoading: state.auth.isLoading,
  tokens: state.auth.tokens,
});

const mapDispatch = {
  doLogin: (values: { username: string; password: string }) => doLogin(values),
  doLogout: () => doLogout(),
  reset: () => doReset(),
};

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type AuthentificationProps = ReduxProps &
  RouteComponentProps &
  AuthProps & {
    role: Role;
  };

type AuthentificationState = {
  isMounted: boolean;
};

class Authentification extends React.Component<
  AuthentificationProps,
  AuthentificationState
> {
  constructor(props: AuthentificationProps) {
    super(props);

    this.state = {
      isMounted: false,
    };

    if (props.role === Role.signout) {
      this.handleSignout();
    }

    if (props.role === Role.signin && get(props, "location.state.message")) {
      // Si problème de connexion (expiré ou pas connecté),
      // on deconnecte d'abord pour être sûr de ne pas avoir
      // de doublons / mauvais token pas supprimé
      props.reset();
    }
  }

  componentDidMount() {
    this.setState({ isMounted: true });
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  redirect = () => {
    let redirect;
    const { auth } = this.props;
    if (auth.isValid) redirect = true;

    if (redirect) {
      let redirectTo = get(this.props, "location.state.redirectTo", "/");
      if (includes(cancelRedirect, redirectTo)) redirectTo = "/";
      return <Redirect to={redirectTo} />;
    }

    return null;
  };

  handleSignout = () => {
    this.props.doLogout();
  };

  getTitle = (role: Role) => {
    switch (role) {
      case Role.signin:
        return "Connexion";
      case Role.register:
        return "Inscription";
      case Role.signout:
        return "Déconnexion";
      default:
        return "";
    }
  };

  getMessage = (status: string | null) => {
    switch (status) {
      case "unauthorized":
        return "Vous devez vous connecter avant d'accéder à cette page. ";
      case "expired":
        return "Vous avez été deconnecté. ";
      default:
        return null;
    }
  };

  render() {
    const { isLoading, role } = this.props;
    const message = get(this.props, "location.state.message", null);
    if (this.redirect()) return this.redirect();
    return (
      <Skeleton header={this.getTitle(role)} size={{ md: 6 }}>
        {(() =>
          message ? (
            <Alert variant="danger">{this.getMessage(message)}</Alert>
          ) : null)()}
        {role === Role.signin && (
          <Formik
            initialValues={{ signinEmail: "", signinPassword: "" }}
            validationSchema={SigninSchema}
            onSubmit={(
              values: { signinEmail: string; signinPassword: string },
              { setSubmitting }
            ) => {
              setSubmitting(true);
              const { signinEmail, signinPassword } = values;
              const { doLogin: login } = this.props;
              if (signinEmail && signinPassword) {
                login({
                  password: signinPassword,
                  username: signinEmail,
                });
                if (this.state.isMounted) setSubmitting(false);
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
                      style={{ marginRight: 10 }}
                    />
                  )}
                  {isLoading ? "Connexion en cours" : "Se connecter"}
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
      </Skeleton>
    );
  }
}

export default withRouter(connector(authenticator(Authentification)));
