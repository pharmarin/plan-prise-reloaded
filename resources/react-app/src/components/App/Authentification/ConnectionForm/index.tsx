import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Input, Submit } from 'formstrap';
import { SanctumContext } from 'react-sanctum';
import { Col, Form, FormGroup, Label } from 'reactstrap';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';

export default () => {
  const { signIn } = useContext(SanctumContext);

  if (!signIn) throw new Error('Sanctum props are missing');

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={({ email, password }, { setSubmitting }) => {
        setSubmitting(true);
        if (email && password) {
          signIn(email, password).catch((e) => {
            console.error('Error while loging in', e);
            setSubmitting(false);
          });
        } else {
          setSubmitting(false);
        }
      }}
      validationSchema={yup.object().shape({
        email: yup
          .string()
          .typeError(errors.connexion.mail)
          .email(errors.generic.mail)
          .required(errors.connexion.mail),
        password: yup
          .string()
          .required(errors.connexion.password)
          .min(6, errors.connexion.password)
          .max(20, errors.connexion.password),
      })}
      validateOnChange={false}
    >
      {({ handleSubmit, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="email">Adresse mail</Label>
            <Input
              autoComplete="email"
              name="email"
              placeholder="Adresse mail"
              required
              type="email"
              withFeedback
              withLoading
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Mot de passe</Label>
            <Input
              autoComplete="current-password"
              name="password"
              placeholder="Adresse mail"
              required
              type="password"
              withFeedback
              withLoading
            />
          </FormGroup>
          <Col className="p-0 mx-auto" lg="8" xl="6">
            <Submit
              block
              color="success"
              disabled={!isValid}
              withLoading
              withSpinner
            >
              Me connecter
            </Submit>
          </Col>
        </Form>
      )}
    </Formik>
  );
};
