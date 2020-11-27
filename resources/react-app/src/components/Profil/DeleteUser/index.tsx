import Button from 'base-components/Button';
import Form from 'base-components/Form';
import Label from 'base-components/Label';
import React from 'react';

const DeleteUser = () => {
  return (
    <div>
      <Label>Demander la suppression immédiate de mon compte</Label>
      <Button className="mt-1" color="red">
        Supprimer mon compte
      </Button>
      <Form.Text>
        La suppression de votre compte sera immédiate et ne pourra pas être
        annulée.
      </Form.Text>
    </div>
  );
};

export default DeleteUser;
