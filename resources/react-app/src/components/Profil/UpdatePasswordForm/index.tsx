import { Formik } from 'formik';
import { Input, Submit } from 'formstrap';
import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  FormText,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import useAxios from 'axios-hooks';
import { requestUrl } from 'helpers/hooks/use-json-api';

const UpdatePasswordForm = ({
  isOpen,
  toggle,
  user,
}: Props.Frontend.App.UpdatePasswordForm) => {
  const [{ error }, update] = useAxios(
    {
      method: 'PATCH',
      url: requestUrl('users', { id: user.data.id }).url,
    },
    {
      manual: true,
    }
  );

  return (
    <Modal
      centered
      fade
      isOpen={isOpen}
      // No toggle prop, to prevent backdrop or keyboard toggle
      unmountOnClose
    >
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
                data: { id: user.data.id, type: 'users', attributes: values },
              },
            });

            toggle();
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
            <ModalHeader toggle={isSubmitting ? undefined : toggle}>
              Modification du mot de passe
            </ModalHeader>
            <ModalBody>
              <input
                autoComplete="off"
                name="email"
                type="hidden"
                value={user.data.attributes.email}
              />
              <FormGroup row>
                <Label for="name" sm="4">
                  Mot de passe actuel
                </Label>
                <Col sm="8">
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
                    <FormText color="danger">
                      {errors.update_profile.current_password.required}
                    </FormText>
                  ) : null}
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="name" sm="4">
                  Nouveau mot de passe
                </Label>
                <Col sm="8">
                  <Input
                    autoComplete="new-password"
                    name="password"
                    placeholder="Nouveau mot de passe"
                    type="password"
                    withFeedback
                    withLoading
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="name" sm="4">
                  Confirmation
                </Label>
                <Col sm="8">
                  <Input
                    autoComplete="new-password"
                    name="password_confirmation"
                    placeholder="Confirmation du nouveau mot de passe"
                    type="password"
                    withFeedback
                    withLoading
                  />
                </Col>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Submit color="success" withLoading withSpinner>
                Enregistrer
              </Submit>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default UpdatePasswordForm;
