import React, { useContext, useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Col, FormGroup, Label, Form, FormText, Button } from 'reactstrap';
import { updateAppNav } from 'store/app';
import { cloneDeep } from 'lodash-es';
import { SanctumContext } from 'react-sanctum';
import { Formik } from 'formik';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import { Input, Submit } from 'formstrap';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type ProfilProps = ConnectedProps<typeof connector>;

const Profil: React.FunctionComponent<ProfilProps> = ({ updateAppNav }) => {
  const { user } = useContext<ContextProps>(SanctumContext);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    updateAppNav({
      title: 'Profil',
    });
  }, [updateAppNav]);

  if (!user) throw new Error("L'utilisateur n'a pas pu être chargé");

  const readOnly = {
    plaintext: !isEditing,
    disabled: !isEditing,
  };

  return (
    <Col className="mx-auto" md="6">
      <Formik
        initialValues={{
          display_name: user.data.attributes.display_name,
          email: user.data.attributes.email,
          name: user.data.attributes.name,
          rpps: user.data.attributes.rpps,
          status: user.data.attributes.status,
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
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
        })}
      >
        {({ handleSubmit, isValid, resetForm, setFieldValue, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup row>
              <Label for="name" sm="4">
                Nom et prénom
              </Label>
              <Col sm="8">
                <Input
                  autoComplete="name"
                  name="name"
                  placeholder={isEditing ? 'Nom et prénom' : ''}
                  {...readOnly}
                  required
                  withFeedback
                  withLoading
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm="4">Statut</Label>
              <Col sm="8">
                <FormGroup>
                  {values.status === 'student' ? (
                    isEditing ? (
                      <Button
                        className="mt-2"
                        color="link"
                        onClick={() => setFieldValue('status', 'pharmacist')}
                        size="sm"
                      >
                        Modifier en compte pharmacien
                      </Button>
                    ) : (
                      <span className="form-control-plaintext">Étudiant</span>
                    )
                  ) : (
                    <span className="form-control-plaintext">Pharmacien</span>
                  )}
                </FormGroup>
              </Col>
            </FormGroup>
            {values.status === 'pharmacist' && (
              <FormGroup row>
                <Label for="name" sm="4">
                  N° RPPS
                </Label>
                <Col sm="8">
                  <Input
                    autoComplete="off"
                    name="rpps"
                    placeholder={isEditing ? 'N° RPPS' : ''}
                    {...readOnly}
                    withFeedback
                    withLoading
                  />
                </Col>
              </FormGroup>
            )}
            <FormGroup row>
              <Label for="name" sm="4">
                Nom de la structure (optionnel)
              </Label>
              <Col sm="8">
                <Input
                  autoComplete="off"
                  name="display_name"
                  placeholder={isEditing ? 'Nom de la structure' : ''}
                  {...readOnly}
                  withFeedback
                  withLoading
                />
                <FormText color="muted">
                  Si indiqué, le nom de la structure apparaitra à la place de
                  votre nom sur le plan de prise
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="email" sm="4">
                Adresse mail
              </Label>
              <Col sm="8">
                <Input
                  autoComplete="email"
                  name="email"
                  placeholder={isEditing ? 'Adresse mail' : ''}
                  {...readOnly}
                  type="email"
                  withFeedback
                  withLoading
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password-edit" sm="4">
                Mot de passe
              </Label>
              <Col sm="8">
                <Button className="mt-2" color="link" size="sm">
                  Modifier le mot de passe
                </Button>
              </Col>
            </FormGroup>
            <Col
              className="p-0"
              lg={{ size: 8, offset: 2 }}
              xl={{ size: 6, offset: 3 }}
            >
              <Button
                block
                color="light"
                onClick={() => {
                  resetForm();
                  setIsEditing(!isEditing);
                }}
                size="sm"
              >
                {isEditing ? 'Annuler' : 'Modifier'}
              </Button>
              {isEditing && (
                <Submit
                  block
                  color="success"
                  disabled={!isValid}
                  withLoading
                  withSpinner
                >
                  Valider les modifications
                </Submit>
              )}
            </Col>
          </Form>
        )}
      </Formik>
    </Col>
  );
};

export default connector(Profil);
