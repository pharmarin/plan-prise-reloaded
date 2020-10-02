import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Button,
  Col,
  FormGroup,
  Label,
  Input,
  FormText,
  Form,
} from 'reactstrap';
import { BsCheck, BsX } from 'react-icons/bs';
import { updateAppNav } from 'store/app';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import CatchableError from 'helpers/catchable-error';
import map from 'lodash/map';
import find from 'lodash/find';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type PropsFromRedux = WithSanctumProps<Models.User> &
  ConnectedProps<typeof connector>;

const Profil: React.FunctionComponent<PropsFromRedux> = (props) => {
  const { user, updateAppNav } = props;
  const [isEditing, setIsEditing] = useState<{
    field: string | false;
    initial?: string;
  }>({ field: false });

  useEffect(() => {
    updateAppNav({
      title: 'Profil',
    });
  }, [updateAppNav]);

  if (!user) throw new CatchableError("L'utilisateur n'a pas pu être chargé");

  const [formData, setFormData] = useState<Models.User>(cloneDeep(user));

  const fields = [
    {
      id: 'name',
      label: 'Nom et Prénom',
      autocomplete: 'name',
      type: 'text' as 'text',
    },
    {
      id: 'rpps',
      label: 'RPPS',
      type: 'text' as 'text',
    },
    {
      id: 'display_name',
      label: 'Nom affiché',
      autocomplete: 'organization',
      fallback: 'name',
      text: 'Sera imprimé sur les documents',
      type: 'text' as 'text',
    },
    {
      id: 'email',
      label: 'Email',
      autocomplete: 'email',
      type: 'email' as 'email',
    },
    {
      id: 'current-password',
      label: 'Mot de passe',
      autocomplete: 'current-password',
      placeholder: '**********',
      type: 'password' as 'password',
    },
    {
      id: 'new-password-1',
      label: 'Nouveau mot de passe',
      autocomplete: 'new-password',
      extends: 'current-password',
    },
    {
      id: 'new-password-2',
      label: 'Confirmation',
      autocomplete: 'new-password',
      extends: 'current-password',
    },
  ];

  return (
    <Form>
      {map(fields, (field) => {
        if (field.extends && isEditing.field !== field.extends) return null;
        const isReadOnly =
          isEditing.field !== field.id && isEditing.field !== field.extends;
        return (
          <FormGroup key={field.id} row>
            <Label for={field.id} sm="3">
              {field.label}
              {field.text && (
                <FormText className="text-muted">{field.text}</FormText>
              )}
            </Label>
            <Col sm="6">
              <Input
                autoComplete={field.autocomplete}
                value={
                  formData[field.id] ||
                  (field.fallback && formData[field.fallback]) ||
                  ''
                }
                name={field.id}
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
                placeholder={field.placeholder}
                plaintext={isReadOnly}
                readOnly={isReadOnly}
                type={
                  field.extends
                    ? (find(fields, ['id', field.extends]) || {}).type
                    : field.type
                }
              />
            </Col>
            <Col sm="3">
              {!field.extends &&
                (isReadOnly ? (
                  <Button
                    block
                    color="link"
                    onClick={() =>
                      setIsEditing({
                        field: field.id,
                        initial: cloneDeep(formData[field.id]),
                      })
                    }
                  >
                    Modifier
                  </Button>
                ) : (
                  <React.Fragment>
                    <Button
                      className="ml-auto"
                      color="success"
                      onClick={() => setIsEditing({ field: false })}
                    >
                      <BsCheck />
                    </Button>
                    <Button
                      className="mr-auto"
                      color="danger"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          ...(includes(field.id, 'password')
                            ? {
                                'current-password': undefined,
                                'new-password-1': undefined,
                                'new-password-2': undefined,
                              }
                            : { [field.id]: isEditing.initial }),
                        });
                        setIsEditing({ field: false });
                      }}
                    >
                      <BsX />
                    </Button>
                  </React.Fragment>
                ))}
            </Col>
          </FormGroup>
        );
      })}
    </Form>
  );
};

export default connector(withSanctum(Profil));
