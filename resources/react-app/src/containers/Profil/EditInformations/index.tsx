import { AxiosError } from 'axios';
import Button from 'components/Button';
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

const EditInformations = observer(
  ({
    user,
    setUser,
  }: {
    user: User;
    setUser: (user: object, authenticated?: boolean) => void;
  }) => {
    const [error, setError] = useState<AxiosError | undefined>(undefined);

    const initialValues = {
      display_name: user.display_name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      rpps: user.rpps,
      status: user.status,
    };

    return (
      <Formik<typeof initialValues>
        enableReinitialize
        initialValues={initialValues}
        onSubmit={async (values, { setSubmitting }) => {
          setError(undefined);
          setSubmitting(true);
          user.update(values);
          await user.save().catch((error: AxiosError) => {
            setError(error);
          });
        }}
        validateOnMount
        validationSchema={yup.object().shape({
          first_name: yup
            .string()
            .required(errors.inscription.name)
            .min(3, errors.inscription.name)
            .max(50, errors.inscription.name),
          last_name: yup
            .string()
            .required(errors.inscription.name)
            .min(3, errors.inscription.name)
            .max(50, errors.inscription.name),
          status: yup.string().oneOf(['student', 'pharmacist']).required(),
          rpps: yup
            .mixed()
            .typeError(errors.inscription.rpps.length)
            .when('status', {
              is: 'pharmacist',
              then: yup
                .string()
                .typeError(errors.inscription.rpps.length)
                .required(errors.inscription.rpps.required)
                .min(11, errors.inscription.rpps.length)
                .max(11, errors.inscription.rpps.length),
            }),
          display_name: yup
            .string()
            .notRequired()
            .min(3, errors.inscription.display_name.min)
            .max(50, errors.inscription.display_name.max),
          email: yup
            .string()
            .email(errors.generic.mail)
            .required(errors.inscription.email.required),
        })}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="last_name">Nom</Label>
              <div>
                <Input
                  autoComplete="last-name"
                  name="last_name"
                  placeholder="Nom"
                  required
                  withFeedback
                  withLoading
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="first_name">Prénom</Label>
              <div>
                <Input
                  autoComplete="first-name"
                  name="first_name"
                  placeholder="Prénom"
                  required
                  withFeedback
                  withLoading
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Statut</Label>
              <div>
                <span>
                  {values.status === 'student' ? 'Étudiant' : 'Pharmacien'}
                </span>
                <FormGroup>
                  {values.status === 'student' && (
                    <Button
                      className="mt-2"
                      color="link"
                      onClick={() => setFieldValue('status', 'pharmacist')}
                    >
                      Modifier en compte pharmacien
                    </Button>
                  )}
                </FormGroup>
              </div>
            </FormGroup>
            {values.status === 'pharmacist' && (
              <FormGroup>
                <Label for="name">N° RPPS</Label>
                <div>
                  <Input
                    autoComplete="off"
                    name="rpps"
                    placeholder="N° RPPS"
                    withFeedback
                    withLoading
                  />
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <Label for="name">Nom de la structure (optionnel)</Label>
              <div>
                <Input
                  autoComplete="off"
                  name="display_name"
                  placeholder="Nom de la structure"
                  withFeedback
                  withLoading
                />
                <Form.Text>
                  Si indiqué, le nom de la structure apparaitra à la place de
                  votre nom sur le plan de prise
                </Form.Text>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="email">Adresse mail</Label>
              <div>
                <Input
                  autoComplete="email"
                  name="email"
                  placeholder="Adresse mail"
                  type="email"
                  withFeedback
                  withLoading
                />
              </div>
            </FormGroup>
            {error && (
              <div>
                {(error?.response?.data?.errors || []).map(
                  (errorItem: any, key: any) => (
                    <Form.Text key={key} className="text-red-600">
                      {errorItem.title}
                    </Form.Text>
                  )
                )}
              </div>
            )}
            <div className="w-full max-w-sm mx-auto">
              <Submit block color="green" withLoading withSpinner>
                Mettre à jour les informations
              </Submit>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
);

export default EditInformations;
