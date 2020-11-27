import Form from 'base-components/Form';
import Input from 'base-components/Input';
import Label from 'base-components/Label';
import Modal from 'base-components/Modal';
import Submit from 'base-components/Submit';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import * as yup from 'yup';
import errors from 'helpers/error-messages.json';
import Button from 'base-components/Button';

const ConfirmPassword: React.FC<{
  onCancel: () => void;
  onSubmit: (password: string) => Promise<boolean>;
}> = ({ onCancel, onSubmit }) => {
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const [passwordError, setPasswordError] = useState(false);

  return (
    <Modal show={true}>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={async ({ password }, { setSubmitting }) => {
          setSubmitting(true);
          const error = await onSubmit(password);
          setPasswordError(error);
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
              {typeof passwordError === 'string' && (
                <Form.Text className="text-red-600">{passwordError}</Form.Text>
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
