import useAxios from 'axios-hooks';
import Button from 'components/Button';
import Form from 'components/Form';
import Label from 'components/Label';
import ConfirmPassword from 'containers/App/Authentification/ConfirmPassword';
import { requestUrl } from 'helpers/hooks/use-json-api';
import React, { useState } from 'react';

const DeleteUser = ({ id, setUser }: Props.Frontend.App.DeleteUser) => {
  const [showForm, setShowForm] = useState(false);

  //TODO: Utiliser datx pour supprimer l'utilisateur
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
          errorMessage={error?.response?.data?.errors?.[0].detail}
          onCancel={() => setShowForm(false)}
          onSubmit={async (password) => {
            try {
              await deleteUser({ data: { meta: { password } } });
              setUser({}, false);
              return true;
            } catch {
              return false;
            }
          }}
        />
      )}
    </div>
  );
};

export default DeleteUser;
