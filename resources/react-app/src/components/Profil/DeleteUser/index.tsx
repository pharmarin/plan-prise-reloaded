import useAxios from 'axios-hooks';
import Button from 'base-components/Button';
import Form from 'base-components/Form';
import Label from 'base-components/Label';
import ConfirmPassword from 'components/App/Authentification/ConfirmPassword';
import { requestUrl } from 'helpers/hooks/use-json-api';
import React, { useState } from 'react';

const DeleteUser = ({ id }: Props.Frontend.App.DeleteUser) => {
  const [showForm, setShowForm] = useState(false);

  const [{ error }, deleteUser] = useAxios(
    {
      url: requestUrl('users', {
        id,
      }).url,
      method: 'DELETE',
    },
    { manual: true }
  );

  return (
    <div>
      <Label>Demander la suppression immédiate de mon compte</Label>
      <Button className="mt-1" color="red" onClick={() => setShowForm(true)}>
        Supprimer mon compte
      </Button>
      <Form.Text>
        La suppression de votre compte sera immédiate et ne pourra pas être
        annulée.
      </Form.Text>
      {showForm && (
        <ConfirmPassword
          onCancel={() => setShowForm(false)}
          onSubmit={async (password) => {
            console.log(password);
            try {
              await deleteUser({ data: { meta: { password } } });
              return true;
            } catch {
              return error?.response?.data?.errors?.[0].detail || false;
            }
          }}
        />
      )}
    </div>
  );
};

export default DeleteUser;
