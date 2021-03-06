import Button from 'components/Button';
import Form from 'components/Form';
import Input from 'components/Input';
import Label from 'components/Label';
import Modal from 'components/Modal';
import Submit from 'components/Submit';
import { Formik } from 'formik';
import errors from 'helpers/error-messages.json';
import React, { useRef } from 'react';
import * as yup from 'yup';

const ConfirmPassword: React.FC<{
  errorMessage?: string;
  onCancel: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}> = ({ errorMessage, onCancel, onSubmit }) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);

  return (
    <Modal show={true}>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={async ({ password }, { setSubmitting }) => {
          setSubmitting(true);
          await onSubmit(password);
        }}
        validationSchema={yup.object().shape({
          password: yup
            .string()
            .required(errors.update_profile.current_password.required),
        })}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Content icon="danger">
              <p>
                Nous vous demandons de confirmer votre mot de passe avant de
                procéder à la suppression de votre compte.
              </p>
              <p>
                Une fois la procédure amorcée, toutes les données rattachées à
                votre compte seront définitivement supprimées.
              </p>
              <p>
                Aucune annulation n'est possible après avoir confirmé la
                suppression de votre compte.
              </p>
              <Label className="mt-4">Confirmez votre mot de passe</Label>
              <Input
                name="password"
                type="password"
                ref={passwordRef}
                withFeedback
                withLoading
              />
              {typeof errorMessage === 'string' && (
                <Form.Text className="text-red-600">{errorMessage}</Form.Text>
              )}
            </Modal.Content>
            <Modal.Footer>
              <Submit className="w-full" color="red" withLoading withSpinner>
                Confirmer
              </Submit>
              <Button
                className="w-full sm:mr-2"
                color="light"
                onClick={onCancel}
              >
                Annuler
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ConfirmPassword;
