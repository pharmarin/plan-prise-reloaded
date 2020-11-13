import React, { useState } from 'react';
import { Field, Formik } from 'formik';
import { Input, Submit } from 'formstrap';
import { Button, Col, Form, FormGroup, FormText, Label } from 'reactstrap';
import * as yup from 'yup';
import errors from '../errors.json';

export default () => {
  const [step, setStep] = useState(1);

  return (
    <Formik
      initialValues={{
        email: '',
        name: '',
        rpps: undefined,
        status: undefined,
        password: '',
        password_confirmation: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        console.log(values);
      }}
      validateOnMount
      validationSchema={yup.object().shape({
        name: yup
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
      {({ errors, handleSubmit, isValid, values }) => (
        <Form onSubmit={handleSubmit}>
          {step === 1 && (
            <React.Fragment>
              <h4>Votre identité</h4>
              <p className="text-muted">
                Permettra de valider votre inscription
              </p>
              <FormGroup>
                <Label for="name">Nom et prénom</Label>
                <Input
                  autoComplete="name"
                  name="name"
                  placeholder="Nom et prénom"
                  required
                  withFeedback
                  withLoading
                />
              </FormGroup>
              <FormGroup>
                <Label>Status</Label>
                <FormGroup check>
                  <Label check>
                    <Field type="radio" name="status" value="pharmacist" />{' '}
                    Pharmacien
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Field type="radio" name="status" value="student" />{' '}
                    Étudiant
                  </Label>
                </FormGroup>
              </FormGroup>
              {values.status === 'pharmacist' && (
                <FormGroup>
                  <Label for="name">N° RPPS</Label>
                  <Input
                    autoComplete="off"
                    name="rpps"
                    placeholder="N° RPPS"
                    withFeedback
                    withLoading
                  />
                </FormGroup>
              )}
              <Col
                className="p-0"
                lg={{ size: 8, offset: 2 }}
                xl={{ size: 6, offset: 3 }}
              >
                <Submit
                  block
                  color="light"
                  disabled={
                    errors.name !== undefined ||
                    errors.status !== undefined ||
                    errors.rpps !== undefined
                  }
                  onClick={() => setStep(2)}
                  withLoading
                  withSpinner
                >
                  Valider
                </Submit>
              </Col>
            </React.Fragment>
          )}
          {step === 2 && (
            <React.Fragment>
              <h4>Votre profil</h4>
              <FormGroup>
                <Label for="name">Nom de la structure (optionnel)</Label>
                <Input
                  autoComplete="off"
                  name="display_name"
                  placeholder="Nom de la structure"
                  withFeedback
                  withLoading
                />
                <FormText color="muted">
                  Si indiqué, le nom de la structure apparaitra à la place de
                  votre nom sur le plan de prise
                </FormText>
              </FormGroup>
              <FormGroup>
                <Label for="email">Adresse mail</Label>
                <Input
                  autoComplete="email"
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
                  autoComplete="new-password"
                  name="password"
                  placeholder="Mot de passe"
                  type="password"
                  withFeedback
                  withLoading
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Confirmation du mot de passe</Label>
                <Input
                  autoComplete="new-password"
                  name="password_confirmation"
                  placeholder="Confirmation du mot de passe"
                  type="password"
                  withFeedback
                  withLoading
                />
              </FormGroup>
              <Col
                className="p-0"
                lg={{ size: 8, offset: 2 }}
                xl={{ size: 6, offset: 3 }}
              >
                <Button
                  block
                  color="light"
                  onClick={() => setStep(1)}
                  size="sm"
                >
                  Retour
                </Button>
                <Submit
                  block
                  color="success"
                  disabled={!isValid}
                  withLoading
                  withSpinner
                >
                  Demander mon inscription
                </Submit>
              </Col>
            </React.Fragment>
          )}
        </Form>
      )}
    </Formik>
  );
};
