import React, { useRef, useState } from 'react';
import { Field, Formik } from 'formik';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import ReCAPTCHA from 'react-google-recaptcha';
import useAxios from 'axios-hooks';
import { useHistory } from 'react-router-dom';
import Logo from 'components/App/Logo';
import Label from 'base-components/Label';
import Input from 'base-components/Input';
import Submit from 'base-components/Submit';
import Button from 'base-components/Button';
import Card from 'base-components/Card';
import FormGroup from 'base-components/FormGroup';
import Form from 'base-components/Form';

const InscriptionForm = () => {
  const [step, setStep] = useState(1);

  const reCaptchaRef = useRef<ReCAPTCHA>(null);

  const history = useHistory();

  const [{ error, data }, signUp] = useAxios(
    { method: 'POST', url: 'register' },
    {
      manual: true,
    }
  );

  const ALLOWED_FILE_TYPES = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'application/pdf',
  ];

  if (data === 'success') {
    return (
      <Card className="border border-green-300">
        <h4>Demande d'inscription terminée</h4>
        <p>
          Votre demande d'inscription sur plandeprise.fr est maintenant
          terminée. Nous allons examiner votre demande dans les plus brefs
          délais.
        </p>
        <p>
          Vous recevrez prochainement un mail vous informant de l'activation de
          votre compte.
        </p>
        <Button block color="green" onClick={() => history.push('/')}>
          Retour
        </Button>
      </Card>
    );
  }

  return (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
      <Logo />
      <Card className="mt-6">
        <Formik
          initialValues={{
            certificate: undefined,
            email: '',
            name: '',
            rpps: undefined,
            status: undefined,
            password: '',
            password_confirmation: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            if (!reCaptchaRef) {
              throw new Error("Le service ReCAPTCHA n'a pas pu être chargé");
            }

            setSubmitting(true);

            const reCaptchaValue = await (reCaptchaRef.current as ReCAPTCHA).executeAsync();

            const formData = new FormData();

            Object.entries(values).forEach((pair) => {
              formData.append(pair[0], pair[1] || '');
            });

            formData.append('recaptcha', reCaptchaValue || '');

            try {
              await signUp({
                data: formData,
              });
            } catch {
              setSubmitting(false);
              (reCaptchaRef.current as ReCAPTCHA).reset();
            }
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
            certificate: yup.mixed().when('status', {
              is: 'student',
              then: yup
                .mixed()
                .required(errors.inscription.certificate.required)
                .test(
                  'fileSize',
                  errors.inscription.certificate.size,
                  (value) =>
                    'size' in (value || {}) ? value.size <= 2000000 : false
                )
                .test(
                  'fileType',
                  errors.inscription.certificate.type,
                  (value) =>
                    'type' in (value || {})
                      ? ALLOWED_FILE_TYPES.includes(value.type)
                      : false
                ),
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
          {({ errors, handleSubmit, values }) => (
            <Form onSubmit={handleSubmit}>
              <ReCAPTCHA
                ref={reCaptchaRef}
                size="invisible"
                sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY || ''}
              />
              {step === 1 && (
                <React.Fragment>
                  <h4 className="font-medium text-gray-900">Votre identité</h4>
                  <p className="mt-1 text-sm text-gray-600 mb-6">
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
                    <Label>Statut</Label>
                    <div className="flex items-center mt-1">
                      <Field
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        id="status_pharmacist"
                        type="radio"
                        name="status"
                        value="pharmacist"
                      />
                      <Label check for="status_pharmacist">
                        Pharmacien
                      </Label>
                    </div>
                    <div className="flex items-center mt-1">
                      <Field
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        id="status_student"
                        type="radio"
                        name="status"
                        value="student"
                      />
                      <Label check for="status_student">
                        Étudiant
                      </Label>
                    </div>
                  </FormGroup>
                  {values.status === 'pharmacist' && (
                    <div>
                      <Label for="name">N° RPPS</Label>
                      <Input
                        autoComplete="off"
                        name="rpps"
                        placeholder="N° RPPS"
                        withFeedback
                        withLoading
                      />
                    </div>
                  )}
                  {values.status === 'student' && (
                    <FormGroup>
                      <Label for="name">
                        Justificatif d'inscription en études de pharmacie
                      </Label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <Input
                          accept={ALLOWED_FILE_TYPES.join(',')}
                          name="certificate"
                          placeholder="Ajouter un fichier... "
                          type="file"
                          withFeedback
                          withLoading
                        />
                      </div>
                    </FormGroup>
                  )}
                  <div className="w-full max-w-sm mx-auto">
                    <Submit
                      block
                      color="light"
                      disabled={
                        errors.name !== undefined ||
                        errors.status !== undefined ||
                        errors.rpps !== undefined ||
                        errors.certificate !== undefined
                      }
                      onClick={() => setStep(2)}
                      withLoading
                      withSpinner
                    >
                      Valider
                    </Submit>
                  </div>
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
                    <Form.Text>
                      Si indiqué, le nom de la structure apparaitra à la place
                      de votre nom sur le plan de prise
                    </Form.Text>
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
                    <Form.Text>Ne sera jamais utilisée ou diffusée.</Form.Text>
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
                  {error && (
                    <div>
                      {(Object.values(error.response?.data.errors) || []).map(
                        (errors: any) =>
                          errors.map((error: string) => (
                            <p key={error} className="text-danger">
                              {error}
                            </p>
                          ))
                      )}
                    </div>
                  )}
                  <div className="w-full max-w-sm mx-auto space-y-4">
                    <Button block color="light" onClick={() => setStep(1)}>
                      Retour
                    </Button>
                    <Submit block color="green" withLoading withSpinner>
                      Demander mon inscription
                    </Submit>
                  </div>
                </React.Fragment>
              )}
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default InscriptionForm;
