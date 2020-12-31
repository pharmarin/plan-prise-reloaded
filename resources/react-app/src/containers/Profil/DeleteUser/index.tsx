import { AxiosError } from 'axios';
import Button from 'components/Button';
import Form from 'components/Form';
import Label from 'components/Label';
import ConfirmPassword from 'containers/App/Authentification/ConfirmPassword';
import { useApi } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import User from 'models/User';
import React, { useState } from 'react';

const DeleteUser = observer(({ user }: { user: User }) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<AxiosError | undefined>(undefined);

  const api = useApi();

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
          errorMessage={error?.response?.data?.errors?.[0].title}
          onCancel={() => setShowForm(false)}
          onSubmit={async (password) => {
            return api
              .request(`users/${user.meta.id}`, 'DELETE', {
                meta: { password },
              })
              .then(() => true)
              .catch((error) => {
                setError(error);
                return false;
              });
          }}
        />
      )}
    </div>
  );
});

export default DeleteUser;
