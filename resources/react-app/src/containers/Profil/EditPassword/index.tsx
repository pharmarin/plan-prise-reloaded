import { AxiosError } from 'axios';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import Label from 'components/Label';
import Submit from 'components/Submit';
import { Formik } from 'formik';
import errors from 'helpers/error-messages.json';
import { observer } from 'mobx-react-lite';
import User from 'models/User';
import React, { useState } from 'react';
import * as yup from 'yup';

const EditPassword = observer(({ user }: { user: User }) => {
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  return (
    <Formik
      initialValues={{
        current_password: undefined,
        password: undefined,
        password_confirmation: undefined,
      }}
      onSubmit={async (values, { setSubmitting }) => {
        setError(undefined);
        setSubmitting(true);
        user.update(values);
        await user.save().catch((error: AxiosError) => {
          setError(error);
        });
      }}
      validationSchema={yup.object().shape({
        current_password: yup
          .string()
          .required(errors.update_profile.current_password.required),
        password: yup
          .string()
          .min(8, errors.inscription.password.min)
          .max(20, errors.inscription.password.max)
          .required(errors.inscription.password.required),
        password_confirmation: yup
          .string()
          .oneOf(
            [yup.ref('password')],
            errors.inscription.password_confirmation
          )
          .required(errors.inscription.password_confirmation),
      })}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <input
            autoComplete="off"
            name="email"
            type="hidden"
            value={user.email}
          />
          <FormGroup>
            <Label>Mot de passe actuel</Label>
            <div>
              <Input
                autoComplete="current-password"
                name="current_password"
                placeholder="Mot de passe actuel"
                type="password"
                withFeedback
                withLoading
              />
              {error &&
                (error.response?.data.errors || []).map((error: any) => (
                  <Form.Text className="text-red-600">{error.title}</Form.Text>
                ))}
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="name">Nouveau mot de passe</Label>
            <div>
              <Input
                autoComplete="new-password"
                name="password"
                placeholder="Nouveau mot de passe"
                type="password"
                withFeedback
                withLoading
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="name">Confirmation</Label>
            <div>
              <Input
                autoComplete="new-password"
                name="password_confirmation"
                placeholder="Confirmation du nouveau mot de passe"
                type="password"
                withFeedback
                withLoading
              />
            </div>
          </FormGroup>
          <div className="w-full max-w-sm mx-auto">
            <Submit block color="green" withLoading withSpinner>
              Mettre à jour le mot de passe
            </Submit>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default EditPassword;
