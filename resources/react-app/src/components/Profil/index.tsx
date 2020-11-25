import React, { useContext, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { updateAppNav } from 'store/app';
import { SanctumContext } from 'react-sanctum';
import { Formik } from 'formik';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import useAxios from 'axios-hooks';
import { requestUrl } from 'helpers/hooks/use-json-api';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import Form from 'base-components/Form';
import FormGroup from 'base-components/FormGroup';
import Label from 'base-components/Label';
import Button from 'base-components/Button';
import Input from 'base-components/Input';
import Submit from 'base-components/Submit';
import Card from 'base-components/Card';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type ProfilProps = ConnectedProps<typeof connector>;

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const Profil: React.FunctionComponent<ProfilProps> = ({ updateAppNav }) => {
  const { setUser, user } = useContext<SanctumProps>(SanctumContext);

  if (!user || !setUser)
    throw new Error("L'utilisateur n'a pas pu être chargé");

  const [isEditing, setIsEditing] = useState(false);

  const [{ error }, update] = useAxios(
    {
      method: 'PATCH',
      url: requestUrl('users', {
        id: user.data.id,
      }).url,
    },
    { manual: true }
  );

  useEffect(() => {
    updateAppNav({
      title: 'Profil',
    });
  }, [updateAppNav]);

  const readOnly = {
    plaintext: !isEditing,
    disabled: !isEditing,
  };

  const initialValues = {
    display_name: user.data.attributes.display_name,
    email: user.data.attributes.email,
    first_name: user.data.attributes.first_name,
    last_name: user.data.attributes.last_name,
    rpps: user.data.attributes.rpps,
    status: user.data.attributes.status,
  };

  const getChanged = (
    values: typeof initialValues,
    initial: typeof initialValues
  ) =>
    Object.keys(values).reduce((result, field) => {
      if ((values as any)[field] !== (initial as any)[field])
        (result as any)[field] = (values as any)[field];
      return result;
    }, {});

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Informations
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Vous trouverez ici les informations fournies lors de
              l'inscription.
              <br />
              Vous pouvez les modifier à tout moment.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Card>
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
                    setIsEditing(false);
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
                status: yup
                  .string()
                  .oneOf(['student', 'pharmacist'])
                  .required(),
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
              {({
                handleSubmit,
                isValid,
                resetForm,
                setFieldValue,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label for="last_name">Nom</Label>
                    <div>
                      <Input
                        autoComplete="last-name"
                        name="last_name"
                        placeholder={isEditing ? 'Nom' : ''}
                        {...readOnly}
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
                        placeholder={isEditing ? 'Prénom' : ''}
                        {...readOnly}
                        required
                        withFeedback
                        withLoading
                      />
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label>Statut</Label>
                    <div>
                      <FormGroup>
                        {values.status === 'student' ? (
                          isEditing ? (
                            <Button
                              className="mt-2"
                              color="link"
                              onClick={() =>
                                setFieldValue('status', 'pharmacist')
                              }
                            >
                              Modifier en compte pharmacien
                            </Button>
                          ) : (
                            <span className="form-control-plaintext">
                              Étudiant
                            </span>
                          )
                        ) : (
                          <span className="form-control-plaintext">
                            Pharmacien
                          </span>
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
                          placeholder={isEditing ? 'N° RPPS' : ''}
                          {...readOnly}
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
                        placeholder={isEditing ? 'Nom de la structure' : ''}
                        {...readOnly}
                        withFeedback
                        withLoading
                      />
                      <Form.Text>
                        Si indiqué, le nom de la structure apparaitra à la place
                        de votre nom sur le plan de prise
                      </Form.Text>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label for="email">Adresse mail</Label>
                    <div>
                      <Input
                        autoComplete="email"
                        name="email"
                        placeholder={isEditing ? 'Adresse mail' : ''}
                        {...readOnly}
                        type="email"
                        withFeedback
                        withLoading
                      />
                    </div>
                  </FormGroup>
                  {error && (
                    <div>
                      {(error.response?.data.errors || []).map(
                        (errorItem: any) => (
                          <p key={errorItem.title} className="text-danger">
                            {errorItem.detail}
                          </p>
                        )
                      )}
                    </div>
                  )}
                  <div className="w-full max-w-sm mx-auto">
                    <Button
                      block
                      color="light"
                      onClick={() => {
                        resetForm();
                        setIsEditing(!isEditing);
                      }}
                    >
                      {isEditing ? 'Annuler' : 'Modifier'}
                    </Button>
                    {isEditing && (
                      <Submit block color="green" withLoading withSpinner>
                        Valider les modifications
                      </Submit>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
      <div className="my-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Informations
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Vous trouverez ici les informations fournies lors de
                l'inscription.
              </p>
              <p>Vous pouvez les modifier à tout moment. </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Card>
              <Formik
                initialValues={{
                  current_password: undefined,
                  password: undefined,
                  password_confirmation: undefined,
                }}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(true);
                  try {
                    await update({
                      data: {
                        data: {
                          id: user.data.id,
                          type: 'users',
                          attributes: values,
                        },
                      },
                    });
                  } catch {}
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
                {({ handleSubmit, isSubmitting }) => (
                  <Form onSubmit={handleSubmit}>
                    <input
                      autoComplete="off"
                      name="email"
                      type="hidden"
                      value={user.data.attributes.email}
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
                        (error.response?.data.errors || []).filter(
                          (error: any) => error.code === 'password-mismatch'
                        ).length > 0 ? (
                          <Form.Text className="text-red-600">
                            {errors.update_profile.current_password.required}
                          </Form.Text>
                        ) : null}
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connector(Profil);
