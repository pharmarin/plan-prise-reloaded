import useAxios from 'axios-hooks';
import { Formik } from 'formik';
import { requestUrl } from 'helpers/hooks/use-json-api';
import React from 'react';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import Form from 'base-components/Form';
import FormGroup from 'base-components/FormGroup';
import Label from 'base-components/Label';
import Input from 'base-components/Input';
import Button from 'base-components/Button';
import Submit from 'base-components/Submit';

const EditInformations = ({
  user,
  setUser,
}: Props.Frontend.App.EditInformations) => {
  const [{ error }, update] = useAxios(
    {
      method: 'PATCH',
      url: requestUrl('users', {
        id: user.data.id,
      }).url,
    },
    { manual: true }
  );

  const getChanged = (
    values: typeof initialValues,
    initial: typeof initialValues
  ) =>
    Object.keys(values).reduce((result, field) => {
      if ((values as any)[field] !== (initial as any)[field])
        (result as any)[field] = (values as any)[field];
      return result;
    }, {});

  const initialValues = {
    display_name: user.data.attributes.display_name,
    email: user.data.attributes.email,
    first_name: user.data.attributes.first_name,
    last_name: user.data.attributes.last_name,
    rpps: user.data.attributes.rpps,
    status: user.data.attributes.status,
  };

  return (
    <Formik<typeof initialValues>
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);

        const difference = getChanged(values, initialValues);

        if (Object.keys(difference).length > 0) {
          try {
            const response = await update({
              data: {
                data: {
                  id: user.data.id,
                  type: 'users',
                  attributes: difference,
                },
              },
            });

            setUser(response.data);
          } catch {
            // Error handling with error variable from useAxios
          }
        }
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
      {({ handleSubmit, isValid, resetForm, setFieldValue, values }) => (
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
              {(error.response?.data.errors || []).map((errorItem: any) => (
                <Form.Text key={errorItem.title} className="text-red-600">
                  {errorItem.detail}
                </Form.Text>
              ))}
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
};

export default EditInformations;
