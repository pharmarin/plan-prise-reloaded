import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import Label from 'components/Label';
import Submit from 'components/Submit';
import Logo from 'containers/App/Logo';
import { Formik } from 'formik';
import errors from 'helpers/error-messages.json';
import React, { useContext } from 'react';
import { SanctumContext } from 'react-sanctum';
import * as yup from 'yup';

const ConnectionForm = ({ message }: Props.Frontend.App.ConnectionForm) => {
  const { signIn } = useContext(SanctumContext);

  if (!signIn) throw new Error('Sanctum props are missing');

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
      <Logo />
      {message && (
        <div className="w-full sm:max-w-md mt-6 p-4 bg-yellow-100 text-yellow-700 shadow-inner sm:rounded-lg">
          {message}
        </div>
      )}
      <Card className="mt-6">
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
          {({ handleSubmit }) => (
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
              <div className="w-full max-w-sm mx-auto">
                <Submit block color="green" withLoading withSpinner>
                  Me connecter
                </Submit>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default ConnectionForm;
