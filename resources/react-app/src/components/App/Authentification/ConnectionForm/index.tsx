import React, { useContext } from 'react';
import { Formik } from 'formik';
import { Input, Submit } from 'formstrap';
import { SanctumContext } from 'react-sanctum';
import { Form, FormGroup, FormText, Label } from 'reactstrap';
import * as yup from 'yup';

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
          .email(
            'Veuillez entrer une adresse mail correcte pour vous connecter'
          )
          .required('Veuillez entrer une adresse mail pour vous connecter'),
        password: yup
          .string()
          .required(
            "Veuillez entrer le mot de passe défini à l'inscription pour vous connecter"
          )
          .min(
            6,
            "Veuillez entrer le mot de passe défini à l'inscription pour vous connecter"
          )
          .max(
            20,
            "Veuillez entrer le mot de passe défini à l'inscription pour vous connecter"
          ),
      })}
      validateOnChange={false}
    >
      {({ handleSubmit, isValid }) => (
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="email">Adresse mail</Label>
            <Input
              autoComplete="username"
              name="email"
              placeholder="Adresse mail"
              type="email"
              withFeedback
              withLoading
            />
            <FormText color="muted">
              Ne sera jamais utilisée ou diffusée.
            </FormText>
          </FormGroup>
          <FormGroup>
            <Label for="password">Mot de passe</Label>
            <Input
              autoComplete="current-password"
              name="password"
              placeholder="Adresse mail"
              type="password"
              withFeedback
              withLoading
            />
          </FormGroup>
          <div className="text-center">
            <Submit color="default" disabled={!isValid} withLoading withSpinner>
              Se connecter
            </Submit>
          </div>
        </Form>
      )}
    </Formik>
  );
};
