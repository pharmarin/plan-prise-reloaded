import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { updateAppNav } from 'store/app';

interface IFormInput {
  denomination: string;
  lastName: string;
  age: number;
}

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type MedicamentEditProps = ConnectedProps<typeof connector> &
  IProps.Backend.MedicamentEdit;

const MedicamentEdit = ({ medicament, updateAppNav }: MedicamentEditProps) => {
  console.log('medicament: ', medicament);
  const { register, handleSubmit } = useForm<IFormInput>();
  const onSubmit = (data: IFormInput) => console.log(data);

  useEffect(() => {
    updateAppNav({
      title: `Modification de ${medicament.denomination}`,
      returnTo: {
        path: '/admin',
        label: 'arrow-left',
      },
    });
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>Dénomination</Label>
        <Input
          name="denomination"
          defaultValue={medicament.denomination || ''}
          innerRef={register({ required: true })}
        />
      </FormGroup>
      <FormGroup>
        <Label>Composition</Label>
        {(medicament.composition || []).map((c) => (
          //Utiliser react-select
          <Input
            key={c?.id || 'n'}
            name="composition[]"
            defaultValue={c?.denomination || ''}
            innerRef={register({ required: true })}
          />
        ))}
      </FormGroup>
      <Button type="submit">Enregistrer</Button>
    </Form>
  );
};

export default connector(MedicamentEdit);
